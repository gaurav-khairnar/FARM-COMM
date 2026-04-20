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

---

## 5. Backend: Express Rate Limit Proxy Configuration Error
**Error Symptoms:**
- Render production logs showed validation error during startup:
  `ValidationError: The 'X-Forwarded-For' header is set but the Express 'trust proxy' setting is false (default)`
- express-rate-limit failed to identify legitimate client IPs because Render sits behind a reverse proxy.

**Root Cause:**
- Render runs Express behind a reverse proxy that forwards client IP via X-Forwarded-For header.
- Without `trust proxy` enabled, Express treats all requests as coming from Render's internal IP, causing rate-limit confusion.

**The Fix:**
- Added `app.set('trust proxy', 1);` before rate-limiting middleware in server.js.
- This instructs Express to trust the first proxy in the chain (Render) and correctly extract client IP from X-Forwarded-For.

---

## 6. Frontend: Demo Listings Not Visible After Initial Deployment
**Error Symptoms:**
- Backend API running, database connected, but `/api/listings/feed` returned empty array `[]`.
- Netlify frontend showed no product listings on home page.

**Root Cause:**
- Demo data seeding was not run before production went live.
- Non-destructive seed script had a bug: it skipped creating listings when only expired active listings existed, effectively hiding old demo products from the feed.

**The Fix:**
- Updated seed scripts (seed.js and seedDemoOnly.js) to check both isActive AND expiryDate { $gte: new Date() } when detecting existing listings.
- Created protected API endpoint `/api/admin/seed-demo` gated by ADMIN_SEED_KEY environment variable.
- Triggered seeding via HTTPS POST from local machine using Invoke-RestMethod PowerShell command.
- Result: 37 demo products seeded with valid future expiry dates, all visible in production feed.

**Production Seeding Pattern:**
1. Add ADMIN_SEED_KEY to Render environment variables.
2. Redeploy backend.
3. Call POST https://farmers-comm.onrender.com/api/admin/seed-demo with x-admin-seed-key header.
4. Remove ADMIN_SEED_KEY after seeding (security cleanup).
5. Redeploy backend again.

This pattern allows safe database seeding without Render Shell access (paid tier requirement) and maintains security by disabling the endpoint after use.
