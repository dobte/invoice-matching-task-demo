# Invoice Matching Task — Walkthrough

There are two parts here:

1. **`configurator/`** — a standalone page for configuring the task and
   generating embed code. No installation needed, just open it in a browser.
2. **`otree-live-demo/`** — a working oTree project with the task already
   wired up to stream data to the server in real time. This needs Python
   and oTree installed.

---

## Part 1 — Configure the task

1. Open `configurator/configurator.html`.
2. On the left, change a few settings — try a different **starting
   difficulty**, **task duration**, and toggle **show difficulty**. Watch
   the live preview on the right update as you change things.
3. Once you're happy with the setup, click the **oTree** tab (next to
   "HTML") above the generated code panel, then click the **Live** sub-tab
   (next to "Basic").
4. Click **↓ Download InvoiceTaskLive.html**. This downloads a complete,
   ready-to-use file with your configuration already built in — save it
   somewhere you can find it

<details>
<summary>Alternative: copy-paste instead of downloading</summary>

If you'd rather copy-paste than overwrite a file, the generated code panel
still shows the `<invoice-matching-task ...>` element on its own — copy
**just that line** (not the code below it, which is for a different,
simpler integration style) and paste it into
`otree-live-demo/invoice_task_live/InvoiceTaskLive.html`, replacing the
existing `<invoice-matching-task ...>` element there.
</details>

## Part 2 — Run it with live data collection

1. **Install prerequisites** (skip if already installed):
   - Python 3.10+
   - `pip install -r otree-live-demo/requirements.txt`
2. **Drop in your configured task**: take the `InvoiceTaskLive.html` you
   downloaded in Part 1 and use it to **overwrite**
   `otree-live-demo/invoice_task_live/InvoiceTaskLive.html`.
3. **Run the server**:
   ```
   cd otree-live-demo
   otree devserver
   ```
   Then open `http://localhost:8000` in your browser.
4. Click into the **Invoice Matching Demo (Live)** session and play through
   the task once, as a participant would. Notice the **Live metrics** panel
   below the task — it updates after every round (this is the server
   computing your accuracy/reaction time and sending it back live, not the
   page calculating it locally).
5. **Now switch to the researcher's perspective.** Click **"Data"** in the
   top navigation bar (`http://localhost:8000/ExportIndex`) — not
   "Sessions", which hides sessions started via the Demo shortcut you just
   used. Under **"Per-app data"**, find the `invoice_task_live` row and
   download its CSV. Open it and find the columns for accuracy, reaction
   time, and best streak.

That's the full loop: configure → embed → run → collect data.