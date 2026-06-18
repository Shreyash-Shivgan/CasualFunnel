(function() {
  const API_ENDPOINT = '/api/events';

  // Helper to get or create session ID stored in localStorage
  function getOrCreateSessionId() {
    let sessionId = localStorage.getItem('casual_analytics_session_id');
    if (!sessionId) {
      sessionId = 'sess_' + Math.random().toString(36).substring(2, 15) + '_' + Date.now();
      localStorage.setItem('casual_analytics_session_id', sessionId);
    }
    return sessionId;
  }

  const sessionId = getOrCreateSessionId();

  // Send event helper using fetch with keepalive: true for reliable delivery
  async function sendEvent(payload) {
    try {
      // Direct call to endpoint (will resolve against the site's origin)
      const response = await fetch(API_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload),
        keepalive: true
      });
      if (!response.ok) {
        console.warn('Analytics tracker received server error:', response.status);
      }
    } catch (error) {
      console.warn('Analytics tracker failed to send event:', error);
    }
  }

  // Track page view
  function trackPageView() {
    const payload = {
      session_id: sessionId,
      event_type: 'page_view',
      page_url: window.location.pathname,
      timestamp: new Date().toISOString()
    };
    sendEvent(payload);
  }

  // Track click (capturing raw pageX/Y and window-normalized percentage x/y_pct)
  function trackClick(event) {
    // Avoid double tracking if clicking interactive links that redirect immediately, 
    // keepalive ensures it gets delivered.
    const x = event.pageX;
    const y = event.pageY;
    const x_pct = parseFloat(((event.clientX / window.innerWidth) * 100).toFixed(2));
    const y_pct = parseFloat(((event.clientY / window.innerHeight) * 100).toFixed(2));

    const payload = {
      session_id: sessionId,
      event_type: 'click',
      page_url: window.location.pathname,
      timestamp: new Date().toISOString(),
      click_coordinates: {
        x: x,
        y: y,
        x_pct: x_pct,
        y_pct: y_pct
      }
    };
    sendEvent(payload);
  }

  // Listen for DOMContentLoaded to run trackPageView
  let pageViewTracked = false;
  function initPageView() {
    if (pageViewTracked) return;
    pageViewTracked = true;
    trackPageView();
  }

  if (document.readyState === 'interactive' || document.readyState === 'complete') {
    initPageView();
  } else {
    window.addEventListener('DOMContentLoaded', initPageView);
  }

  // Listen for clicks on the window
  window.addEventListener('click', trackClick);
})();
