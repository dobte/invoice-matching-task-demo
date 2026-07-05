from otree.api import *

import json
import statistics

doc = """
Invoice Matching Task (Live) — streams every task event to the server in
real time, stores each event as a database row, and computes metrics
server-side that are saved to the player and pushed back to the page as
the task progresses.
"""


class C(BaseConstants):
    NAME_IN_URL = 'invoice_task_live'
    PLAYERS_PER_GROUP = None
    NUM_ROUNDS = 1


class Subsession(BaseSubsession):
    pass


class Group(BaseGroup):
    pass


class Player(BasePlayer):
    num_rounds = models.IntegerField(initial=0)
    num_correct = models.IntegerField(initial=0)
    accuracy = models.FloatField(initial=0.0)
    mean_reaction_time_ms = models.FloatField(initial=0.0)
    median_reaction_time_ms = models.FloatField(initial=0.0)
    best_streak = models.IntegerField(initial=0)
    max_difficulty_reached = models.IntegerField(initial=1)


class InvoiceEvent(ExtraModel):
    """One row per invoiceTaskEvent received over the live channel."""

    player = models.Link(Player)
    sequence = models.IntegerField()
    event_type = models.StringField()
    unix_ms = models.IntegerField()
    round_index = models.IntegerField(blank=True)
    current_difficulty = models.IntegerField(blank=True)
    is_correct = models.BooleanField(blank=True)
    reaction_time_ms = models.IntegerField(blank=True)
    raw = models.LongStringField()


def _compute_metrics(player: Player):
    events = InvoiceEvent.filter(player=player)
    submissions = sorted(
        (e for e in events if e.event_type == 'roundSubmitted'), key=lambda e: e.sequence
    )

    num_rounds = len(submissions)
    num_correct = sum(1 for e in submissions if e.is_correct)
    accuracy = round(num_correct / num_rounds, 4) if num_rounds else 0.0

    reaction_times = [e.reaction_time_ms for e in submissions if e.reaction_time_ms is not None]
    mean_rt = round(statistics.mean(reaction_times), 1) if reaction_times else None
    median_rt = round(statistics.median(reaction_times), 1) if reaction_times else None

    best_streak = 0
    current_streak = 0
    for e in submissions:
        if e.is_correct:
            current_streak += 1
            best_streak = max(best_streak, current_streak)
        else:
            current_streak = 0

    difficulties = [e.current_difficulty for e in events if e.current_difficulty is not None]
    max_difficulty = max(difficulties) if difficulties else 1

    player.num_rounds = num_rounds
    player.num_correct = num_correct
    player.accuracy = accuracy
    player.mean_reaction_time_ms = mean_rt
    player.median_reaction_time_ms = median_rt
    player.best_streak = best_streak
    player.max_difficulty_reached = max_difficulty

    return dict(
        numRounds=num_rounds,
        numCorrect=num_correct,
        accuracy=accuracy,
        meanReactionTimeMs=mean_rt,
        medianReactionTimeMs=median_rt,
        bestStreak=best_streak,
        maxDifficultyReached=max_difficulty,
    )


class InvoiceTaskLive(Page):
    @staticmethod
    async def live_method(player: Player, data):
        detail = data.get('event') if isinstance(data, dict) else None
        if not isinstance(detail, dict):
            return

        event_type = detail.get('eventType', 'unknown')

        InvoiceEvent.create(
            player=player,
            sequence=detail.get('sequence') or 0,
            event_type=event_type,
            unix_ms=detail.get('unixMs') or 0,
            round_index=detail.get('roundIndex'),
            current_difficulty=detail.get('currentDifficulty'),
            is_correct=detail.get('isCorrect'),
            reaction_time_ms=detail.get('reactionTimeMs'),
            raw=json.dumps(detail),
        )

        response = dict(eventType=event_type)

        if event_type in ('roundSubmitted', 'difficultyChanged', 'taskFinished'):
            response['metrics'] = _compute_metrics(player)

        if event_type == 'taskFinished':
            response['done'] = True

        yield {player.id_in_group: response}


class Results(Page):
    @staticmethod
    def vars_for_template(player: Player):
        events = sorted(InvoiceEvent.filter(player=player), key=lambda e: e.sequence)
        rows = [dict(idx=i, type=e.event_type, json=e.raw) for i, e in enumerate(events)]
        metrics = dict(
            num_rounds=player.num_rounds,
            num_correct=player.num_correct,
            accuracy_pct=round(player.accuracy * 100) if player.num_rounds else None,
            mean_reaction_time_ms=(
                round(player.mean_reaction_time_ms) if player.mean_reaction_time_ms is not None else None
            ),
            median_reaction_time_ms=(
                round(player.median_reaction_time_ms) if player.median_reaction_time_ms is not None else None
            ),
            best_streak=player.best_streak,
            max_difficulty_reached=player.max_difficulty_reached,
        )
        return dict(rows=rows, metrics=metrics)


def custom_export(players):
    """One row per InvoiceEvent, across all players."""
    yield [
        'session_code',
        'participant_code',
        'sequence',
        'event_type',
        'unix_ms',
        'round_index',
        'current_difficulty',
        'is_correct',
        'reaction_time_ms',
        'raw',
    ]
    for player in players:
        events = sorted(InvoiceEvent.filter(player=player), key=lambda e: e.sequence)
        for e in events:
            yield [
                player.session.code,
                player.participant.code,
                e.sequence,
                e.event_type,
                e.unix_ms,
                e.round_index,
                e.current_difficulty,
                e.is_correct,
                e.reaction_time_ms,
                e.raw,
            ]


page_sequence = [InvoiceTaskLive, Results]
