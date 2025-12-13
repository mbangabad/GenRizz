## Rollback Instructions (pre-beta audit)

- **Rollback point SHA**: `e7cf792a0032763e97c1c69c135ebe5d9d4f81ca` (main before audit work)

### Steps
1. Checkout main and reset to rollback point (if needed):
   - `git checkout main`
   - `git reset --hard e7cf792a0032763e97c1c69c135ebe5d9d4f81ca`
2. If on the audit branch and want to discard changes:
   - `git checkout main`
   - `git branch -D audit/pre-beta-20251213` (only if you intend to drop it)
3. To revert the audit branch only:
   - `git checkout audit/pre-beta-20251213`
   - `git reset --hard e7cf792a0032763e97c1c69c135ebe5d9d4f81ca`

Always push a new branch for any rollback to keep history:
`git push origin HEAD:rollback/pre-beta-20251213 --force-with-lease`
