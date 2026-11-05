---
description: Build-check, commit and push current changes to main (deploys)
disable-model-invocation: true
argument-hint: "[commit message]"
model: sonnet
effort: low
---
Changes:
!`git status --short`

If there are none, say so and stop. Otherwise:
1. `cd MY-3D-Project1 && ([ -d node_modules ] || npm ci --silent) && npm run build 2>&1 | tail -3`. Stop and report if it fails.
2. `git add -A && git commit -m "<$ARGUMENTS, or a 5-word summary of the diff>"`
3. `git push origin HEAD:main`

Reply with one line: the commit hash.
