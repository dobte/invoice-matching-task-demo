from otree.api import *

import json
import statistics
import time

doc = """
Invoice Matching Task with two difficulty modes, selected per run by the
configured <invoice-matching-task> element. Two participants per group: a
participant who runs the task and an operator who monitors it. When adaptive
difficulty is on, the component's built-in algorithm controls difficulty
client-side and the operator sees a read-only metrics view. When it is off,
a server-side rolling-window rule sets difficulty by default and the operator
can take manual control by clicking a level; that handover is one-way for the
rest of the run.
"""


class C(BaseConstants):
    NAME_IN_URL = 'invoice_task_unified'
    PLAYERS_PER_GROUP = 2
    NUM_ROUNDS = 1
    # Rolling-window rule, only ever consulted while adaptive_difficulty is False.
    WINDOW = 4
    LEVEL_UP_MIN_CORRECT = 3
    LEVEL_DOWN_MAX_CORRECT = 1


class Subsession(BaseSubsession):
    pass


def creating_session(subsession: Subsession):
    # Must be a module-level function, not a Subsession method — oTree's
    # session-bootstrap looks up `creating_session` on the app module itself
    # (models_module.Subsession.get_user_defined_target()), not on the
    # Subsession class, so a class-level def here is silently never called.
    for p in subsession.get_players():
        p.task_role = 'operator' if p.id_in_group == 2 else 'participant'


class Group(BaseGroup):
    pass


class Player(BasePlayer):
    task_role = models.StringField()
    # 'auto' | 'manual'. Only meaningful while adaptive_difficulty is False.
    # One-way: once the operator sets a level, this becomes 'manual' for the
    # rest of the run and never reverts.
    control_mode = models.StringField(initial='auto')
    # Read once from taskStarted.effectiveConfig. True means the component's
    # own built-in adaptive algorithm is running client-side — the host must
    # never call setDifficulty() in that case.
    adaptive_difficulty = models.BooleanField(initial=True)
    min_difficulty = models.IntegerField(initial=1)
    max_difficulty = models.IntegerField(initial=6)
    num_algorithm_changes = models.IntegerField(initial=0)
    num_manual_changes = models.IntegerField(initial=0)
    num_rounds = models.IntegerField(initial=0)
    num_correct = models.IntegerField(initial=0)
    ending_difficulty = models.IntegerField(initial=1)
    # Live metrics, recomputed from InvoiceEvent on every roundSubmitted /
    # difficultyChanged / taskFinished. Computed unconditionally, regardless
    # of adaptive_difficulty.
    accuracy = models.FloatField(initial=0.0)
    mean_reaction_time_ms = models.FloatField(initial=0.0)
    median_reaction_time_ms = models.FloatField(initial=0.0)
    best_streak = models.IntegerField(initial=0)
    max_difficulty_reached = models.IntegerField(initial=1)


class InvoiceEvent(ExtraModel):
    """One row per invoiceTaskEvent from the participant's live channel."""

    player = models.Link(Player)
    sequence = models.IntegerField()
    event_type = models.StringField()
    unix_ms = models.IntegerField()
    round_index = models.IntegerField(blank=True)
    current_difficulty = models.IntegerField(blank=True)
    is_correct = models.BooleanField(blank=True)
    reaction_time_ms = models.IntegerField(blank=True)
    raw = models.LongStringField()


class DifficultyDecision(ExtraModel):
    """One row per actually-applied host-driven difficulty change, tagged by
    source. Only ever created while adaptive_difficulty is False; while it is
    True the built-in algorithm runs client-side and this table stays empty
    for that participant. Always linked to the participant's Player row (the
    operator never accumulates its own rows here)."""

    player = models.Link(Player)
    round_index = models.IntegerField(blank=True)
    unix_ms = models.IntegerField()
    source = models.StringField()  # 'algorithm' | 'manual'
    level = models.IntegerField()


def _decide_difficulty(player: Player):
    """
    Looks at the last C.WINDOW roundSubmitted events since the most recent
    difficultyChanged (algorithm- or manual-caused — both emit the same
    component-level event, so the window resets on either kind of change) and
    returns the new level to request via setDifficulty(), or None if no change
    is due this round. Only ever consulted while adaptive_difficulty is False
    and control_mode is 'auto'.
    """
    events = InvoiceEvent.filter(player=player)
    last_change_seq = max(
        (e.sequence for e in events if e.event_type == 'difficultyChanged'), default=0
    )
    submissions = sorted(
        (e for e in events if e.event_type == 'roundSubmitted' and e.sequence > last_change_seq),
        key=lambda e: e.sequence,
    )
    if len(submissions) < C.WINDOW:
        return None

    window = submissions[-C.WINDOW :]
    current_level = window[-1].current_difficulty
    correct_count = sum(1 for e in window if e.is_correct)

    if correct_count >= C.LEVEL_UP_MIN_CORRECT and current_level < player.max_difficulty:
        return current_level + 1
    if correct_count <= C.LEVEL_DOWN_MAX_CORRECT and current_level > player.min_difficulty:
        return current_level - 1
    return None


def _compute_metrics(player: Player):
    """Run unconditionally regardless of adaptive_difficulty."""
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


class InvoiceTaskUnified(Page):
    @staticmethod
    def vars_for_template(player: Player):
        return dict(is_operator=player.task_role == 'operator')

    @staticmethod
    async def live_method(player: Player, data):
        if not isinstance(data, dict):
            return

        if player.task_role == 'participant':
            detail = data.get('event')
            if not isinstance(detail, dict):
                return
            event_type = detail.get('eventType', 'unknown')

            if event_type == 'taskStarted':
                config = detail.get('effectiveConfig') or {}
                player.min_difficulty = config.get('minDifficulty', player.min_difficulty)
                player.max_difficulty = config.get('maxDifficulty', player.max_difficulty)
                player.adaptive_difficulty = config.get(
                    'adaptiveDifficulty', player.adaptive_difficulty
                )

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
            operator = player.get_others_in_group()[0]
            status_push = dict(eventType=event_type, controlMode=player.control_mode)

            if event_type == 'taskStarted':
                # The operator's mode gate and level buttons (when shown at
                # all) must reflect the real configured values — without this
                # the operator page would have nothing to decide its display
                # from until the first roundSubmitted.
                status_push['minDifficulty'] = player.min_difficulty
                status_push['maxDifficulty'] = player.max_difficulty
                status_push['adaptiveDifficulty'] = player.adaptive_difficulty

            if event_type == 'roundSubmitted':
                status_push['detail'] = dict(
                    roundIndex=detail.get('roundIndex'),
                    isCorrect=detail.get('isCorrect'),
                    currentDifficulty=detail.get('currentDifficulty'),
                )
                status_push['metrics'] = _compute_metrics(player)
                # Host-side difficulty logic only runs while the component's
                # own adaptive algorithm is off.
                if not player.adaptive_difficulty and player.control_mode == 'auto':
                    new_level = _decide_difficulty(player)
                    if new_level is not None:
                        response['setDifficulty'] = new_level
                        player.num_algorithm_changes += 1
                        DifficultyDecision.create(
                            player=player,
                            round_index=detail.get('roundIndex'),
                            unix_ms=detail.get('unixMs') or 0,
                            source='algorithm',
                            level=new_level,
                        )
                        status_push['lastChange'] = dict(source='algorithm', level=new_level)

            if event_type == 'difficultyChanged':
                # Covers a manual change too (the operator's own branch below
                # cannot recompute this), so max difficulty reached stays
                # accurate immediately either way.
                status_push['metrics'] = _compute_metrics(player)

            if event_type == 'taskFinished':
                player.ending_difficulty = detail.get('endingLevel', player.ending_difficulty)
                response['done'] = True
                status_push['done'] = True
                status_push['metrics'] = _compute_metrics(player)

            yield {operator.id_in_group: status_push}
            yield {player.id_in_group: response}

        elif player.task_role == 'operator':
            participant = player.get_others_in_group()[0]

            if data.get('init'):
                # Sync the panel on page load — important for an operator who
                # reloads mid-run. Only report mode/range once the
                # participant has actually sent a taskStarted (checked via
                # InvoiceEvent, not the Player field default): before that,
                # adaptive_difficulty still holds its unrevealed field
                # default, and pushing it would let the operator's "waiting"
                # placeholder resolve to a mode that turns out to be wrong
                # once the real taskStarted arrives.
                started = len(InvoiceEvent.filter(player=participant)) > 0
                payload = dict(
                    controlMode=participant.control_mode,
                    metrics=_compute_metrics(participant),
                )
                if started:
                    payload['minDifficulty'] = participant.min_difficulty
                    payload['maxDifficulty'] = participant.max_difficulty
                    payload['adaptiveDifficulty'] = participant.adaptive_difficulty
                yield {player.id_in_group: payload}
                return

            if participant.adaptive_difficulty:
                # Defense-in-depth: the operator UI shouldn't offer the
                # buttons in this mode at all, so this should never actually
                # be hit in normal use.
                return

            level = data.get('setLevel')
            if (
                isinstance(level, int)
                and participant.min_difficulty <= level <= participant.max_difficulty
            ):
                participant.control_mode = 'manual'
                participant.num_manual_changes += 1
                DifficultyDecision.create(
                    player=participant,
                    round_index=None,
                    unix_ms=int(time.time() * 1000),
                    source='manual',
                    level=level,
                )
                yield {participant.id_in_group: dict(setDifficulty=level)}
                yield {player.id_in_group: dict(controlMode='manual', ack=level)}


class Results(Page):
    @staticmethod
    def vars_for_template(player: Player):
        participant = player if player.task_role == 'participant' else player.get_others_in_group()[0]
        events = sorted(InvoiceEvent.filter(player=participant), key=lambda e: e.sequence)
        rows = [dict(idx=i, type=e.event_type, json=e.raw) for i, e in enumerate(events)]
        decisions = sorted(DifficultyDecision.filter(player=participant), key=lambda d: d.unix_ms)
        decision_rows = [
            dict(idx=i, round_index=d.round_index, source=d.source, level=d.level)
            for i, d in enumerate(decisions)
        ]
        # mean/median_reaction_time_ms are None whenever a participant
        # finishes with zero rounds submitted (e.g. the whole-task duration
        # timer expires with no interaction) — a nullable field's value must
        # be read via field_maybe_none(), not plain attribute access, or
        # oTree raises "Accessing a null field is generally considered an
        # error" even from a mere `is not None` check.
        mean_rt = participant.field_maybe_none('mean_reaction_time_ms')
        median_rt = participant.field_maybe_none('median_reaction_time_ms')
        metrics = dict(
            num_rounds=participant.num_rounds,
            num_correct=participant.num_correct,
            accuracy_pct=round(participant.accuracy * 100) if participant.num_rounds else None,
            mean_reaction_time_ms=round(mean_rt) if mean_rt is not None else None,
            median_reaction_time_ms=round(median_rt) if median_rt is not None else None,
            best_streak=participant.best_streak,
            max_difficulty_reached=participant.max_difficulty_reached,
        )
        return dict(
            rows=rows,
            decision_rows=decision_rows,
            metrics=metrics,
            num_rounds=participant.num_rounds,
            num_correct=participant.num_correct,
            num_algorithm_changes=participant.num_algorithm_changes,
            num_manual_changes=participant.num_manual_changes,
            ending_difficulty=participant.ending_difficulty,
            control_mode=participant.control_mode,
            adaptive_difficulty=participant.adaptive_difficulty,
        )


def custom_export(players):
    """One row per InvoiceEvent plus one row per DifficultyDecision, across
    all participant players, interleaved in chronological (unix_ms) order.
    The two row kinds are told apart by `row_type`, not correlated by
    timestamp/round (a decision and the event that applies it do not share a
    timestamp or round_index); `event_*` columns are blank on a decision row
    and `decision_*` columns are blank on an event row.

    adaptive_difficulty is repeated on every row. A participant who ran with
    it True contributes zero decision rows, since there is no host-driven
    decision to report.
    """
    yield [
        'session_code',
        'participant_code',
        'adaptive_difficulty',
        'row_type',
        'unix_ms',
        'event_sequence',
        'event_type',
        'round_index',
        'current_difficulty',
        'is_correct',
        'reaction_time_ms',
        'decision_source',
        'decision_level',
        'raw',
    ]
    for player in players:
        if player.task_role != 'participant':
            continue
        rows = [
            dict(
                row_type='invoice_event',
                unix_ms=e.unix_ms,
                event_sequence=e.sequence,
                event_type=e.event_type,
                round_index=e.round_index,
                current_difficulty=e.current_difficulty,
                is_correct=e.is_correct,
                reaction_time_ms=e.reaction_time_ms,
                decision_source=None,
                decision_level=None,
                raw=e.raw,
            )
            for e in InvoiceEvent.filter(player=player)
        ] + [
            dict(
                row_type='difficulty_decision',
                unix_ms=d.unix_ms,
                event_sequence=None,
                event_type=None,
                round_index=d.round_index,
                current_difficulty=None,
                is_correct=None,
                reaction_time_ms=None,
                decision_source=d.source,
                decision_level=d.level,
                raw=None,
            )
            for d in DifficultyDecision.filter(player=player)
        ]
        for row in sorted(rows, key=lambda r: r['unix_ms']):
            yield [
                player.session.code,
                player.participant.code,
                player.adaptive_difficulty,
                row['row_type'],
                row['unix_ms'],
                row['event_sequence'],
                row['event_type'],
                row['round_index'],
                row['current_difficulty'],
                row['is_correct'],
                row['reaction_time_ms'],
                row['decision_source'],
                row['decision_level'],
                row['raw'],
            ]


page_sequence = [InvoiceTaskUnified, Results]
