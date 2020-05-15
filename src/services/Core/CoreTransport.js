// Copyright (C) 2017-2020 Smart code 203358507

const EventEmitter = require('events');
const { StremioCoreWeb } = require('@stremio/stremio-core-web');

function CoreTransport() {
    const events = new EventEmitter();
    events.on('error', () => { });

    const core = new StremioCoreWeb(({ name, args }) => {
        try {
            events.emit(name, args);
        } catch (error) {
            /* eslint-disable-next-line no-console */
            console.error(error);
        }
    });

    this.on = function(name, listener) {
        events.on(name, listener);
    };
    this.off = function(name, listener) {
        events.off(name, listener);
    };
    this.dispatch = function(action, model) {
        return core.dispatch(action, model);
    };
    this.getState = function(model) {
        return core.get_state(model);
    };
}

module.exports = CoreTransport;
