// Copyright (C) 2017-2022 Smart code 203358507

const sanitizeLocationPath = require('stremio/common/sanitizeLocationPath');
const Bridge = require('./bridge');

const bridge = new Bridge(self, self);

self.init = async ({ baseURI, appVersion, shellVersion }) => {
    self.document = { baseURI };
    self.app_version = appVersion;
    self.shell_version = shellVersion;
    self.sanitize_location_path = sanitizeLocationPath;
    self.get_location_hash = async () => bridge.call(['location', 'hash'], []);
    self.local_storage_get_item = async (key) => bridge.call(['localStorage', 'getItem'], [key]);
    self.local_storage_set_item = async (key, value) => bridge.call(['localStorage', 'setItem'], [key, value]);
    self.local_storage_remove_item = async (key) => bridge.call(['localStorage', 'removeItem'], [key]);
    const { default: initialize_api, initialize_runtime, get_state, get_debug_state, dispatch, analytics, decode_stream } = require('@stremio/stremio-core-web');
    self.getState = get_state;
    self.getDebugState = get_debug_state;
    self.dispatch = dispatch;
    self.analytics = analytics;
    self.decodeStream = decode_stream;
    await initialize_api(require('@stremio/stremio-core-web/stremio_core_web_bg.wasm'));
    await initialize_runtime((event) => bridge.call(['onCoreEvent'], [event]));
};
