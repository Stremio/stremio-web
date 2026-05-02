// Copyright (C) 2017-2026 Smart code 203358507
//
// Shell-mode ChromecastTransport: bridges to the bundled streaming server's
// /casting/ HTTP API instead of Google CAF (Cast Sender API). This is the
// path that gets cast working in the desktop shell on Windows, where
// Microsoft does not ship Chromium's Cast Sender Media Router with WebView2,
// so the regular CAF transport can never discover devices.
//
// The streaming server already implements full Chromecast + DLNA support
// (mDNS/SSDP discovery, the castv2 sender protocol, DLNA, transcoding via
// ffmpeg). This module is a thin façade that:
//   - polls /casting/                   for device discovery
//   - polls /casting/<dev>/player       for playback status
//   - posts /casting/<dev>/player?...   for play / pause / seek / stop
//   - resolves magnet/infoHash streams  via /<infoHash>/create on the server
//
// Public surface mirrors ChromecastTransport.js so that consumers (Chromecast
// service, ChromecastSenderVideo) work unchanged.

const EventEmitter = require('eventemitter3');
const magnet = require('magnet-uri');

// Use the actual Google CAF wire values for these enums. The real cast SDK
// can also load and replace our stub constants, so anything we emit here must
// agree with CAF on the wire so subscriptions match either way.
const CAST_STATE = Object.freeze({
    NO_DEVICES: 'NO_DEVICES_AVAILABLE',
    NOT_CONNECTED: 'NOT_CONNECTED',
    CONNECTING: 'CONNECTING',
    CONNECTED: 'CONNECTED',
});
const SESSION_STATE = Object.freeze({
    NO_SESSION: 'NO_SESSION',
    SESSION_STARTED: 'SESSION_STARTED',
    SESSION_ENDED: 'SESSION_ENDED',
});
const EVENT = Object.freeze({
    CAST_STATE_CHANGED: 'caststatechanged',
    SESSION_STATE_CHANGED: 'sessionstatechanged',
});

// Cast V2 player states as exposed by the streaming server's status response.
const SERVER_STATE = Object.freeze({
    PLAYING: 3,
    PAUSED_LIKE: 4,
    BUFFERING: 6,
});

const DEVICES_POLL_MS = 5000;
const STATUS_POLL_MS = 1000;

// The streaming server's ChromecastClient.PLAYBACK_DELAY is 4000ms — it
// schedules a deferred LOAD that resets seekTime to 0 after probe. Any seek
// issued within this window is overwritten. Wait past it before seeking.
const SAFE_SEEK_DELAY_MS = 6500;
const READY_TIMEOUT_MS = 15000;

function ShellChromecastTransport() {
    const events = new EventEmitter();

    // Base for /casting/ and /<infoHash>/* fetches.
    //
    // Defaults to the local streaming server's standard port — that's where
    // stremio-runtime listens, and Chromium-based browsers exempt fetches to
    // http://localhost:* from mixed-content blocking, so this works even when
    // the page is served over HTTPS (i.e. the shell loads web.stremio.com,
    // and the streaming server's built-in CORS allow-list permits *.stremio.com).
    //
    // Overridden at first load() from action.commandArgs.streamingServerURL
    // so user-configured remote streaming servers also work.
    let streamingServerBase = 'http://127.0.0.1:11470';

    let devices = [];
    let castState = CAST_STATE.NO_DEVICES;
    let sessionState = SESSION_STATE.NO_SESSION;
    let currentDevice = null;
    let lastStatus = null;
    let devicesTimer = null;
    let statusTimer = null;
    let initFired = false;
    // Subtitle tracks for the current stream. Populated from
    // commandArgs.stream.subtitles at load time and extended by the
    // addExtraSubtitlesTracks command. Mapped from React's track id back to
    // the .srt/.vtt URL when the user picks a track.
    let subtitlesTracks = [];
    let extraSubtitlesTracks = [];
    let subtitlesOffset = 0;
    let subtitlesSize = null;

    function joinUrl(base, path) {
        if (!base) return path;
        const trimmed = base.replace(/\/+$/, '');
        return trimmed + (path.startsWith('/') ? path : '/' + path);
    }

    function setCastState(next) {
        if (castState === next) return;
        castState = next;
        events.emit(EVENT.CAST_STATE_CHANGED, { castState: next });
    }

    function emitMessage(message) {
        // ChromecastSenderVideo subscribes via transport.on('message', fn) and
        // expects { event: 'propValue'|'propChanged'|..., args: [...] }.
        events.emit('message', message);
    }

    async function fetchJson(path, init) {
        const res = await fetch(joinUrl(streamingServerBase, path), init);
        if (!res.ok) throw new Error('HTTP ' + res.status + ' ' + path);
        try { return await res.json(); } catch (_) { return null; }
    }

    async function fetchDevices() {
        try {
            const list = await fetchJson('/casting/');
            devices = Array.isArray(list) ? list : [];
            if (currentDevice === null) {
                setCastState(devices.length > 0 ? CAST_STATE.NOT_CONNECTED : CAST_STATE.NO_DEVICES);
            }
        } catch (_) {
            devices = [];
            if (currentDevice === null) setCastState(CAST_STATE.NO_DEVICES);
        }
        if (!initFired) { initFired = true; events.emit('init'); }
    }

    function startDevicesPolling() {
        if (devicesTimer !== null) return;
        fetchDevices();
        devicesTimer = setInterval(fetchDevices, DEVICES_POLL_MS);
    }

    function stopStatusPolling() {
        if (statusTimer !== null) {
            clearInterval(statusTimer);
            statusTimer = null;
        }
    }
    function startStatusPolling() {
        stopStatusPolling();
        statusTimer = setInterval(pollStatus, STATUS_POLL_MS);
        pollStatus();
    }

    async function callPlayer(params) {
        if (currentDevice === null) throw new Error('no current device');
        const qs = new URLSearchParams();
        Object.entries(params || {}).forEach(([k, v]) => {
            if (v !== undefined && v !== null) qs.set(k, String(v));
        });
        const path = '/casting/' + encodeURIComponent(currentDevice.id) + '/player' + (qs.toString() ? '?' + qs.toString() : '');
        return await fetchJson(path);
    }

    // Wait until the streaming server reports a state where seek/pause/play
    // commands will be honored. State === PLAYING is the strong signal; a
    // non-zero length means ffprobe finished, which gets us close.
    async function waitForReady(timeoutMs) {
        const deadline = Date.now() + timeoutMs;
        while (Date.now() < deadline) {
            try {
                const status = await callPlayer({});
                if (status && (status.state === SERVER_STATE.PLAYING || (typeof status.length === 'number' && status.length > 0))) {
                    return true;
                }
            } catch (_) { /* try again */ }
            await new Promise((r) => setTimeout(r, 500));
        }
        return false;
    }

    async function pollStatus() {
        let status;
        try {
            status = await callPlayer({});
        } catch (_) { return; }
        if (!status) return;
        const mapping = {
            paused: status.paused === true,
            time: typeof status.time === 'number' ? status.time : null,
            duration: typeof status.length === 'number' ? status.length : null,
            volume: typeof status.volume === 'number' ? status.volume : null,
            buffering: status.state === SERVER_STATE.BUFFERING,
            buffered: null,
            audioTracks: Array.isArray(status.audio) ? status.audio.map((t, i) => ({
                id: t.id || String(i),
                lang: t.lang,
                label: t.title || t.lang,
                embedded: true,
            })) : [],
            selectedAudioTrackId: status.audioTrack || null,
            subtitlesTracks: subtitlesTracks,
            extraSubtitlesTracks: extraSubtitlesTracks,
        };
        for (const [name, value] of Object.entries(mapping)) {
            const prev = lastStatus ? lastStatus[name] : undefined;
            if (JSON.stringify(value) !== JSON.stringify(prev)) {
                emitMessage({ event: 'propChanged', args: [name, value] });
            }
        }
        lastStatus = mapping;
    }

    function showPicker() {
        return new Promise((resolve, reject) => {
            const overlay = document.createElement('div');
            overlay.setAttribute('data-shell-cast-picker', '1');
            Object.assign(overlay.style, {
                position: 'fixed', inset: '0', zIndex: '2147483647',
                background: 'rgba(0, 0, 0, 0.55)', display: 'flex',
                alignItems: 'center', justifyContent: 'center',
                fontFamily: 'inherit', color: '#fff',
            });
            const card = document.createElement('div');
            Object.assign(card.style, {
                background: '#1a1a1c', borderRadius: '8px',
                minWidth: '320px', maxWidth: '420px', padding: '20px',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.6)',
            });
            const title = document.createElement('div');
            title.textContent = 'Cast to a device';
            Object.assign(title.style, { fontSize: '16px', fontWeight: '600', marginBottom: '14px' });
            card.appendChild(title);

            if (devices.length === 0) {
                const empty = document.createElement('div');
                empty.textContent = 'No devices found on your network.';
                Object.assign(empty.style, { padding: '12px 0', color: '#bbb' });
                card.appendChild(empty);
            } else {
                devices.forEach((device) => {
                    const row = document.createElement('div');
                    row.textContent = device.name + (device.type ? '  ·  ' + device.type : '');
                    Object.assign(row.style, {
                        padding: '10px 12px', borderRadius: '6px',
                        cursor: 'pointer', marginBottom: '4px',
                        background: '#26262a',
                    });
                    row.addEventListener('mouseenter', () => { row.style.background = '#33333a'; });
                    row.addEventListener('mouseleave', () => { row.style.background = '#26262a'; });
                    row.addEventListener('click', () => {
                        document.body.removeChild(overlay);
                        resolve(device);
                    });
                    card.appendChild(row);
                });
            }

            const cancel = document.createElement('div');
            cancel.textContent = 'Cancel';
            Object.assign(cancel.style, {
                marginTop: '14px', padding: '8px 12px',
                textAlign: 'center', cursor: 'pointer', color: '#aaa',
            });
            cancel.addEventListener('click', () => {
                document.body.removeChild(overlay);
                reject(new Error('cancelled'));
            });
            card.appendChild(cancel);

            overlay.appendChild(card);
            document.body.appendChild(overlay);
        });
    }

    // Stream resolution: produce a URL that the streaming server's ffmpeg
    // can probe. HTTP URLs pass through. Magnet/infoHash streams are
    // registered with the streaming server (POST /<infoHash>/create) and we
    // return an absolute torrent URL the server (and the cast device) can
    // reach.
    async function createTorrentSourceUrl(infoHash, fileIdx, sources, seriesInfo) {
        const fileIdxKnown = (fileIdx !== null && fileIdx !== undefined && isFinite(fileIdx));
        const haveSources = Array.isArray(sources) && sources.length > 0;

        // Fast path: with a known fileIdx and no extra trackers, the URL is
        // deterministic and the streaming server will create the torrent on
        // demand when it's first accessed.
        if (fileIdxKnown && !haveSources) {
            return joinUrl(streamingServerBase, '/' + encodeURIComponent(infoHash) + '/' + encodeURIComponent(fileIdx));
        }

        const body = { torrent: { infoHash } };
        if (haveSources) {
            const peerSources = ['dht:' + infoHash].concat(sources.map((s) => (
                s.startsWith('tracker:') || s.startsWith('dht:') ? s : 'tracker:' + s
            ))).filter((s, i, all) => all.indexOf(s) === i);
            body.peerSearch = { sources: peerSources, min: 40, max: 200 };
        }
        if (!fileIdxKnown) {
            body.guessFileIdx = {};
            if (seriesInfo) {
                if (seriesInfo.season !== null && isFinite(seriesInfo.season)) body.guessFileIdx.season = seriesInfo.season;
                if (seriesInfo.episode !== null && isFinite(seriesInfo.episode)) body.guessFileIdx.episode = seriesInfo.episode;
            }
        } else {
            body.guessFileIdx = false;
        }

        const data = await fetchJson('/' + encodeURIComponent(infoHash) + '/create', {
            method: 'POST',
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify(body),
        });
        const finalIdx = body.guessFileIdx ? (data && data.guessedFileIdx) : fileIdx;
        if (finalIdx === null || finalIdx === undefined) {
            throw new Error('streaming server could not pick a file');
        }
        return joinUrl(streamingServerBase, '/' + encodeURIComponent(infoHash) + '/' + encodeURIComponent(finalIdx));
    }

    async function resolveStreamUrl(stream, seriesInfo) {
        if (!stream) throw new Error('no stream');
        if (typeof stream.url === 'string') {
            if (stream.url.indexOf('magnet:') !== 0) return stream.url;
            const parsed = magnet.decode(stream.url);
            if (!parsed || typeof parsed.infoHash !== 'string') {
                throw new Error('cannot parse magnet URI');
            }
            const fileIdx = typeof stream.fileIdx === 'number' ? stream.fileIdx : null;
            const announces = Array.isArray(parsed.announce) ? parsed.announce : [];
            return await createTorrentSourceUrl(parsed.infoHash.toLowerCase(), fileIdx, announces, seriesInfo);
        }
        if (typeof stream.infoHash === 'string') {
            const fileIdx = typeof stream.fileIdx === 'number' ? stream.fileIdx : null;
            const announces = Array.isArray(stream.announce) ? stream.announce : [];
            return await createTorrentSourceUrl(stream.infoHash, fileIdx, announces, seriesInfo);
        }
        throw new Error('stream has no playable form');
    }

    // ChromecastSenderVideo's manifest. We replay this to the React side via
    // an `implementationChanged` message because that side never gets it any
    // other way (StremioVideo only forwards external impls' manifests via
    // events, and ChromecastSenderVideo doesn't emit one itself).
    const MANIFEST = Object.freeze({
        name: 'ChromecastSenderVideo',
        external: true,
        props: ['stream', 'loaded', 'paused', 'time', 'duration', 'buffering', 'buffered',
            'audioTracks', 'selectedAudioTrackId', 'subtitlesTracks', 'selectedSubtitlesTrackId',
            'subtitlesOffset', 'subtitlesSize', 'subtitlesTextColor', 'subtitlesBackgroundColor',
            'subtitlesOutlineColor', 'volume', 'muted', 'playbackSpeed', 'videoParams',
            'extraSubtitlesTracks', 'selectedExtraSubtitlesTrackId', 'extraSubtitlesDelay',
            'extraSubtitlesSize', 'extraSubtitlesOffset', 'extraSubtitlesTextColor',
            'extraSubtitlesBackgroundColor', 'extraSubtitlesOutlineColor'],
        commands: ['load', 'unload', 'destroy', 'addExtraSubtitlesTracks'],
        events: ['propValue', 'propChanged', 'ended', 'error',
            'subtitlesTrackLoaded', 'audioTrackLoaded', 'extraSubtitlesTrackLoaded',
            'implementationChanged'],
    });

    // -----------------------------------------------------------------------
    // public API — mirrors ChromecastTransport.js so consumers don't branch
    // -----------------------------------------------------------------------

    this.on = function (name, listener) { events.on(name, listener); };
    this.off = function (name, listener) { events.off(name, listener); };
    this.removeAllListeners = function () { events.removeAllListeners(); };

    this.getCastState = function () { return castState; };
    this.getSessionState = function () { return sessionState; };
    this.getCastDevice = function () {
        return currentDevice ? { friendlyName: currentDevice.name, deviceId: currentDevice.id } : null;
    };

    this.setOptions = function () { /* no-op for shell mode */ };

    this.requestSession = async function () {
        await fetchDevices();
        setCastState(CAST_STATE.CONNECTING);
        let picked;
        try {
            picked = await showPicker();
        } catch (e) {
            setCastState(devices.length > 0 ? CAST_STATE.NOT_CONNECTED : CAST_STATE.NO_DEVICES);
            throw e;
        }
        currentDevice = picked;
        setCastState(CAST_STATE.CONNECTED);

        // Real CAF puts a CastSession in event.session — we provide a stub
        // because the consumer (ChromecastSenderVideo) only reads from the
        // transport, not the session.
        const session = stubSession(picked);
        sessionState = SESSION_STATE.SESSION_STARTED;
        events.emit(EVENT.SESSION_STATE_CHANGED, { sessionState, session });
        startStatusPolling();
    };

    this.endCurrentSession = async function (stopCasting) {
        if (currentDevice === null) return;
        const wasDevice = currentDevice;
        if (stopCasting) {
            try { await callPlayer({ stop: '1' }); } catch (_) { /* device may already be idle */ }
        }
        currentDevice = null;
        lastStatus = null;
        stopStatusPolling();
        sessionState = SESSION_STATE.SESSION_ENDED;
        events.emit(EVENT.SESSION_STATE_CHANGED, { sessionState, session: stubSession(wasDevice) });
        setCastState(devices.length > 0 ? CAST_STATE.NOT_CONNECTED : CAST_STATE.NO_DEVICES);
    };

    this.sendMessage = async function (action) {
        if (currentDevice === null) throw new Error('no session');
        if (!action || typeof action.type !== 'string') return;
        if (action.type === 'observeProp') return handleObserveProp(action);
        if (action.type === 'setProp') return handleSetProp(action);
        if (action.type === 'command') return handleCommand(action);
    };

    // -----------------------------------------------------------------------
    // action handlers
    // -----------------------------------------------------------------------

    function stubSession(device) {
        return {
            getCastDevice: () => ({ friendlyName: device.name, deviceId: device.id }),
            // ChromecastTransport.js installs message + event listeners on the
            // CastSession; we provide no-ops so calls don't throw.
            addMessageListener: () => {},
            removeMessageListener: () => {},
            addEventListener: () => {},
            removeEventListener: () => {},
        };
    }

    function handleObserveProp(action) {
        // Emit the current value so the consumer doesn't sit on `undefined`.
        if (lastStatus && action.propName in lastStatus) {
            emitMessage({ event: 'propValue', args: [action.propName, lastStatus[action.propName]] });
        } else if (action.propName === 'stream') {
            emitMessage({ event: 'propValue', args: ['stream', null] });
        }
    }

    async function handleSetProp(action) {
        // Optimistic UI update: the server's reported state isn't always
        // immediately accurate after a transition. Reflect the user's intent
        // straight away; pollStatus will correct if the device disagrees.
        emitMessage({ event: 'propChanged', args: [action.propName, action.propValue] });
        if (!lastStatus) lastStatus = {};
        lastStatus[action.propName] = action.propValue;

        if (action.propName === 'time') return seekWithRestoreOfPaused(action.propValue);

        // Subtitle prop changes resolve a track id back to a URL or update
        // delay/size, then re-issue the casting server's subtitles command.
        if (isSubtitlePropName(action.propName)) {
            return handleSubtitleSetProp(action);
        }

        const params = {};
        switch (action.propName) {
            case 'paused':
                params.paused = action.propValue ? 'true' : 'false';
                break;
            case 'volume':
                params.volume = String(Math.max(0, Math.min(1, Number(action.propValue) || 0)));
                break;
            case 'selectedAudioTrackId':
                params.audioTrack = String(action.propValue);
                break;
            default:
                return; // unsupported setProp; silently no-op
        }
        try { await callPlayer(params); } catch (_) { /* device may have rejected */ }
        await pollStatus();
    }

    // -----------------------------------------------------------------------
    // subtitles
    // -----------------------------------------------------------------------

    function isSubtitlePropName(name) {
        return name === 'selectedSubtitlesTrackId' ||
            name === 'selectedExtraSubtitlesTrackId' ||
            name === 'subtitlesOffset' ||
            name === 'extraSubtitlesOffset' ||
            name === 'extraSubtitlesDelay' ||
            name === 'subtitlesSize' ||
            name === 'extraSubtitlesSize';
    }

    function findSubtitleUrl(trackId) {
        if (trackId === null || trackId === undefined) return null;
        const all = subtitlesTracks.concat(extraSubtitlesTracks);
        const hit = all.find((t) => t && (t.id === trackId || String(t.id) === String(trackId)));
        return hit && typeof hit.url === 'string' ? hit.url : null;
    }

    async function handleSubtitleSetProp(action) {
        const params = {};
        switch (action.propName) {
            case 'selectedSubtitlesTrackId':
            case 'selectedExtraSubtitlesTrackId': {
                const url = findSubtitleUrl(action.propValue);
                if (url === null) {
                    // Disabling subtitles. The casting middleware needs at
                    // least one of subtitlesSrc/Delay/Size to invoke the
                    // subtitles handler — pass an empty src.
                    params.subtitlesSrc = '';
                } else {
                    params.subtitlesSrc = url;
                }
                if (subtitlesOffset) params.subtitlesDelay = String(subtitlesOffset);
                if (subtitlesSize !== null) params.subtitlesSize = String(subtitlesSize);
                break;
            }
            case 'subtitlesOffset':
            case 'extraSubtitlesOffset':
            case 'extraSubtitlesDelay':
                subtitlesOffset = Number(action.propValue) || 0;
                params.subtitlesDelay = String(subtitlesOffset);
                break;
            case 'subtitlesSize':
            case 'extraSubtitlesSize':
                subtitlesSize = Number(action.propValue);
                if (isFinite(subtitlesSize)) params.subtitlesSize = String(subtitlesSize);
                break;
            default:
                return;
        }
        try { await callPlayer(params); } catch (_) { /* device may have rejected */ }
        await pollStatus();
    }

    // The streaming server's seek() is a no-op when state !== PLAYING. If the
    // user drags the seek bar while paused we briefly resume, seek, wait for
    // the device to stabilize past the seek-induced re-buffer, then re-pause.
    async function seekWithRestoreOfPaused(timeMs) {
        const before = await callPlayer({}).catch(() => null);
        const wasPaused = before ? before.paused === true : false;

        if (wasPaused) {
            await callPlayer({ paused: 'false' }).catch(() => {});
            await waitForReady(5000);
        }
        await callPlayer({ time: String(Math.round(Number(timeMs) || 0)) }).catch(() => {});
        if (wasPaused) {
            // Seek triggers a fresh LOAD on the device. PAUSE during the
            // ensuing BUFFERING is sometimes dropped, so wait for state to
            // stabilize and verify.
            await waitForReady(8000);
            await new Promise((r) => setTimeout(r, 800));
            await callPlayer({ paused: 'true' }).catch(() => {});
            await new Promise((r) => setTimeout(r, 1500));
            const after = await callPlayer({}).catch(() => null);
            if (after && after.paused === false) {
                await callPlayer({ paused: 'true' }).catch(() => {});
            }
        }
        await pollStatus();
    }

    async function handleCommand(action) {
        switch (action.commandName) {
            case 'load': return handleLoad(action.commandArgs || {});
            case 'unload':
                try { await callPlayer({ source: '' }); } catch (_) { /* idempotent */ }
                return;
            case 'destroy':
                try { await callPlayer({ stop: '1' }); } catch (_) { /* idempotent */ }
                stopStatusPolling();
                return;
            case 'addExtraSubtitlesTracks': {
                const tracks = action.commandArgs && Array.isArray(action.commandArgs.tracks)
                    ? action.commandArgs.tracks : [];
                extraSubtitlesTracks = extraSubtitlesTracks.concat(tracks);
                emitMessage({ event: 'propChanged', args: ['extraSubtitlesTracks', extraSubtitlesTracks] });
                emitMessage({ event: 'extraSubtitlesTrackAdded', args: [tracks] });
                return;
            }
            default:
                return;
        }
    }

    async function handleLoad(args) {
        // Adopt the streamingServerURL from the first load so subsequent
        // fetches address the same origin. Empty stays empty (= page origin),
        // which is the right default when the shell proxies / to the server.
        if (typeof args.streamingServerURL === 'string' && args.streamingServerURL.length > 0) {
            streamingServerBase = args.streamingServerURL.replace(/\/+$/, '');
        }

        let playUrl = await resolveStreamUrl(args.stream, args.seriesInfo);
        // Strip a trailing empty `?` — ffmpeg can probe through it but some
        // receiver implementations choke on it.
        if (playUrl.endsWith('?')) playUrl = playUrl.slice(0, -1);

        // Make sure status polling is alive; a previous `destroy` (called
        // when the player closed) stops it, and re-opening a movie does not
        // go through requestSession again.
        startStatusPolling();
        // Clear stale cached state so the first poll after a fresh load
        // emits the new values rather than diffing against the prior session.
        lastStatus = null;
        // Reset subtitle state to whatever this stream advertises; consumers
        // will append to extraSubtitlesTracks via addExtraSubtitlesTracks.
        subtitlesTracks = (args.stream && Array.isArray(args.stream.subtitles)) ? args.stream.subtitles : [];
        extraSubtitlesTracks = [];
        subtitlesOffset = 0;
        subtitlesSize = null;

        // Send source on its own. The server's player middleware composes a
        // single `method` from the params and `source` wins over `time` when
        // both are set, so a combined call would silently drop the resume
        // position.
        await callPlayer({ source: playUrl });

        // Tell the React side which manifest is active. Without this,
        // useVideo never dispatches observeProp for any prop, so our pollStatus
        // and optimistic propChanged emits land on a consumer that has no
        // expected props registered.
        emitMessage({ event: 'implementationChanged', args: [MANIFEST] });
        emitMessage({ event: 'propChanged', args: ['loaded', true] });
        emitMessage({ event: 'propChanged', args: ['stream', args.stream] });

        if (typeof args.time === 'number' && args.time > 0) {
            await seekToResumePosition(Math.round(args.time));
        }
        if (args.autoplay === false) {
            try { await callPlayer({ paused: 'true' }); } catch (_) {}
        }
        await pollStatus();
    }

    // The server's play() schedules a deferred playFromStatus 4 seconds after
    // ffprobe completes, which resets seekTime to 0. Wait past it before
    // seeking, then verify and retry once if the seek didn't land. Each seek
    // triggers a LOAD on the device, so hammering it makes things worse.
    async function seekToResumePosition(seekTimeMs) {
        await waitForReady(READY_TIMEOUT_MS);
        await new Promise((r) => setTimeout(r, SAFE_SEEK_DELAY_MS));
        try { await callPlayer({ time: String(seekTimeMs) }); } catch (_) {}

        // Verify; the server reports mediaStatus.time as whatever was last
        // set via query params, so we can only detect a clearly-failed seek
        // (status.time well below the target).
        await new Promise((r) => setTimeout(r, 2500));
        try {
            const status = await callPlayer({});
            if (status && typeof status.time === 'number' && status.time < seekTimeMs - 5000) {
                await callPlayer({ time: String(seekTimeMs) }).catch(() => {});
            }
        } catch (_) {}
    }

    // start polling the streaming server for devices immediately
    startDevicesPolling();
}

ShellChromecastTransport.CAST_STATE = CAST_STATE;
ShellChromecastTransport.SESSION_STATE = SESSION_STATE;

module.exports = ShellChromecastTransport;
