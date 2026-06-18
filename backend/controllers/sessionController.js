const Event = require('../models/Event');

// @desc    Get all sessions with total events, starts, and ends
// @route   GET /api/sessions
// @access  Public
const getSessions = async (req, res) => {
  try {
    const sessions = await Event.aggregate([
      {
        $group: {
          _id: '$session_id',
          totalEvents: { $sum: 1 },
          clicks: {
            $sum: { $cond: [{ $eq: ['$event_type', 'click'] }, 1, 0] }
          },
          pageViews: {
            $sum: { $cond: [{ $eq: ['$event_type', 'page_view'] }, 1, 0] }
          },
          startTime: { $min: '$timestamp' },
          endTime: { $max: '$timestamp' }
        }
      },
      {
        $sort: { startTime: -1 }
      }
    ]);

    res.status(200).json({ success: true, count: sessions.length, data: sessions });
  } catch (error) {
    console.error('Error fetching sessions:', error);
    res.status(500).json({ error: 'Server error retrieving session list.' });
  }
};

// @desc    Get events for a specific session ordered chronologically
// @route   GET /api/sessions/:sessionId/events
// @access  Public
const getSessionEvents = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const events = await Event.find({ session_id: sessionId }).sort({ timestamp: 1 });

    res.status(200).json({ success: true, count: events.length, data: events });
  } catch (error) {
    console.error('Error fetching session events:', error);
    res.status(500).json({ error: 'Server error retrieving session events.' });
  }
};

// @desc    Get dashboard metrics (total sessions, total events, total clicks)
// @route   GET /api/dashboard/stats
// @access  Public
const getDashboardStats = async (req, res) => {
  try {
    const totalEvents = await Event.countDocuments();
    const totalClicks = await Event.countDocuments({ event_type: 'click' });
    const uniqueSessions = await Event.distinct('session_id');
    const totalSessions = uniqueSessions.length;

    res.status(200).json({
      success: true,
      data: {
        totalSessions,
        totalEvents,
        totalClicks,
        ctr: totalEvents > 0 ? parseFloat(((totalClicks / totalEvents) * 100).toFixed(2)) : 0
      }
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({ error: 'Server error retrieving dashboard stats.' });
  }
};

module.exports = {
  getSessions,
  getSessionEvents,
  getDashboardStats
};
