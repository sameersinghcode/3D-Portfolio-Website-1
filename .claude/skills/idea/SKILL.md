---
description: Add an idea to the docs/ROADMAP.md Inbox
disable-model-invocation: true
argument-hint: "<idea>"
model: haiku
---
Append `- [ ] I<n> <short title>: $ARGUMENTS` as the last line under `## Inbox` in docs/ROADMAP.md (n = next free number). Change nothing else.
Commit `idea: <short title>`, then `git push origin HEAD:main`.
Reply only "Added I<n>."
