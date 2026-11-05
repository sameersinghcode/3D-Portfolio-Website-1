---
description: Do the next docs/ROADMAP.md item end-to-end, then deploy
disable-model-invocation: true
argument-hint: "[item id]"
model: sonnet
---
Open items:
!`grep -n '^- \[ \]' docs/ROADMAP.md | head -5`

Do item "$ARGUMENTS" (empty = first above):
1. Read only that item's notes and the files it names. If it needs info from the user that you don't have, ask in one line and stop.
2. Make the smallest correct change. No screenshots.
3. `cd MY-3D-Project1 && ([ -d node_modules ] || npm ci --silent) && npm run build 2>&1 | tail -3`; fix any failure.
4. Tick it (`- [x]`) in docs/ROADMAP.md. Add any follow-up you found as a new unchecked item.
5. Commit `<id>: <title>`, then `git push origin HEAD:main`.

Reply ≤3 lines: what changed · commit hash · anything the user must do.
