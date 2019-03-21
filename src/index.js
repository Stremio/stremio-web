const React = require('react');
const ReactDOM = require('react-dom');
const App = require('./App');

const renderApp = () => {
    ReactDOM.render(<App />, document.getElementById('app'));
};

if (window.qt) {
    window.shellOnLoad = () => {
        window.shell.dispatch('mpv', 'setOption', null, 'terminal', 'yes');
        window.shell.dispatch('mpv', 'setOption', null, 'msg-level', 'all=v');
        window.shell.dispatch('mpv', 'setProp', null, 'vo', 'opengl-cb');
        window.shell.dispatch('mpv', 'setProp', null, 'opengl-hwdec-interop', 'auto');
        window.shell.dispatch('mpv', 'setProp', null, 'cache-default', 15000);
        window.shell.dispatch('mpv', 'setProp', null, 'cache-backbuffer', 15000);
        window.shell.dispatch('mpv', 'setProp', null, 'cache-secs', 10);
        window.shell.dispatch('mpv', 'setProp', null, 'audio-client-name', 'Stremio');
        window.shell.dispatch('mpv', 'setProp', null, 'title', 'Stremio');
        window.shell.dispatch('mpv', 'setProp', null, 'audio-fallback-to-null', 'yes');
        window.shell.dispatch('mpv', 'setProp', null, 'sid', 'no');
        renderApp();
    };
} else {
    renderApp();
}
