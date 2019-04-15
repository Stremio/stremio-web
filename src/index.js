const React = require('react');
const ReactDOM = require('react-dom');
const StateContainer = require('stremio-state-container-web');
const App = require('./App');

const loadShell = () => {
    if (!window.qt || window.shell) {
        return Promise.resolve();
    }

    return new Promise((resolve) => {
        window.shellOnLoad = () => {
            resolve();
        };
    });
};

const loadStateContainer = () => {
    if (window.stateContainer) {
        return Promise.resolve();
    }

    return StateContainer.load();
};

Promise.all([
    loadShell(),
    loadStateContainer()
]).then(() => {
    if (window.shell) {
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
    }

    ReactDOM.render(<App />, document.getElementById('app'));
});
