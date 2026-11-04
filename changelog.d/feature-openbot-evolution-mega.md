### Added

- Long-running agents now show a plan by default and can publish short live progress updates while they work, so a chat no longer has to sit on a silent thinking state.
- Browser sessions are isolated per agent by default. An explicit shared-session choice still keeps the old behavior.
- Added the Learn Workflow skill, which turns a demonstrated task into a reviewable reusable skill without treating it as model fine-tuning.

### Changed

- Agents are told to search saved memories before asking the user to repeat an earlier preference, decision, result, or project fact that is not already in essential context.
