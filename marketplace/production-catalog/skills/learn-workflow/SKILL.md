---
name: learn-workflow
description: "Turn a task the user demonstrates into a reusable OpenBot skill. Capture the goal, observable steps, decisions, inputs, outputs, safety boundaries, recovery rules and a verification checklist. Use when the user says teach this task, remember how I do this, make this repeatable, or create a skill from this workflow."
---

# Learn workflow

Convert a demonstrated procedure into a reusable skill without pretending that the model was fine-tuned.

1. Observe before writing. Read the current conversation, files, browser state and completed tool results that belong to the task. Separate facts you observed from guesses. Ask only for information that blocks a correct reusable procedure.
2. Write the workflow in behavioral terms. Record the goal, required inputs, preconditions, ordered actions, decision points, expected outputs, failure recovery, permissions and the final verification. Do not encode temporary ids, one-time tokens, account secrets or machine-specific paths unless the user explicitly wants a local-only skill.
3. Preserve the user's successful method. Prefer the steps that actually produced the result over a generic best-practice rewrite. When two demonstrations disagree, keep the conflict explicit and ask which rule should win.
4. Make the skill robust. Use stable selectors, names and invariants instead of coordinates or brittle timing. For browser work, inspect a fresh page state before each action. For files, verify the target path and output. For external actions, keep the normal OpenBot approvals.
5. Create a small verification checklist. A learned workflow is not ready until a dry run or an equivalent safe check proves that its key steps, outputs and failure conditions are understandable.
6. Save only after review. Draft the new SKILL.md in the agent workspace. Show the user the skill name, trigger description and concise step summary. When they approve saving, use OpenBot's local skill tools to create or revise the skill and install it for the requested agent. Do not overwrite an unrelated skill.
7. On later runs, follow the skill but adapt to the current state. A saved workflow is a procedure, not permission to ignore changed pages, files, approvals or user instructions.

For a long capture or validation, keep the user informed through the normal OpenBot plan and progress surfaces. If parallel agents can independently inspect different parts of the workflow, delegate those parts and merge only verified findings.

Reply with the reusable workflow, what was verified, and any condition that still needs a human decision.
