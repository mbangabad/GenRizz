# Additional Issues Found After Audit

## 🚨 Issues Discovered During Play Testing

### Issue 1: BLITZ Mode Scoring Bug (CRITICAL)
**Status:** ✅ FIXED

**Problem:**
- BLITZ mode timer was ending game prematurely
- Score calculation was using total questions instead of answered questions
- Result: 0% score even when user answered questions correctly

**Root Cause:**
1. Timer effect dependency array didn't include `questions.length`
2. Timer could start before questions loaded
3. Score calculation used `score / questions.length` instead of `score / answeredQuestions`

**Fix Applied:**
1. Added `questions.length` to timer dependency check
2. Changed score calculation to use answered questions count for BLITZ/QUICK modes
3. Added safeguard to prevent game ending before questions load

**Files Modified:**
- `src/pages/Gameplay.jsx` (lines 493-507, 676-700)

---

### Issue 2: "Connection Lost" Tier Name Confusion (MEDIUM)
**Status:** ⏳ PENDING REVIEW

**Problem:**
- Tier name "Connection Lost" for 0-49% scores is confusing
- Users think it's a network error, not a score tier
- UI shows "Connection Lost" with signal icon, making it look like network issue

**Location:**
- `src/components/constants/games.jsx` line 291
- `src/components/ui/CompletionAnimation.jsx` (displays tier)

**Recommendation:**
- Consider renaming to something like "Getting Started" or "Keep Practicing"
- Or add context: "Score: Connection Lost (0-49%)"

---

## Testing Checklist

- [x] BLITZ mode timer fix
- [x] Score calculation fix
- [ ] Test BLITZ mode with timer expiry
- [ ] Test BLITZ mode with all questions answered
- [ ] Test QUICK mode scoring
- [ ] Verify 0% scores don't occur when questions are answered
- [ ] Review "Connection Lost" tier name

---

## Next Steps

1. ✅ Fixed BLITZ timer and scoring issues
2. ⏳ Test BLITZ mode thoroughly
3. ⏳ Consider renaming "Connection Lost" tier
4. ⏳ Add more comprehensive play testing for all game modes

---

**Note:** The previous audit was comprehensive, but this issue was specific to BLITZ mode timer logic which may not have been fully tested during the initial audit. This highlights the importance of testing all game modes, especially timed modes.

