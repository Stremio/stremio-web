// Copyright (C) 2017-2026 Smart code 203358507

const fs = require('fs');
const path = require('path');
const vm = require('vm');
const { transformSync } = require('@babel/core');
const React = require('react');

// Exercise the modal's button props without mounting the app, core worker or portal.
const loadComponent = (file, mocks) => {
    const filename = path.join(__dirname, '..', file);
    const { code } = transformSync(fs.readFileSync(filename, 'utf8'), {
        babelrc: false,
        configFile: false,
        presets: ['@babel/preset-react']
    });
    const module = { exports: {} };
    vm.runInNewContext('(function(require, module) {' + code + '\n})', { })(
        (name) => Object.hasOwn(mocks, name) ? mocks[name] : require(name), module
    );
    return module.exports;
};

const addon = (changes = {}) => ({
    transportUrl: 'https://addon.example/manifest.json',
    flags: { official: false, protected: false },
    manifest: {
        id: 'example.addon',
        version: '1.0.0',
        resources: ['catalog'],
        catalogs: [],
        behaviorHints: { configurable: false, configurationRequired: false }
    },
    ...changes
});

describe('addon details upgrade', () => {
    let state, dispatch, close, trusted, Modal;
    beforeEach(() => {
        const local = addon();
        state = {
            selected: { transportUrl: local.transportUrl },
            localAddon: local,
            remoteAddon: { content: { type: 'Ready', content: addon({
                manifest: { ...addon().manifest, version: '1.1.0' }
            }) } }
        };
        dispatch = jest.fn();
        close = jest.fn();
        trusted = false;
        Modal = loadComponent('src/components/AddonDetailsModal/AddonDetailsModal.js', {
            react: { ...React, useMemo: (fn) => fn(), useState: () => [trusted, jest.fn()] },
            'react-i18next': { useTranslation: () => ({ t: (key) => key }) },
            'stremio/core': { useCore: () => ({ transport: { dispatch } }) },
            'stremio/common/Platform': { usePlatform: () => ({ openExternal: jest.fn() }) },
            'stremio/common/CoreSuspender': { withCoreSuspender: (component) => component },
            'stremio/components/ModalDialog': 'modal',
            './AddonDetails': () => null,
            './useAddonDetails': () => state,
            './receivesWatchActivity': require('../src/components/AddonDetailsModal/receivesWatchActivity'),
            './styles': {}
        });
    });
    const render = () => Modal({ transportUrl: state.selected.transportUrl, onCloseRequest: close });
    const upgrade = () => render().props.buttons.find((button) => button.label === 'ADDON_UPGRADE');
    const remote = () => state.remoteAddon.content.content;

    test('upgrades the fetched descriptor in place and closes the modal', () => {
        const event = { nativeEvent: {} };
        upgrade().props.onClick(event);
        expect(dispatch).toHaveBeenCalledTimes(1);
        expect(dispatch).toHaveBeenCalledWith({ action: 'Ctx', args: { action: 'UpgradeAddon', args: remote() } });
        expect(close).toHaveBeenCalledWith({ type: 'upgrade', reactEvent: event, nativeEvent: event.nativeEvent });
    });

    test('allows catalog changes without a version bump', () => {
        remote().manifest.version = state.localAddon.manifest.version;
        remote().manifest.catalogs = [{ type: 'movie', id: 'new-catalog' }];
        expect(upgrade()).toBeDefined();
    });

    test('hides upgrade when the descriptor is unchanged', () => {
        state.remoteAddon.content.content = JSON.parse(JSON.stringify(state.localAddon));
        expect(upgrade()).toBeUndefined();
    });

    test.each(['Loading', 'Err'])('hides upgrade for a %s remote manifest', (type) => {
        state.remoteAddon.content = { type, content: null };
        expect(upgrade()).toBeUndefined();
    });

    test('hides upgrade before a manifest request exists', () => {
        state.remoteAddon = null;
        expect(upgrade()).toBeUndefined();
    });

    test('offers install rather than upgrade for uninstalled addons', () => {
        state.localAddon = null;
        expect(upgrade()).toBeUndefined();
        expect(render().props.buttons.some((button) => button.label === 'ADDON_INSTALL')).toBe(true);
    });

    test.each(['local', 'remote'])('hides upgrade when the %s addon is protected', (which) => {
        (which === 'local' ? state.localAddon : remote()).flags.protected = true;
        expect(upgrade()).toBeUndefined();
    });

    test('hides upgrade when configuration is required', () => {
        remote().manifest.behaviorHints.configurationRequired = true;
        expect(upgrade()).toBeUndefined();
    });

    test('rejects an unrelated manifest id', () => {
        remote().manifest.id = 'different.addon';
        expect(upgrade()).toBeUndefined();
    });

    test('rejects a different transport URL', () => {
        remote().transportUrl = 'https://other.example/manifest.json';
        expect(upgrade()).toBeUndefined();
    });

    test.each(['player', { name: 'library', types: ['movie'] }])('requires consent for newly added %p access', (resource) => {
        remote().manifest.resources.push(resource);
        expect(render().props.checkboxes).toHaveLength(1);
        expect(upgrade().props.disabled).toBe(true);
        upgrade().props.onClick({ nativeEvent: {} });
        expect(dispatch).not.toHaveBeenCalled();
        trusted = true;
        expect(upgrade().props.disabled).toBe(false);
        upgrade().props.onClick({ nativeEvent: {} });
        expect(dispatch).toHaveBeenCalledTimes(1);
    });

    test('does not ask again for existing watch-activity access', () => {
        state.localAddon.manifest.resources.push('player');
        remote().manifest.resources.push('player');
        expect(render().props.checkboxes).toHaveLength(0);
        expect(upgrade().props.disabled).toBe(false);
    });

    test('preserves configure and uninstall actions', () => {
        remote().manifest.behaviorHints.configurable = true;
        expect(render().props.buttons.map((button) => button.label)).toEqual([
            'BUTTON_CANCEL', 'ADDON_CONFIGURE', 'ADDON_UPGRADE', 'ADDON_UNINSTALL'
        ]);
    });
});

test('shows translated success only after the core confirms the upgrade', () => {
    const core = { on: jest.fn(), off: jest.fn() };
    const filedrop = { on: jest.fn(), off: jest.fn() };
    const toast = { show: jest.fn() };
    let cleanup;
    const Toaster = loadComponent('src/App/ServicesToaster.js', {
        react: { useEffect: (fn) => { cleanup = fn(); } },
        'react-i18next': { useTranslation: () => ({ t: (key) => 'translated:' + key }) },
        'stremio/core': { useCore: () => core },
        'stremio/common': { useToast: () => toast, useFileDrop: () => filedrop }
    });
    Toaster();
    expect(toast.show).not.toHaveBeenCalled();
    const listener = core.on.mock.calls.find(([name]) => name === 'event')[1];
    listener('AddonUpgraded', { id: 'example.addon' });
    expect(toast.show).toHaveBeenCalledWith({ type: 'success', title: 'translated:ADDON_UPGRADED_MSG', timeout: 4000 });
    cleanup();
    expect(core.off).toHaveBeenCalledWith('event', listener);
});
