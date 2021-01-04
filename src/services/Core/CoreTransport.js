// Copyright (C) 2017-2020 Smart code 203358507

const { get_state, dispatch } = require('@stremio/stremio-core-web');

function CoreTransport(events) {
    this.on = function(name, listener) {
        events.on(name, listener);
    };
    this.off = function(name, listener) {
        events.off(name, listener);
    };
    this.getState = function(field) {
        return get_state(field);
    };
    this.dispatch = function(action, field) {
        try {
            return dispatch(action, field);
        } catch (error) {
            console.error('CoreTransport', error);
        }
    };
}

module.exports = CoreTransport;
