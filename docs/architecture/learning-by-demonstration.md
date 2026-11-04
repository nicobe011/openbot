# Learning by demonstration

OpenBot already keeps memories, captures work steps, creates versioned local skills, and runs routines. This design connects those parts into one learning loop.

## Goal

A user can complete or demonstrate a workflow once, then ask OpenBot to learn it. OpenBot reads the recent conversation and captured work steps, extracts the stable procedure, creates or revises a local skill, and keeps automation separate until the user asks for a routine.

## Clean-room boundary

This implementation uses OpenBot's own interfaces and observable product behavior. It does not copy proprietary client or server source from another product.

## Existing building blocks

- `history_read(includeWorkSteps=true)` returns bounded captured work steps without raw reasoning.
- Local skill tools create, read, revise, install, enable, and remove versioned skills.
- Agent memory review stores durable facts separately from workflows.
- Routines schedule or trigger work after the workflow is proven.
- Browser and approval tools already enforce sign-in, secret, and human-control boundaries.

## Learning loop

```text
recent task or demonstration
        |
        v
conversation + captured work steps
        |
        v
extract stable trigger / inputs / actions / branches / checks
        |
        v
draft local skill
        |
        v
user-visible review and safe test
        |
        +---- correction ----> revise skill
        |
        v
optional routine
```

## Rules

1. A demonstration is evidence, not a complete specification.
2. One-run values must become variables when they are not stable.
3. A learned skill must state its success check.
4. Sign-in, CAPTCHA, payment confirmation, and secrets stay human-controlled.
5. A skill revision is versioned. It must not silently overwrite modified installed files.
6. Memory holds durable facts. Skills hold reusable procedure. Routines hold timing and triggers.
7. Automatic evolution may propose a revision, but changing a user skill requires an explicit user request or approval.

## Evolution phases

### Phase 1: recent-work learning

The managed `openbot-teach-task` skill uses captured work-step history and the local skill library.

### Phase 2: explicit recording session

Add a desktop Teach a Task mode that records visible computer interaction for a bounded session. Store only the artifacts needed to reconstruct the workflow. Do not record microphone audio by default.

The recording pipeline should produce structured events plus optional visual evidence. The learning step consumes those events and creates a draft skill through the same Phase 1 path.

### Phase 3: skill quality review

A background or user-triggered review can propose missing validation, brittle selectors, fixed values, missing empty-state handling, repeated corrections, approval gaps, or opportunities to split one oversized skill. The review creates a proposal. It does not silently modify the installed skill.

### Phase 4: measured evolution

Track local quality signals such as successful completion after using a skill, user correction, repeated retries, approval rejection, or recurring failure at the same step. Use these signals to rank revision proposals. Do not treat model confidence as proof of success.

### Phase 5: routine promotion

When a skill succeeds consistently, the agent may suggest a routine. Creation still requires the user's request. Keep schedule, trigger, and delivery policy out of the skill.

## Data handling

Learning artifacts stay on the host that owns the workspace and conversation. Secret redaction applies before model-facing history is returned. A future visual recording feature must follow the same local-first and redaction rules.
