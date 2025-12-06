# BLITZ Mode Issues Found

## 🚨 Critical Issues

### Issue 1: BLITZ Timer Ending Game Prematurely
**Problem:** The BLITZ timer effect has a dependency issue that may cause the game to end before questions are answered.

**Location:** `src/pages/Gameplay.jsx` lines 493-507

**Root Cause:**
- Timer effect depends on `[gameState, gameMode]` which recreates the timer
- Timer may start before questions are fully loaded
- If timer expires before any answers, score = 0%

**Fix Needed:**
1. Add `questions.length` to dependency check
2. Ensure timer only starts when questions are loaded
3. Prevent timer from ending game if no questions answered

### Issue 2: Score Not Recorded in BLITZ Mode
**Problem:** If BLITZ timer expires, `endGame()` is called with `score = 0`, resulting in 0% even if user answered some questions.

**Location:** `src/pages/Gameplay.jsx` lines 676-750

**Root Cause:**
- Timer calls `endGame()` directly without checking if answers were recorded
- Score state might not be updated when timer expires

**Fix Needed:**
- Ensure score is properly calculated even when timer expires
- Add check to prevent 0% if user answered at least one question

### Issue 3: "Connection Lost" Confusing UI
**Problem:** "Connection Lost" is a tier name for 0-49% scores, which is confusing because it sounds like a network error.

**Location:** `src/components/constants/games.jsx` line 291

**Fix Needed:**
- Consider renaming this tier to something less confusing
- Or add better context in the UI to clarify it's a score tier, not a connection issue

---

## Fixes to Implement

1. ✅ Fix BLITZ timer dependency array
2. ✅ Ensure timer only starts when questions loaded
3. ✅ Prevent premature game end
4. ✅ Fix score calculation on timer expiry
5. ✅ Add better error handling for 0% scores

