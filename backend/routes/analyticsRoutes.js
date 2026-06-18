const express = require('express');
const router = express.Router();

// Controllers
const { trackEvent } = require('../controllers/eventController');
const { getSessions, getSessionEvents, getDashboardStats } = require('../controllers/sessionController');
const { getHeatmapData } = require('../controllers/heatmapController');

// Ingest click and page view events
router.post('/events', trackEvent);

// Fetch session summaries
router.get('/sessions', getSessions);

// Fetch timeline sequence for a session
router.get('/sessions/:sessionId/events', getSessionEvents);

// Fetch aggregated high-level statistics
router.get('/dashboard/stats', getDashboardStats);

// Fetch coordinates list for page heatmap overlays
router.get('/heatmap', getHeatmapData);

module.exports = router;
