# Walkthrough: Casual Funnel – User Analytics Platform Demo Video

We have successfully built a clean, professional, and recruiter-friendly product demo video walkthrough for the **Casual Funnel – User Analytics Platform**. 

The walkthrough records a realistic software demonstration showing real-time event tracking, modular session logging, click heatmap visualizations, and direct database storage validation.

---

## 📹 Professional Product Walkthrough Video
The walkthrough video has been fully recorded, capturing the cursor interactions and UI transitions at a professional software developer pace.

![Casual Funnel Product Walkthrough](./assets/walkthrough.webp)

---

## 🏗️ Demo Video Flow & Components

### 1. Opening Title (3 seconds)
* **Design**: Styled dark theme slide displaying the assignment context.
* **Content**:
  * **App Name**: Casual Funnel
  * **Subtitle**: User Analytics Application
  * **Context**: Full Stack Engineer Assignment
  * **Tech Stack**: React • Node.js • Express • MongoDB Atlas

### 2. Demo Website Interactions
* **Pages Navigated**: Home, Pricing, and About pages.
* **Actions Performed**:
  * Clicked **"View Pricing Plans"** on Home page hero.
  * Scrolled down pricing grid and clicked **"Start Free Trial"** on the Growth plan.
  * Navigated to About page and clicked **"Contact Us"** button.
* **Overlay Text**: `"Tracking page views and click events in real time"`

### 3. Analytics Dashboard
* **Metrics displayed**: Total Sessions, Total Events, Total Clicks, and Click-Through Rate (CTR).
* **Actions Performed**: Clicked on the first active session row to display its chronological timeline.
* **Overlay Text**: `"Session Analytics"`

### 4. Click Heatmap Overlay
* **Actions Performed**: 
  * Selected **Pricing Page (/demo/pricing.html)** in the page URL dropdown to render exact click coordinates on the pricing wireframe mockup.
  * Switched the selection to **About Page (/demo/about.html)** to show coordinate markers on the about wireframe mockup.
* **Overlay Text**: `"Click Heatmap Visualization"`

### 5. MongoDB Atlas Database Verification
* **Design**: Styled database verification page query terminal (`cluster0.events.find({ session_id })`).
* **Content**: Renders the raw JSON documents returned in real-time by the MongoDB Atlas cluster, with syntax-highlighting accentuating:
  * `session_id`
  * `event_type`
  * `page_url`
  * `timestamp`
  * `click_coordinates` (raw `x`, `y` and normalized `x_pct`, `y_pct`)
* **Overlay Text**: `"Real-time event storage"`

### 6. Closing Outro Screen (5 seconds)
* **Design**: Title screen checklist highlighting key platform deliverables:
  * ✓ Session Tracking
  * ✓ User Journey Analytics
  * ✓ Click Heatmaps
  * ✓ MongoDB Event Storage
* **Tech Stack Summary**: React • Express • MongoDB • Node.js

---

## 🔍 Key Technical Implementations
1. **Dynamic Video Overlay Banner**:
   Added a floating, capsule-style overlay banner at the bottom center of all demo pages. In the React dashboard, this banner automatically updates its text dynamically based on the user's scroll position (e.g. switching from `"Session Analytics"` to `"Click Heatmap Visualization"` as the user scrolls to the Heatmap panel).
2. **MongoDB API Error Resolution**:
   Fixed an API structure parsing issue in the database verification page to ensure the real-time event JSON logs render instantly when queried.
3. **Repository Cleanliness**:
   All new HTML layouts (`intro.html`, `database.html`, `outro.html`) and overlay features have been committed to the git branch.
