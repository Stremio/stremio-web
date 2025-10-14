const EventEmitter = require('eventemitter3');

const events = new EventEmitter();
const overrides = new Map();

module.exports = {
    set: (metaId, watched) => {
        if (typeof metaId !== 'string') return;
        if (watched === null || typeof watched === 'undefined') {
            overrides.delete(metaId);
        } else {
            overrides.set(metaId, !!watched);
        }
        events.emit('change', metaId, watched);
    },
    get: (metaId) => {
        return overrides.has(metaId) ? overrides.get(metaId) : null;
    },
    clear: (metaId) => {
        overrides.delete(metaId);
        events.emit('change', metaId, null);
    },
    onChange: (cb) => {
        events.on('change', cb);
        return () => events.off('change', cb);
    }
};
