---
name: openbot-teach-task
description: Learn a reusable workflow from a task the user just demonstrated, completed, corrected, or asked OpenBot to remember. Use when the user says to learn, teach, save, repeat, standardize, or improve a workflow from recent work.
---

# Teach a task

Turn recent work into a reusable local skill. Use evidence from the conversation and captured work steps. Do not guess missing actions.

## When to use

Use this skill when the user asks to learn a workflow they just performed or watched OpenBot perform, save a completed process as a reusable skill, improve an existing skill from corrections or a better run, standardize a repeated manual process, or convert a proven one-time task into a skill before creating a routine.

Do not use it for ordinary one-off work.

## Workflow

1. Identify the demonstrated outcome from the user's request and recent context.
2. Read the recent evidence with `openbot.history_read`. Set `includeWorkSteps=true` for the assistant turn that performed the task. Continue with `workStepsOffset` when needed.
3. Separate stable workflow from one-run details. Extract the trigger, required inputs, tools/apps/folders/sites/accounts, ordered actions, variable values, decision branches, expected output, validation checks, failure conditions, and approval or takeover steps.
4. Never hard-code a date, person, record ID, URL path, filename, or value that was incidental to one demonstration.
5. Call `openbot.list_local_skills`. For a revision, read the existing skill with `openbot.read_local_skill`.
6. Follow `openbot-skill-creator` and build a separate draft folder in the current workspace.
7. Add explicit handling for empty results, stale data, changed page layout, signed-out state, CAPTCHA/passkey/payment confirmation, partial success, bounded retry, destructive actions, and a clear success check.
8. Use `openbot.create_skill` for a new workflow or `openbot.revise_skill` for a revision.
9. Summarize the learned trigger, inputs, important branches, and success check. Recommend one safe test when the workflow changes data or sends something externally.
10. Create or change a routine only when the user asks. A skill describes how. A routine decides when.

## Learning from corrections

When the user corrects a result, compare the correction with the previous work before revising a skill. Prefer a general rule such as "when there are no new records, stop and report no change" over a brittle example such as "click the third row".

A correction becomes a permanent rule only when it matches the user's intent. Do not turn an accidental one-off detail into permanent behavior.

## Safety

- Never store passwords, one-time codes, API keys, card data, session cookies, or other secrets in a skill.
- Never infer approval for future destructive actions from one demonstration.
- Never bypass CAPTCHA, authentication, or site restrictions.
- Never claim the workflow is reliable until its success condition has been checked.
- Keep user-controlled instructions and manual memories authoritative over inferred behavior.
