const Event = require('../models/Event');

// @desc    Track a new event (page_view or click)
// @route   POST /api/events
// @access  Public
const trackEvent = async (req, res) => {
  try {
    const { session_id, event_type, page_url, timestamp, click_coordinates } = req.body;

    if (!session_id || !event_type || !page_url) {
      return res.status(400).json({ error: 'session_id, event_type, and page_url are required fields.' });
    }

    const event = new Event({
      session_id,
      event_type,
      page_url,
      timestamp: timestamp ? new Date(timestamp) : new Date(),
      click_coordinates: event_type === 'click' ? click_coordinates : undefined
    });

    await event.save();
    res.status(201).json({ success: true, data: event });
  } catch (error) {
    console.error('Error tracking event:', error);
    res.status(500).json({ error: 'Server error tracking event.' });
  }
};

module.exports = {
  trackEvent
};
