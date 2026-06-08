require('./wallisStreamingServerRewrite');

const Bridge = require('@stremio/stremio-core-web/bridge');
const bridge = new Bridge(self, self);

self.init = async ({ appVersion, shellVersion }) => {
    // Shim kept from the upstream worker until bundled import.meta no longer needs it.
    self.document = {
        baseURI: self.location.href,
    };
    self.app_version = appVersion;
    self.shell_version = shellVersion;

    self.get_location_hash = async () => bridge.call(['location', 'hash'], []);
    self.local_storage_get_item = async (key) => bridge.call(['localStorage', 'getItem'], [key]);
    self.local_storage_set_item = async (key, value) => bridge.call(['localStorage', 'setItem'], [key, value]);
    self.local_storage_remove_item = async (key) => bridge.call(['localStorage', 'removeItem'], [key]);

    const {
        default: initializeApi,
        initialize_runtime: initializeRuntime,
        get_state: getState,
        get_debug_state: getDebugState,
        dispatch,
        analytics,
        decode_stream: decodeStream,
        encode_stream: encodeStream,
    } = require('@stremio/stremio-core-web');

    self.getState = getState;
    self.getDebugState = getDebugState;
    self.dispatch = dispatch;
    self.analytics = analytics;
    self.decodeStream = decodeStream;
    self.encodeStream = encodeStream;

    await initializeApi({
        module_or_path: require('@stremio/stremio-core-web/stremio_core_web_bg.wasm'),
    });
    await initializeRuntime((event) => bridge.call(['onCoreEvent'], [event]));
};
