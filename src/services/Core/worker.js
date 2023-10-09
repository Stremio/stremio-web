require('core-js/stable');
require('regenerator-runtime/runtime');

const Bridge = require('@stremio/stremio-core-asmjs/bridge');

const bridge = new Bridge(self, self);

self.init = async ({ appVersion, shellVersion }) => {
    self.document = {
        baseURI: self.location.href
    };
    self.app_version = appVersion;
    self.shell_version = shellVersion;
    self.get_location_hash = async () => bridge.call(['location', 'hash'], []);
    self.local_storage_get_item = async (key) => bridge.call(['localStorage', 'getItem'], [key]);
    self.local_storage_set_item = async (key, value) => bridge.call(['localStorage', 'setItem'], [key, value]);
    self.local_storage_remove_item = async (key) => bridge.call(['localStorage', 'removeItem'], [key]);
    const { initialize_runtime, get_state, get_debug_state, dispatch, analytics, decode_stream } = require('@stremio/stremio-core-asmjs');
    self.getState = get_state;
    self.getDebugState = get_debug_state;
    self.dispatch = dispatch;
    self.analytics = analytics;
    self.decodeStream = decode_stream;
    await initialize_runtime((event) => bridge.call(['onCoreEvent'], [event]));
};
