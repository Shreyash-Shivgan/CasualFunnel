# CasualFunnel - User Analytics Application

An end-to-end user behavior tracking and analytics application. The system captures user actions (page views and mouse clicks) on a static demo website, stores them in MongoDB, and visualizes them on a modern, dark-themed React dashboard with chronological journeys and click heatmaps.

---

## Key Features

1. **Standalone Tracker (`tracker/tracker.js`)**:
   * Generates and stores persistent `session_id`s in `localStorage`.
   * Captures `page_view` events.
   * Tracks mouse clicks with both raw pixel coordinates (`x`, `y`) and normalized viewport percentage coordinates (`x_pct`, `y_pct`) for resolution-independent heatmaps.
   * Uses `fetch` with `keepalive: true` to prevent event loss during page unloads/navigation.

2. **Modular Express Backend**:
   * **Required Primary Database**: Uses MongoDB (via Mongoose) as the required primary database to store interaction data.
   * **Development Fallback**: Includes an optional, automatic in-memory database mock. If MongoDB is not running locally, the server starts with a warning and falls back to this in-memory proxy for testing convenience.
   * Responsibilities separated cleanly across:
     * `eventController.js` (Ingestion)
     * `sessionController.js` (Session lists, journeys, dashboard metrics)
     * `heatmapController.js` (Heatmap coordinates by URL)
   * Serves the multi-page demo site at `/demo/` and the tracker script at `/tracker.js`.

3. **Multi-page Demo Site**:
   * Three static pages: Home, Pricing, and About.
   * Demonstrates real-world session flows and navigation tracking.

4. **Interactive Analytics Dashboard (React + Vite)**:
   * **Sessions List View (Core Requirement)**: Live sidebar showing active sessions and interaction counts.
   * **Chronological Session Journey (Core Requirement)**: Displays the exact timeline path of page visits and clicks with coordinates.
   * **Visual Heatmap Overlay (Core Requirement)**: Embeds wireframe mockups for Home, Pricing, and About pages, overlaying collected click percentages dynamically.
   * **Dashboard Statistics (Bonus Feature)**: Visualizes Total Sessions, Total Events, Total Clicks, and Click-through rate.

---

## Setup & Running Guide

### 1. Prerequisites
* [Node.js](https://nodejs.org/) (v16+ recommended)
* [MongoDB](https://www.mongodb.com/) running locally on default port `27017` (configured via backend `.env` variables).
  > [!NOTE]
  > MongoDB is the required primary database for production runs. If MongoDB is not detected during start, the application prints a warning and runs on a local in-memory fallback for zero-config testing.

### 2. Quick Start Running Script

To install all dependencies (for Root, Backend, and Frontend) and start the servers:

1. **Install all dependencies**:
   ```bash
   npm run install-all
   ```

2. **Start the backend and frontend dev servers concurrently**:
   ```bash
   npm run dev
   ```

Once running, access:
* **Tracked Demo Website**: [http://localhost:5000/demo/](http://localhost:5000/demo/)
* **Analytics Dashboard Panel**: [http://localhost:5173/](http://localhost:5173/)

---

## Tech Stack
* **Frontend Dashboard**: React, Vite, Axios, Lucide Icons, Custom Vanilla CSS
* **Tracking Script**: Vanilla JS (using standard Web APIs)
* **Backend API**: Node.js, Express, Mongoose, CORS, Dotenv, Nodemon
* **Database**: MongoDB (Required primary store)
