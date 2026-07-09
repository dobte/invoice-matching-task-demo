# Invoice Matching Task — Walkthrough

There are two parts here:

1. **`configurator/`** — a standalone page for configuring the task and
   generating embed code. No installation needed, just open it in a browser.
2. **`otree-live-demo/`** — a working oTree project with one ready-to-run
   demo already wired up. This needs Python and oTree installed.

The demo always involves **two roles**: the **participant** does the task,
and the **operator** watches live results. What the operator's page actually
shows depends on a single setting — **Adaptive difficulty** — decided at
runtime, not by picking a different file or session:

| Adaptive difficulty | Operator sees | What's happening |
|---|---|---|
| **On** (default) | A read-only **Live metrics** panel | The component's own built-in adaptive algorithm runs the task; the server streams every event live and computes metrics (accuracy, reaction time, streaks) in real time. |
| **Off** | The same metrics panel, plus a full **difficulty control** panel | A Python rule sets difficulty automatically by default, and the operator can take over by hand at any time. |

The walkthrough below covers what to click. For the exact rules — how
difficulty is decided, what each level is, how reaction time is measured, and
what every exported column means — see
[How it actually works](#how-it-actually-works) at the bottom.

---

## Part 1 — Configure the task

1. Open `configurator/configurator.html`.
2. On the left, change a few settings — try a different **task duration**
   and toggle **show difficulty**. Watch the live preview on the right
   update as you change things.
3. Click the **Generated Code** tab at the top of the page.
4. Look at the **Adaptive difficulty** switch (Difficulty group, left panel)
   — leave it on, or turn it off. Either way, the download button stays
   **↓ Download InvoiceTaskUnified.html**; only what the operator sees at
   runtime changes.
5. Click the download button. This downloads a complete, ready-to-use file
   with your configuration already built in — save it somewhere you can
   find it.

<details>
<summary>Alternative: copy-paste instead of downloading</summary>

If you'd rather copy-paste than overwrite a file, the generated code panel
still shows the `<invoice-matching-task ...>` element on its own — copy
**just that line** and paste it into
`otree-live-demo/invoice_task_unified/InvoiceTaskUnified.html`, in the
**participant** section (the part after `{{ else }}` — leave the operator
control-panel section above it alone).
</details>

## Part 2 — Run it

1. **Set up a virtual environment** (skip if you already have one for this
   project):
   ```
   cd otree-live-demo
   python -m venv venv
   ```
   Activate it:
   - Windows (PowerShell): `venv\Scripts\Activate.ps1`
   - Windows (cmd.exe): `venv\Scripts\activate.bat`
   - Mac/Linux: `source venv/bin/activate`

   Your prompt should now show `(venv)` at the start of the line — that
   confirms it's active. Then install requirements: `pip install -r requirements.txt`
2. **Drop in your configured task** — overwrite
   `otree-live-demo/invoice_task_unified/InvoiceTaskUnified.html` with what
   you downloaded in Part 1.
3. **Run the server** (from inside `otree-live-demo/`, with the venv still
   active):
   ```
   otree devserver
   ```
   Then open `http://localhost:8000` in your browser.

<details>
<summary>"otree is not recognized" / command not found</summary>

This means the venv isn't active in your current terminal, so `otree` isn't
on your PATH — either the activation step above was skipped, or (common on
Windows) PowerShell's script-execution policy silently blocked `Activate.ps1`
from running. Check for `(venv)` at the start of your prompt; if it's
missing, `otree` won't be found.

**Simplest fix — add the venv's Scripts to PATH for this terminal only.**
No activation needed, and the normal `otree devserver` (with auto-reload)
works fully afterwards:
```powershell
$env:Path = "<path-to-venv>\Scripts;$env:Path"
otree devserver
```

**Or activate properly**, working around the execution policy in one line
(the `-Scope Process` bypass only affects this terminal):
```powershell
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
& "<path-to-venv>\Scripts\Activate.ps1"
otree devserver
```

**Zero-setup fallback (no auto-reload).** Call the venv's `otree.exe` by full
path and use `devserver_inner` instead of `devserver`: plain `devserver`
spawns its reload worker as a *subprocess* looked up as `otree` on PATH,
which fails the same way if PATH isn't set up, whereas `devserver_inner`
serves in this process directly. The cost is no auto-reload on `.py` edits —
restart manually after editing `__init__.py`; `.html` template edits are read
fresh automatically:
```powershell
& "<path-to-venv>\Scripts\otree.exe" devserver_inner 8000
```

(`python -m otree` does **not** work here — the package ships an empty
`__main__.py`.)
</details>

4. Click into **Invoice Matching Demo**. You'll land on a page with
   **single-use links**, one per row: **P1** and **P2**.
5. Open **P1's link** in one tab and **P2's link** in another (oTree's own
   page here says exactly this: "Open each link in its own browser tab").
   - The **P1 tab** is the participant view — the task itself.
   - The **P2 tab** is the operator view. It starts on "Waiting for
     participant to start…" until P1's task actually begins.
6. **In the P1 tab**, play the task — pick invoices that sum to the target
   amount and click Post.
7. **Switch to the P2 tab.** What you see next depends on what you
   configured in Part 1:

### If you left Adaptive difficulty on

The operator page settles on a read-only **Live metrics** panel (rounds,
accuracy, reaction time, streaks, max difficulty reached) and a note that
the built-in algorithm is in control — there's nothing to click. Keep
playing in the P1 tab and watch the metrics update after every round.

**Researcher's perspective:** click **"Data"** in the top navigation bar
(`http://localhost:8000/ExportIndex`) . Under
**"Custom exports"**, find `invoice_task_unified (custom_export)` and
download its CSV — one row per event (rounds, difficulty changes,
start/finish), same as you'd get from any run.

### If you turned Adaptive difficulty off

The operator page settles on the same metrics panel, plus a full
**difficulty control** panel: a mode indicator, six "Set level N" buttons,
a live status readout, and a decision log.

8. Answer **a few rounds correctly in a row** in the P1 tab. Watch the P2
   tab: the status panel updates after every round, and once the built-in
   rule sees enough correct answers, the decision log shows *"Algorithm set
   difficulty to N"* — the mode indicator stays on "Automatic".
9. **Now click any "Set level" button in the P2 tab.** The mode indicator
   flips to "Manual — you are in control", and the log shows *"You set
   difficulty to N"*.
10. **Switch back to P1** and submit the next round — the difficulty really
    did change to what you picked. From this point on, no matter how many
    more rounds you answer (right or wrong), the difficulty **won't change
    on its own again** — once the operator steps in, they're in control for
    the rest of that run. There's no button to hand control back to the
    algorithm.
11. **Researcher's perspective:** click **"Data"** in the top navigation bar
    (`http://localhost:8000/ExportIndex`). Under **"Custom exports"**, find
    `invoice_task_unified (custom_export)` and download its CSV. Alongside
    the per-event rows, look for the `row_type: difficulty_decision` rows —
    each one is a difficulty change, tagged `decision_source` (`algorithm`
    or `manual`) — this is how you'd tell, after the fact, exactly which
    changes the built-in rule made and which ones a person made by hand. A
    run left adaptive-on the whole time simply has no rows of that kind.

That's the full loop: configure (pick adaptive on/off) → embed → run → collect data.

---

## How it actually works

This section states the exact rules the demo follows, so you can decide
whether the task fits your study and reproduce or audit any run from its
exported data.

### The task itself

Each **round** shows one target **Payment Amount** and a list of invoices.
**Exactly one** subset of the visible invoices adds up to the target — every
round has one and only one correct answer (the generator guarantees this;
rounds that can't be built uniquely are discarded and regenerated). The
participant ticks invoices and clicks **Post**; the submission is scored
correct only if the ticked set is precisely that unique subset.

### What a "difficulty level" is

The level controls how many numbers must be summed and how large they are:

| Level | Invoices in the correct subset | Target amount range |
|---|---|---|
| 1 | 1 two-digit + 1 single-digit | 11–108 |
| 2 | 2 two-digit | 20–198 |
| 3 | 2 two-digit + 1 single-digit | 21–207 |
| 4 | 3 two-digit | 30–297 |
| 5 | 3 two-digit + 1 single-digit | 31–306 |
| 6 | 4 two-digit | 40–396 |

By default a run starts at **level 1** and is capped at **level 3**. To use
levels 4–6, raise **Max difficulty** in the configurator. (The list also
contains distractor invoices that are *not* part of the correct subset;
"Invoices per round" sets the total shown.)

### How difficulty is decided — two separate rules

**These are two different algorithms with different thresholds.** Which one
runs depends entirely on the **Adaptive difficulty** setting you chose:

- **Adaptive difficulty ON** — the **built-in streak rule**, running inside
  the participant's browser: **4 correct answers in a row → move up one
  level; 4 wrong in a row → move down one level.** The counter resets to 0
  after every level change. (These two thresholds are the "Level up / down
  after" fields in the configurator; 4/4 are the defaults.) The server never
  touches difficulty in this mode — it only records and reports.

- **Adaptive difficulty OFF** — a **server-side rolling-window rule**,
  written in Python in this demo (`invoice_task_unified/__init__.py`, function
  `_decide_difficulty`): after each submission it looks at the **last 4
  submissions since the previous difficulty change** and, once there are 4,
  moves **up** if **3 or 4** were correct, **down** if **0 or 1** were
  correct, and leaves the level unchanged otherwise. This rule is independent
  of the "Level up / down after" streak fields above — those only apply to
  the built-in ON algorithm. The moment the operator clicks a level, this
  rule stops being consulted for the rest of the run (see below).

### The one-way operator handover (Adaptive OFF only)

The run starts under the server rolling-window rule (mode: **Automatic**).
When the operator clicks any **Set level N** button, the run switches to
**Manual** *permanently* — the algorithm is never consulted again, and there
is no button to hand control back. Any level the operator sets takes effect
on the **next** round (the round already on screen was generated at the old
level).

### A subtlety worth knowing when you read the raw event log

The component emits a `difficultyChanged` event whenever the level moves. Its
`reason` field is `streak_up` / `streak_down` when the built-in ON algorithm
drove it, but for **any** host-driven change while Adaptive is OFF — whether
the server's rolling-window rule or an operator click — the reason is the
single value `host_set`. The component deliberately does **not** distinguish
algorithm-from-operator in its own event stream. That distinction is
recovered on the server side and shown in the export as
`decision_source: algorithm | manual` (see the CSV columns below).

### Timing and reproducibility

- **`reaction_time_ms`** on a submission is measured from when that round
  appeared to when **Post** was clicked, with any time spent paused during
  the round subtracted out.
- Set a **Random seed** (with fixed invoice order) for reproducible stimuli:
  the same seed generates the identical sequence of rounds. The *difficulty
  trajectory* is then reproducible too **as long as the difficulty rule is
  deterministic** — i.e. an unattended run under either algorithm reproduces,
  but a run where the operator intervened by hand does not (the human clicks
  aren't part of the seed).

### The exported CSV (`invoice_task_unified` custom export)

Admin → **Data** → **Custom exports** → `invoice_task_unified (custom_export)`.
One file, with two kinds of rows per participant interleaved in time order
(`unix_ms`). Operator (P2) players never produce rows of their own — every
row belongs to the participant it describes.

| Column | Appears on | Meaning |
|---|---|---|
| `session_code` | all rows | oTree session code |
| `participant_code` | all rows | the participant (P1) this row belongs to |
| `adaptive_difficulty` | all rows | `True`/`False` — which mode this participant ran in |
| `row_type` | all rows | `invoice_event` or `difficulty_decision` |
| `unix_ms` | all rows | time of the event/decision (ms since epoch); rows are sorted by this |
| `event_sequence` | event rows | the component's monotonic per-run sequence number |
| `event_type` | event rows | `taskStarted` / `roundStarted` / `roundSubmitted` / `difficultyChanged` / `taskFinished` / … |
| `round_index` | where applicable | 0-based round number (blank on a manual decision, which isn't tied to a round) |
| `current_difficulty` | event rows | the level in effect at that event |
| `is_correct` | `roundSubmitted` rows | whether the submitted subset was the correct one |
| `reaction_time_ms` | `roundSubmitted` rows | round time minus in-round pause (see above) |
| `decision_source` | decision rows | `algorithm` or `manual` — who drove this level change |
| `decision_level` | decision rows | the level that was set |
| `raw` | event rows | the full original event as JSON, for any field not broken out above |

A run left **Adaptive ON** the whole time has **no** `difficulty_decision`
rows at all (no host-driven decisions were made) — its full per-event history
still lands in the `invoice_event` rows.
