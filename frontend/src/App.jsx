import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Activity, 
  MousePointer, 
  RefreshCw, 
  Eye, 
  MapPin, 
  Clock 
} from 'lucide-react';

const API_BASE = 'http://localhost:5000/api';

export default function App() {
  // Stats state
  const [stats, setStats] = useState({ totalSessions: 0, totalEvents: 0, totalClicks: 0, ctr: 0 });
  const [loadingStats, setLoadingStats] = useState(true);

  // Sessions state
  const [sessions, setSessions] = useState([]);
  const [activeSessionId, setActiveSessionId] = useState(null);
  const [loadingSessions, setLoadingSessions] = useState(true);

  // Active session events state
  const [sessionEvents, setSessionEvents] = useState([]);
  const [loadingEvents, setLoadingEvents] = useState(false);

  // Heatmap state
  const [heatmapPage, setHeatmapPage] = useState('/demo/');
  const [heatmapClicks, setHeatmapClicks] = useState([]);
  const [loadingHeatmap, setLoadingHeatmap] = useState(false);

  // Overlay banner state
  const [overlayText, setOverlayText] = useState('Session Analytics');

  // Fetch all dashboard stats
  const fetchStats = async () => {
    try {
      setLoadingStats(true);
      const res = await axios.get(`${API_BASE}/dashboard/stats`);
      if (res.data && res.data.success) {
        setStats(res.data.data);
      }
    } catch (err) {
      console.error('Error fetching dashboard stats:', err);
    } finally {
      setLoadingStats(false);
    }
  };

  // Fetch all sessions
  const fetchSessions = async () => {
    try {
      setLoadingSessions(true);
      const res = await axios.get(`${API_BASE}/sessions`);
      if (res.data && res.data.success) {
        setSessions(res.data.data);
        // Set first session as active if none selected
        if (res.data.data.length > 0 && !activeSessionId) {
          setActiveSessionId(res.data.data[0]._id);
        }
      }
    } catch (err) {
      console.error('Error fetching sessions:', err);
    } finally {
      setLoadingSessions(false);
    }
  };

  // Fetch events for active session
  const fetchSessionEvents = async (sessionId) => {
    if (!sessionId) return;
    try {
      setLoadingEvents(true);
      const res = await axios.get(`${API_BASE}/sessions/${sessionId}/events`);
      if (res.data && res.data.success) {
        setSessionEvents(res.data.data);
      }
    } catch (err) {
      console.error('Error fetching session events:', err);
    } finally {
      setLoadingEvents(false);
    }
  };

  // Fetch heatmap coordinate data for a specific page URL
  const fetchHeatmapData = async (pageUrl) => {
    try {
      setLoadingHeatmap(true);
      const res = await axios.get(`${API_BASE}/heatmap`, {
        params: { page_url: pageUrl }
      });
      if (res.data && res.data.success) {
        setHeatmapClicks(res.data.data);
      }
    } catch (err) {
      console.error('Error fetching heatmap data:', err);
    } finally {
      setLoadingHeatmap(false);
    }
  };

  // Initial load
  useEffect(() => {
    fetchStats();
    fetchSessions();
  }, []);

  // Scroll listener to toggle overlay text
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setOverlayText('Click Heatmap Visualization');
      } else {
        setOverlayText('Session Analytics');
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Fetch session events when active session changes
  useEffect(() => {
    if (activeSessionId) {
      fetchSessionEvents(activeSessionId);
    }
  }, [activeSessionId]);

  // Fetch heatmap data when page selection changes
  useEffect(() => {
    fetchHeatmapData(heatmapPage);
  }, [heatmapPage]);

  // Global refresh
  const handleRefresh = () => {
    fetchStats();
    fetchSessions();
    if (activeSessionId) {
      fetchSessionEvents(activeSessionId);
    }
    fetchHeatmapData(heatmapPage);
  };

  // Format timestamp helpers
  const formatTime = (isoString) => {
    if (!isoString) return '';
    const date = new Date(isoString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  };

  const formatDate = (isoString) => {
    if (!isoString) return '';
    const date = new Date(isoString);
    return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
  };

  return (
    <div className="app-container">
      {/* Header Bar */}
      <header className="header-bar">
        <div className="brand">
          <Activity size={18} style={{ color: 'var(--accent-primary)' }} />
          <span>User Analytics Portal</span>
        </div>
        <button className="refresh-btn" onClick={handleRefresh}>
          <RefreshCw size={13} />
          <span>Refresh</span>
        </button>
      </header>

      <main className="main-content">
        {/* Statistics Grid (Bonus Metrics) */}
        <div style={{ marginBottom: '-1rem' }}>
          <span style={{ fontSize: '0.725rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-tertiary)', fontWeight: 'bold' }}>
            Bonus Metrics Dashboard
          </span>
        </div>
        
        <section className="stats-grid">
          <div className="stat-card">
            <span className="stat-title">Total Sessions</span>
            <span className="stat-value">{loadingStats ? '...' : stats.totalSessions}</span>
          </div>

          <div className="stat-card">
            <span className="stat-title">Total Events</span>
            <span className="stat-value">{loadingStats ? '...' : stats.totalEvents}</span>
          </div>

          <div className="stat-card">
            <span className="stat-title">Total Clicks</span>
            <span className="stat-value">{loadingStats ? '...' : stats.totalClicks}</span>
          </div>

          <div className="stat-card">
            <span className="stat-title">Click-Through Rate</span>
            <span className="stat-value">{loadingStats ? '...' : `${stats.ctr}%`}</span>
          </div>
        </section>

        {/* Dashboard Grid */}
        <div className="dashboard-grid">
          {/* Left Column: Structured Table of Active Sessions */}
          <section className="panel">
            <h3 className="panel-title">
              <Activity size={14} style={{ color: 'var(--text-secondary)' }} />
              <span>Session Log Listings</span>
            </h3>
            
            <div className="table-container">
              {loadingSessions ? (
                <div style={{ textAlign: 'center', padding: '1.5rem', color: 'var(--text-tertiary)' }}>
                  Loading sessions...
                </div>
              ) : sessions.length === 0 ? (
                <div className="empty-state">
                  <span>No recorded session history.</span>
                  <span style={{ fontSize: '0.75rem', marginTop: '0.25rem' }}>
                    Access /demo/ to populate tracking event logs.
                  </span>
                </div>
              ) : (
                <table className="analytics-table">
                  <thead>
                    <tr>
                      <th>Session ID</th>
                      <th>Views</th>
                      <th>Clicks</th>
                      <th>Time</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sessions.map((sess) => {
                      const isActive = sess._id === activeSessionId;
                      return (
                        <tr 
                          key={sess._id} 
                          className={isActive ? 'active' : ''}
                          onClick={() => setActiveSessionId(sess._id)}
                        >
                          <td className="session-id-cell" title={sess._id}>
                            {sess._id.substring(0, 12)}...
                          </td>
                          <td>{sess.pageViews}</td>
                          <td>{sess.clicks}</td>
                          <td>{formatTime(sess.startTime)}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </div>
          </section>

          {/* Right Column: Timelines & Heatmaps */}
          <div className="viz-section">
            
            {/* Panel: Active Session Journey Timeline Log */}
            <section className="panel">
              <h3 className="panel-title">
                <Clock size={14} style={{ color: 'var(--text-secondary)' }} />
                <span>Session journey path logs</span>
              </h3>

              <div className="timeline-log">
                {loadingEvents ? (
                  <div style={{ textAlign: 'center', padding: '1.5rem', color: 'var(--text-tertiary)' }}>
                    Loading events timeline...
                  </div>
                ) : !activeSessionId ? (
                  <div className="empty-state">
                    <span>Select a session row from the listings to view its journey details.</span>
                  </div>
                ) : sessionEvents.length === 0 ? (
                  <div className="empty-state">
                    <span>No events recorded for this session.</span>
                  </div>
                ) : (
                  sessionEvents.map((evt, idx) => (
                    <div key={evt._id || idx} className={`log-item ${evt.event_type}`}>
                      <div className="log-icon-wrapper">
                        {evt.event_type === 'page_view' ? <Eye size={11} /> : <MousePointer size={11} />}
                      </div>
                      <div className="log-details">
                        <div className="log-meta">
                          <span className="log-type-badge">{evt.event_type}</span>
                          <span>{formatTime(evt.timestamp)}</span>
                        </div>
                        <div className="log-message">
                          {evt.event_type === 'page_view' ? (
                            <span>Visited page URL: <strong>{evt.page_url}</strong></span>
                          ) : (
                            <span>Registered mouse click on page: <strong>{evt.page_url}</strong></span>
                          )}
                        </div>
                        {evt.event_type === 'click' && evt.click_coordinates && (
                          <div>
                            <span className="log-coords">
                              raw: ({evt.click_coordinates.x}px, {evt.click_coordinates.y}px) | normalized: ({evt.click_coordinates.x_pct}%, {evt.click_coordinates.y_pct}%)
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </section>

            {/* Panel: Click Heatmap Overlay Visualization */}
            <section className="panel">
              <div className="heatmap-controls">
                <h3 className="panel-title" style={{ borderBottom: 'none', paddingBottom: 0 }}>
                  <MapPin size={14} style={{ color: 'var(--text-secondary)' }} />
                  <span>Click coordinates heatmap visualization</span>
                </h3>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <select 
                    className="select-input" 
                    value={heatmapPage}
                    onChange={(e) => setHeatmapPage(e.target.value)}
                  >
                    <option value="/demo/">Home Page (/demo/)</option>
                    <option value="/demo/pricing.html">Pricing Page (/demo/pricing.html)</option>
                    <option value="/demo/about.html">About Page (/demo/about.html)</option>
                  </select>
                  <div className="heatmap-info">
                    <strong>{loadingHeatmap ? '...' : heatmapClicks.length}</strong> Clicks registered
                  </div>
                </div>
              </div>

              {/* Browser Frame Mockup */}
              <div className="browser-frame">
                <div className="browser-bar">
                  <div className="browser-buttons">
                    <span className="browser-btn"></span>
                    <span className="browser-btn"></span>
                    <span className="browser-btn"></span>
                  </div>
                  <div className="browser-address">
                    https://casualfunnel.in{heatmapPage}
                  </div>
                </div>

                {/* Wireframe Mockup Canvas */}
                <div className="heatmap-canvas">
                  <div className="heatmap-underlay">
                    {/* Common Navigation Header */}
                    <div className="wire-header">
                      <div className="wire-logo">Casual Funnel</div>
                      <div className="wire-nav">
                        <div className="wire-nav-link" style={{ backgroundColor: heatmapPage === '/demo/' ? '#475569' : '' }}></div>
                        <div className="wire-nav-link" style={{ backgroundColor: heatmapPage === '/demo/pricing.html' ? '#475569' : '' }}></div>
                        <div className="wire-nav-link" style={{ backgroundColor: heatmapPage === '/demo/about.html' ? '#475569' : '' }}></div>
                      </div>
                    </div>

                    {/* Conditional Mock Content representing wireframe page layouts */}
                    {heatmapPage === '/demo/' && (
                      <div className="wire-hero">
                        <div className="wire-title"></div>
                        <div className="wire-subtitle"></div>
                        <div className="wire-cta"></div>
                        <div className="wire-grid">
                          <div className="wire-card"></div>
                          <div className="wire-card"></div>
                          <div className="wire-card"></div>
                        </div>
                      </div>
                    )}

                    {heatmapPage === '/demo/pricing.html' && (
                      <div className="wire-hero" style={{ justifyContent: 'space-around', gap: '0.4rem', border: 'none', background: 'transparent', padding: 0 }}>
                        <div className="wire-title" style={{ width: '30%', height: '10px' }}></div>
                        <div className="wire-pricing-grid">
                          <div className="wire-pricing-card">
                            <div className="wire-p-title"></div>
                            <div className="wire-p-price"></div>
                            <div className="wire-p-btn"></div>
                          </div>
                          <div className="wire-pricing-card premium">
                            <div className="wire-p-title"></div>
                            <div className="wire-p-price"></div>
                            <div className="wire-p-btn"></div>
                          </div>
                          <div className="wire-pricing-card">
                            <div className="wire-p-title"></div>
                            <div className="wire-p-price"></div>
                            <div className="wire-p-btn"></div>
                          </div>
                        </div>
                      </div>
                    )}

                    {heatmapPage === '/demo/about.html' && (
                      <div className="wire-about-body">
                        <div className="wire-about-title"></div>
                        <div className="wire-about-para"></div>
                        <div className="wire-about-para short"></div>
                        <div className="wire-team" style={{ gridTemplateColumns: '1fr', maxWidth: '200px', margin: '0.25rem auto 0' }}>
                          <div className="wire-member">
                            <div className="wire-avatar"></div>
                            <div className="wire-name"></div>
                          </div>
                        </div>
                        <div className="wire-cta" style={{ width: '60px', height: '14px', margin: '0.4rem auto 0' }}></div>
                      </div>
                    )}
                  </div>

                  {/* Absolute Click Overlay Markers */}
                  {!loadingHeatmap && heatmapClicks.map((click, idx) => (
                    <div 
                      key={idx} 
                      className="click-heat-dot" 
                      style={{ 
                        left: `${click.x_pct}%`, 
                        top: `${click.y_pct}%` 
                      }}
                      title={`Clicked at (${click.x}px, ${click.y}px) at ${formatTime(click.timestamp)}`}
                    ></div>
                  ))}
                </div>
              </div>
            </section>
          </div>
        </div>
      </main>
      <div className="video-overlay-banner">{overlayText}</div>
    </div>
  );
}
