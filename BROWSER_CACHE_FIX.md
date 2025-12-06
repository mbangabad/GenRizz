# Browser Cache Fix Instructions

## Problem
The browser is loading cached JavaScript bundles containing the removed `sonner` library, causing React hooks errors.

## Solution Applied
1. ✅ Removed `sonner` package completely
2. ✅ Enhanced service worker unregistration
3. ✅ Added cache clearing on page load
4. ✅ Excluded `sonner` from Vite bundling

## To Fix in Your Browser

### Option 1: Hard Refresh (Quickest)
- **Mac**: `Cmd + Shift + R`
- **Windows/Linux**: `Ctrl + Shift + R`

### Option 2: Clear Browser Cache
1. Open DevTools (F12)
2. Go to **Application** tab
3. Click **Storage** → **Clear site data**
4. Refresh the page

### Option 3: Unregister Service Worker
1. Open DevTools (F12)
2. Go to **Application** tab
3. Click **Service Workers**
4. Click **Unregister** for any registered workers
5. Refresh the page

### Option 4: Incognito/Private Window
Open `http://localhost:5174` in an incognito/private window (no cache)

## After Clearing Cache
The app should load without React hooks errors. All `toast` calls now use mock functions that do nothing (no errors, but no notifications either).

## Next Steps
If you need toast notifications in the future, we can implement a simple custom toast component that doesn't conflict with React hooks.

