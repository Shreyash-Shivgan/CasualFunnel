# Implementation Plan - Deploy Frontend on Vercel and Backend on Render

This plan outlines the steps and codebase modifications required to deploy the **Casual Funnel** Full Stack application:
1. Deploy the Node.js/Express backend on Render.
2. Deploy the React/Vite frontend on Vercel.

## User Review Required

> [!IMPORTANT]
> **Production Environments Setup**:
> To complete the deployments, you will need to link your Vercel and Render accounts to your GitHub repository (or deploy manually through their dashboards). We will provide exact configurations for both platforms.

## Proposed Changes

### Frontend Configuration

#### [MODIFY] [App.jsx](file:///c:/Users/shrey/CasualFunnel/frontend/src/App.jsx)
Make the `API_BASE` dynamic so it uses `VITE_API_BASE` in production.
```diff
-const API_BASE = 'http://localhost:5000/api';
+const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5000/api';
```

#### [NEW] [vercel.json](file:///c:/Users/shrey/CasualFunnel/frontend/vercel.json)
Configure SPA routing rewrites for Vercel.
```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

---

### Backend Configuration

No changes are needed in `backend/server.js` or files because:
* `const PORT = process.env.PORT || 5000;` automatically respects Render's dynamic port binding.
* `app.use(cors())` allows all origins by default, which supports your Vercel frontend domain.
* The tracker script (`tracker/tracker.js`) uses relative endpoints, ensuring it queries the Render host.

---

## Step-by-Step Deployment Instructions

### Part 1: Deploy Backend on Render

1. Create a new **Web Service** on [Render](https://render.com).
2. Connect your Git repository.
3. Configure the following service settings:
   * **Name**: `casual-funnel-backend`
   * **Root Directory**: `backend` (important: points directly to the backend subdirectory)
   * **Runtime**: `Node`
   * **Build Command**: `npm install`
   * **Start Command**: `node server.js`
4. Add the following **Environment Variables**:
   * `MONGO_URI`: `mongodb+srv://shreyashivgan1234_db_user:1N2bCuQqfe1eMDOZ@cluster0.egkq0pw.mongodb.net/casual_analytics?retryWrites=true&w=majority`
   * `NODE_ENV`: `production`

Once deployed, copy your Render Web Service URL (e.g. `https://casual-funnel-backend.onrender.com`).

### Part 2: Deploy Frontend on Vercel

1. Create a new Project on [Vercel](https://vercel.com).
2. Connect your Git repository.
3. Configure the following project settings:
   * **Framework Preset**: `Vite` (automatically detected)
   * **Root Directory**: `frontend` (important: points to the frontend subdirectory)
   * **Build Command**: `npm run build`
   * **Output Directory**: `dist`
4. Add the following **Environment Variable**:
   * **Key**: `VITE_API_BASE`
   * **Value**: `<Your Render Web Service URL>/api` (e.g. `https://casual-funnel-backend.onrender.com/api`)

---

## Verification Plan

### Automated Tests
* Validate that Vite build compiles successfully locally with the environment variable set.
  `cd frontend && npm run build`

### Manual Verification
* Access the Vercel URL and verify that it fetches statistics and session logs from the live Render + MongoDB Atlas backend.
