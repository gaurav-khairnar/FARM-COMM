# Farmer Marketplace - Deployment Troubleshooting Log

This document records the issues, errors, and fixes encountered while migrating the Farmer Marketplace application from local development to production (Render for the backend API, Netlify for the frontend).

## 1. Backend: Render 502 Bad Gateway
**Error Symptoms:**
- The Node.js Express backend deployed successfully on Render but returned a generic `502 Bad Gateway` upon any API request.
- Production logs showed the immediate crashing of `npm start` with: 
  `MongoDB connection error: Could not connect to any servers in your MongoDB Atlas cluster.`

**Root Cause:**
- Render uses dynamic IP addresses, dynamically scaling servers that change origin IPs frequently.
- **MongoDB Atlas** utilizes a strict IP Whitelist for security and was deliberately blocking incoming connections from Render's unknown IP addresses. Because `db.js` terminates the Node process upon connection failure, the frontend API immediately failed.

**The Fix:**
- Updated MongoDB Atlas Network Security settings.
- Added `0.0.0.0/0` ("Allow Access From Anywhere") to the IP Access List, enabling Render servers to seamlessly connect using the generated credentials.

---

## 2. Frontend: Netlify 404 Page Not Found
**Error Symptoms:**
- The Next.js frontend deployed to Netlify successfully, but visiting the base URL resulted in a Netlify `404 Page Not Found` message.

**Root Cause:**
- The Next.js application was nested within the `client/` subdirectory.
- Netlify was incorrectly attempting to serve raw HTML files directly from the `/client` directory instead of recognizing the compiled Next.js build output (the `.next` folder).

**The Fix:**
- Updated the continuous deployment build settings natively inside Netlify.
- Specifically changed the **Publish directory** to `.next` (and ensured the Netlify Next.js runtime plugin was correctly handling the framework configuration).

---

## 3. Frontend: Netlify "Failed to parse configuration" 
**Error Symptoms:**
- Netlify immediately failed pre-build stages with:
  `Failed during stage 'Reading and parsing configuration files': Base directory does not exist: /opt/build/repo/farmr-marketplace/client`

**Root Cause:**
- Simple typo in the web UI. The Base directory was set to `farmr-marketplace/client` instead of `farmer-marketplace/client`.

**The Fix:**
- Edited Netlify continuous deployment build settings to correct the folder name.

---

## 4. Frontend: Next.js Prerender Error `useSearchParams` (The SSR Bailout Bug)
**Error Symptoms:**
- Netlify build failed consistently during the *"Generating static pages"* phase.
- **Error:** `⨯ useSearchParams() should be wrapped in a suspense boundary at page "/home".`

**Root Cause:**
- Next.js 14 App Router statically pre-renders (`SSG`) all pages by default during `next build`.
- The `app/home/page.js` file used `useSearchParams()` from `next/navigation` to filter the product feed. During static generation, query parameters do not exist, leading to a build crash (the Static Prerendering explicitly demands a Suspense boundary when hitting this hook).

**Failed Attempts:**
1. Wrapped the exact UI block consuming the hook in a `<Suspense>` boundary directly inside `page.js`. (Netlify/Next.js static compiler still threw the static bailout error due to strict compilation rules interpreting both the boundary and hook in the same generated chunk).
2. Forcibly appended `export const dynamic = 'force-dynamic';` in an `app/home/layout.js` file, instructing Next.js to ignore SSR. (Again, Netlify's compiler caught the hook evaluation directly.)

**The Final Bulletproof Fix:**
- Bypassed the server-side Next.js compiler entirely for that specific hook execution.
- Relocated the product feed UI code into an isolated file (`components/HomeContent.js`).
- Imported `HomeContent.js` dynamically inside the home page (`app/home/page.js`) using Next.js **Dynamic Imports** with Server-Side Rendering strictly disabled:
  ```javascript
  const HomeContent = dynamic(() => import('@/components/HomeContent'), {
    ssr: false, 
    loading: () => <PageLoader label="Loading marketplace..." />
  });
  ```
- By explicitly forcing the component to skip server-side execution, `useSearchParams()` is only evaluated directly by the browser DOM on load, fundamentally solving the Next.js 14 Netlify build pipeline crash.
