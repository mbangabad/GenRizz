# Clear Browser Cache - Step by Step

## The Problem
The browser is loading cached JavaScript files that contain the old `sonner` library, causing React hooks errors and preventing the app from loading.

## Solution: Clear Browser Cache

### Method 1: Hard Refresh (Easiest)
1. Open `http://localhost:5174`
2. Press:
   - **Mac**: `Cmd + Shift + R`
   - **Windows/Linux**: `Ctrl + Shift + R`
3. This forces the browser to reload all files from the server

### Method 2: Clear Site Data (Most Effective)
1. Open DevTools: Press `F12` or right-click → Inspect
2. Go to **Application** tab (Chrome) or **Storage** tab (Firefox)
3. Click **Clear site data** or **Clear storage**
4. Check all boxes:
   - ✅ Cookies
   - ✅ Cache storage
   - ✅ Local storage
   - ✅ Service workers
5. Click **Clear site data**
6. Close DevTools and refresh the page

### Method 3: Unregister Service Worker
1. Open DevTools (`F12`)
2. Go to **Application** tab
3. Click **Service Workers** in the left sidebar
4. Click **Unregister** for any registered workers
5. Go to **Cache Storage** and delete all caches
6. Refresh the page

### Method 4: Incognito/Private Window
1. Open a new incognito/private window:
   - **Chrome**: `Cmd + Shift + N` (Mac) or `Ctrl + Shift + N` (Windows)
   - **Firefox**: `Cmd + Shift + P` (Mac) or `Ctrl + Shift + P` (Windows)
   - **Safari**: `Cmd + Shift + N`
2. Navigate to `http://localhost:5174`
3. This bypasses all cache

### Method 5: Clear Browser Cache Completely
1. **Chrome**: Settings → Privacy → Clear browsing data → Cached images and files
2. **Firefox**: Settings → Privacy → Clear Data → Cached Web Content
3. **Safari**: Develop → Empty Caches (enable Develop menu first)

## Verify It Worked
After clearing cache, you should see:
- ✅ App loads without "Something went wrong" error
- ✅ Games in categories are clickable (hover shows green text)
- ✅ No React hooks errors in console
- ✅ Service worker shows as unregistered in DevTools

## If Still Not Working
1. Close all browser tabs with `localhost:5174`
2. Close the browser completely
3. Reopen browser
4. Navigate to `http://localhost:5174` in a fresh tab
5. Hard refresh: `Cmd + Shift + R` or `Ctrl + Shift + R`

## About the Links
The games ARE hyperlinks now (using React Router's `<Link>` component). They:
- Navigate to game pages when clicked
- Can be right-clicked to open in new tab
- Show hover effects (green text, chevron color change)
- Work with keyboard navigation

The links don't have underlines because that's the modern design style, but they ARE clickable hyperlinks.

