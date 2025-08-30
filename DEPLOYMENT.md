# Netlify Deployment Instructions

## Problem Solved
This configuration fixes the MIME type error: `Loading module from "https://your-site.netlify.app/src/main.tsx" was blocked because of a disallowed MIME type ("application/octet-stream")`

## Files Configured

### 1. `netlify.toml` 
- Sets correct build command: `npm ci && npm run build`
- Sets publish directory: `dist`
- Configures proper MIME types for JavaScript files
- Handles SPA routing

### 2. `vite.config.ts`
- Sets correct base path: `/`
- Ensures proper asset naming with `.js` extensions
- Copies public directory (including `_redirects`)

### 3. `public/_redirects`
- Handles client-side routing for React Router
- Redirects all routes to `index.html`

## Netlify Dashboard Settings

**IMPORTANT**: Make sure your Netlify site settings match these:

### Build Settings
- **Build command**: `npm run build` (or leave empty, netlify.toml will handle it)
- **Publish directory**: `dist`
- **Base directory**: (leave empty)

### Build Environment Variables (if needed)
- `NODE_VERSION`: `18`

## Deploy Steps

1. **Commit and push all changes**:
   ```bash
   git add .
   git commit -m "Fix Netlify deployment configuration"
   git push origin main
   ```

2. **Netlify will automatically rebuild** when you push to your connected branch

3. **If auto-deploy isn't working**:
   - Go to your Netlify dashboard
   - Navigate to "Deploys" tab
   - Click "Trigger deploy" → "Deploy site"

## Troubleshooting

### If you still see the MIME type error:
1. Check that Netlify is building from the correct branch
2. Verify the publish directory is set to `dist` in Netlify dashboard
3. Ensure the build command completes successfully (check deploy logs)
4. Clear your browser cache and try again

### If the site shows a blank page:
1. Check the browser console for errors
2. Verify the asset paths in `dist/index.html` are correct
3. Ensure all files in `dist/assets/` have proper extensions

## Build Locally to Test
```bash
npm run build
npx serve dist
```

This will serve the built files locally on `http://localhost:3000` to test before deployment.
