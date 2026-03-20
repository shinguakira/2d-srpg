Review the current changes against the project specs and task definitions.

## Instructions

1. **Identify what changed**: Run `git diff` (staged + unstaged) and check `git status` for new/modified files to understand the full scope of changes.

2. **Find the relevant spec/task**: Search `specs/tasks/` for task files that correspond to the changed code. Cross-reference with specs in `specs/gameplay/`, `specs/maps/`, `specs/story/`, `specs/ui/`, and `specs/progression/` as needed.

3. **Coverage check**: Compare the changes against the matched task's requirements. Report:
   - Which requirements are fully implemented
   - Which requirements are partially implemented or missing
   - Any changes that go beyond the task scope (flag but don't necessarily treat as wrong)

4. **Code review**: Review the changed code for:
   - Bugs or logic errors
   - Type safety issues
   - Violations of project conventions (see CLAUDE.md — Zustand patterns, pure core logic, BEM CSS, data-testid, etc.)
   - Missing edge cases
   - Unnecessary complexity or duplication

5. **Output format**:
   ```
   ## Spec Coverage
   Task: [matched task file(s)]
   - ✅ [requirement] — implemented
   - ⚠️ [requirement] — partial / needs attention
   - ❌ [requirement] — missing

   ## Code Review
   - [file:line] — [issue description]

   ## Summary
   [1-2 sentence overall assessment]
   ```

6. **Update task checkboxes**: After the review, check off (`- [x]`) all completed requirements in the matched task file(s). Do this as a batch at the end — do not modify the task files during the review itself.

If no matching task is found in specs, skip the coverage check and checkbox update, and perform only the code review (steps 4-5).
