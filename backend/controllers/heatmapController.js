const Event = require('../models/Event');

// @desc    Get click coordinate details for heatmap rendering
// @route   GET /api/heatmap
// @access  Public
const getHeatmapData = async (req, res) => {
  try {
    const { page_url } = req.query;

    if (!page_url) {
      return res.status(400).json({ error: 'page_url query parameter is required.' });
    }

    // Find all click events for the specified URL
    const clicks = await Event.find({
      event_type: 'click',
      page_url: page_url
    }).select('click_coordinates timestamp');

    // Filter out click events that don't have valid coordinates
    const coordinates = clicks
      .filter(c => c.click_coordinates && c.click_coordinates.x_pct !== undefined)
      .map(c => ({
        x: c.click_coordinates.x,
        y: c.click_coordinates.y,
        x_pct: c.click_coordinates.x_pct,
        y_pct: c.click_coordinates.y_pct,
        timestamp: c.timestamp
      }));

    res.status(200).json({
      success: true,
      count: coordinates.length,
      page_url,
      data: coordinates
    });
  } catch (error) {
    console.error('Error fetching heatmap data:', error);
    res.status(500).json({ error: 'Server error retrieving heatmap data.' });
  }
};

module.exports = {
  getHeatmapData
};
