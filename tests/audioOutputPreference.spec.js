const {
    fingerprintStream,
    readRememberedStereoDownmix,
    rememberStereoDownmix,
} = require('../src/routes/Player/audioOutputPreference');

const createStorage = () => {
    const values = new Map();
    return {
        getItem: (key) => values.get(key) || null,
        setItem: (key, value) => values.set(key, value),
    };
};

describe('audio output preference', () => {
    test('remembers both enabled and disabled overrides independently', () => {
        const storage = createStorage();

        rememberStereoDownmix('stream-a', true, storage);
        rememberStereoDownmix('stream-b', false, storage);

        expect(readRememberedStereoDownmix('stream-a', storage)).toBe(true);
        expect(readRememberedStereoDownmix('stream-b', storage)).toBe(false);
        expect(readRememberedStereoDownmix('stream-c', storage)).toBeNull();
    });

    test('creates a stable and distinct fingerprint for stream identities', async () => {
        const stream = {
            name: 'Example 1080p',
            infoHash: '0123456789abcdef',
            fileIdx: 0,
        };

        const fingerprint = await fingerprintStream(stream);
        const sameFingerprint = await fingerprintStream({ ...stream });
        const differentFingerprint = await fingerprintStream({ ...stream, fileIdx: 1 });

        expect(fingerprint).toMatch(/^[0-9a-f]{64}$/);
        expect(sameFingerprint).toBe(fingerprint);
        expect(differentFingerprint).not.toBe(fingerprint);
    });
});
