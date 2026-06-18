const mongoose = require('mongoose');

const EventSchema = new mongoose.Schema({
  session_id: {
    type: String,
    required: true,
    index: true
  },
  event_type: {
    type: String,
    enum: ['page_view', 'click'],
    required: true
  },
  page_url: {
    type: String,
    required: true,
    index: true
  },
  timestamp: {
    type: Date,
    default: Date.now,
    index: true
  },
  click_coordinates: {
    x: { type: Number },
    y: { type: Number },
    x_pct: { type: Number },
    y_pct: { type: Number }
  }
});

const RealModel = mongoose.model('Event', EventSchema);

// ============================================================================
// DEVELOPMENT CONVENIENCE FALLBACK: Mock MongoDB Model & Store
// This block is optionally used for zero-config testing if local MongoDB
// is not running. MongoDB is the required database for production builds.
// ============================================================================

let eventsStore = [];

class MockEvent {
  constructor(properties) {
    Object.assign(this, properties);
    if (!this._id) {
      this._id = 'evt_' + Math.random().toString(36).substring(2, 15);
    }
    if (!this.timestamp) {
      this.timestamp = new Date();
    }
  }

  async save() {
    eventsStore.push(this);
    return this;
  }

  // MUST NOT be async, so it returns the chain object synchronously.
  // The chain's then() method will resolve when the caller awaits it.
  static find(query = {}) {
    let result = [...eventsStore];
    if (query.session_id) {
      result = result.filter(e => e.session_id === query.session_id);
    }
    if (query.event_type) {
      result = result.filter(e => e.event_type === query.event_type);
    }
    if (query.page_url) {
      result = result.filter(e => e.page_url === query.page_url);
    }
    
    // Support sorting and selection wrappers
    const chain = {
      sort(sortQuery) {
        const field = Object.keys(sortQuery)[0];
        const order = sortQuery[field];
        result.sort((a, b) => {
          const valA = a[field] instanceof Date ? a[field].getTime() : a[field];
          const valB = b[field] instanceof Date ? b[field].getTime() : b[field];
          if (valA < valB) return -order;
          if (valA > valB) return order;
          return 0;
        });
        return this;
      },
      select(selectStr) {
        const fields = selectStr.split(' ');
        result = result.map(item => {
          const newItem = {};
          fields.forEach(f => {
            if (f === 'click_coordinates') newItem.click_coordinates = item.click_coordinates;
            if (f === 'timestamp') newItem.timestamp = item.timestamp;
            if (f === 'page_url') newItem.page_url = item.page_url;
            if (f === 'event_type') newItem.event_type = item.event_type;
          });
          return newItem;
        });
        return this;
      },
      // Promise conversion interface (thenable)
      then(resolve) {
        resolve(result);
      }
    };
    return chain;
  }

  static async countDocuments(query = {}) {
    let result = [...eventsStore];
    if (query.event_type) {
      result = result.filter(e => e.event_type === query.event_type);
    }
    return result.length;
  }

  static async distinct(field) {
    const values = eventsStore.map(e => e[field]);
    return [...new Set(values)];
  }

  static async aggregate(pipeline) {
    const groups = {};
    eventsStore.forEach(evt => {
      const sid = evt.session_id;
      if (!groups[sid]) {
        groups[sid] = {
          _id: sid,
          totalEvents: 0,
          clicks: 0,
          pageViews: 0,
          startTime: evt.timestamp,
          endTime: evt.timestamp
        };
      }
      groups[sid].totalEvents += 1;
      if (evt.event_type === 'click') groups[sid].clicks += 1;
      if (evt.event_type === 'page_view') groups[sid].pageViews += 1;
      
      const evtTime = new Date(evt.timestamp).getTime();
      const startTime = new Date(groups[sid].startTime).getTime();
      const endTime = new Date(groups[sid].endTime).getTime();

      if (evtTime < startTime) groups[sid].startTime = evt.timestamp;
      if (evtTime > endTime) groups[sid].endTime = evt.timestamp;
    });

    const result = Object.values(groups);
    // Sort by startTime desc
    result.sort((a, b) => new Date(b.startTime) - new Date(a.startTime));
    return result;
  }
}

// Export a Proxy that routes calls dynamically to either Mongoose or In-Memory Mock.
// Target must be RealModel (a constructor function) so EventProxy is constructable.
const EventProxy = new Proxy(RealModel, {
  get(target, prop) {
    if (global.useMockDb && process.env.NODE_ENV !== 'production') {
      if (prop === 'prototype') return MockEvent.prototype;
      return MockEvent[prop];
    } else {
      if (prop === 'prototype') return RealModel.prototype;
      return RealModel[prop];
    }
  },
  construct(target, args) {
    if (global.useMockDb && process.env.NODE_ENV !== 'production') {
      return new MockEvent(...args);
    } else {
      return new RealModel(...args);
    }
  }
});

module.exports = EventProxy;
