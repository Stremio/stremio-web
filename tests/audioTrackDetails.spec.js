// Copyright (C) 2017-2026 Smart code 203358507

const { getAudioFormatLabel, getAudioTrackDetails } = require('../src/routes/Player/AudioMenu/audioTrackDetails');

const format = (codec, { profile = null, channels = null, channelCount = null } = {}) => ({
    codec,
    profile,
    channels,
    channelCount,
});

const FRENCH = ['fre', 'French', 'Français'];
const ENGLISH = ['eng', 'English', 'English'];

describe('getAudioFormatLabel', () => {
    it('returns null without a codec', () => {
        expect(getAudioFormatLabel(undefined)).toBe(null);
        expect(getAudioFormatLabel(null)).toBe(null);
        expect(getAudioFormatLabel({ codec: '', profile: null, channels: null, channelCount: 2 })).toBe(null);
    });

    it('names Dolby codecs and derives channels from the count', () => {
        expect(getAudioFormatLabel(format('ac3', { channelCount: 2 }))).toBe('Dolby Digital 2.0');
        expect(getAudioFormatLabel(format('eac3', { channelCount: 6 }))).toBe('Dolby Digital Plus 5.1');
        expect(getAudioFormatLabel(format('truehd', { channelCount: 8 }))).toBe('Dolby TrueHD 7.1');
    });

    it('adds Atmos from the profile', () => {
        expect(getAudioFormatLabel(format('eac3', { profile: 'Dolby Digital Plus + Dolby Atmos', channels: '5.1', channelCount: 6 })))
            .toBe('Dolby Digital Plus Atmos 5.1');
        expect(getAudioFormatLabel(format('truehd', { profile: 'Dolby TrueHD + Dolby Atmos', channels: '7.1', channelCount: 8 })))
            .toBe('Dolby TrueHD Atmos 7.1');
    });

    it('uses DTS profiles', () => {
        expect(getAudioFormatLabel(format('dts', { channelCount: 6 }))).toBe('DTS 5.1');
        expect(getAudioFormatLabel(format('dts', { profile: 'DTS', channelCount: 6 }))).toBe('DTS 5.1');
        expect(getAudioFormatLabel(format('dts', { profile: 'DTS-HD MA', channelCount: 8 }))).toBe('DTS-HD MA 7.1');
        expect(getAudioFormatLabel(format('dts', { profile: 'DTS-HD MA + DTS:X', channelCount: 8 }))).toBe('DTS:X 7.1');
    });

    it('names AAC variants and other codecs', () => {
        expect(getAudioFormatLabel(format('aac', { profile: 'LC', channels: '2.0', channelCount: 2 }))).toBe('AAC 2.0');
        expect(getAudioFormatLabel(format('aac', { profile: 'HE-AAC', channelCount: 2 }))).toBe('HE-AAC 2.0');
        expect(getAudioFormatLabel(format('opus', { channelCount: 2 }))).toBe('Opus 2.0');
        expect(getAudioFormatLabel(format('flac', { channelCount: 8 }))).toBe('FLAC 7.1');
        expect(getAudioFormatLabel(format('pcm', { channelCount: 2 }))).toBe('PCM 2.0');
        expect(getAudioFormatLabel(format('wmapro', { channelCount: 3 }))).toBe('WMAPRO 3ch');
    });

    it('prefers the layout over the count', () => {
        expect(getAudioFormatLabel(format('aac', { channels: '1.0', channelCount: 1 }))).toBe('AAC 1.0');
        expect(getAudioFormatLabel(format('ac3', { channels: '5.0', channelCount: 5 }))).toBe('Dolby Digital 5.0');
        expect(getAudioFormatLabel(format('truehd', { channels: '5.1.2', channelCount: 8 }))).toBe('Dolby TrueHD 5.1.2');
    });

    it('works without profile and channels', () => {
        expect(getAudioFormatLabel(format('eac3', { channelCount: 6 }))).toBe('Dolby Digital Plus 5.1');
        expect(getAudioFormatLabel(format('flac'))).toBe('FLAC');
    });
});

describe('getAudioTrackDetails', () => {
    it('keeps the title unchanged when there is no format (browser, TV players)', () => {
        expect(getAudioTrackDetails({ label: 'French', format: undefined }, FRENCH)).toBe('French');
        expect(getAudioTrackDetails({ label: '', format: null }, FRENCH)).toBe('');
    });

    it('shows the format when there is no title', () => {
        expect(getAudioTrackDetails({ label: '', format: format('opus', { channelCount: 2 }) }, ENGLISH))
            .toBe('Opus 2.0');
    });

    it('hides a title that only repeats the language', () => {
        expect(getAudioTrackDetails({ label: 'French', format: format('ac3', { channelCount: 2 }) }, FRENCH))
            .toBe('Dolby Digital 2.0');
        expect(getAudioTrackDetails({ label: 'english', format: format('ac3', { channelCount: 2 }) }, ENGLISH))
            .toBe('Dolby Digital 2.0');
    });

    it('shows only the title when it already describes the format', () => {
        expect(getAudioTrackDetails({ label: 'DTS-HD MA 5.1', format: format('dts', { channelCount: 6 }) }, ENGLISH))
            .toBe('DTS-HD MA 5.1');
        expect(getAudioTrackDetails({ label: 'TrueHD 7.1 Atmos', format: format('truehd', { channels: '7.1', channelCount: 8 }) }, ENGLISH))
            .toBe('TrueHD 7.1 Atmos');
        expect(getAudioTrackDetails({ label: 'DD 5.1', format: format('ac3', { channels: '5.1', channelCount: 6 }) }, ENGLISH))
            .toBe('DD 5.1');
        expect(getAudioTrackDetails({ label: 'AAC Stereo', format: format('aac', { channelCount: 2 }) }, ENGLISH))
            .toBe('AAC Stereo');
    });

    it('shows title and format when the title names a different format', () => {
        expect(getAudioTrackDetails({ label: 'English DTS-HD MA 7.1', format: format('truehd', { channelCount: 6 }) }, ENGLISH))
            .toBe('English DTS-HD MA 7.1 · Dolby TrueHD 5.1');
        expect(getAudioTrackDetails({ label: 'DD+ 5.1', format: format('ac3', { channelCount: 6 }) }, ENGLISH))
            .toBe('DD+ 5.1 · Dolby Digital 5.1');
        expect(getAudioTrackDetails({ label: 'DTS 7.1', format: format('dts', { channelCount: 6 }) }, ENGLISH))
            .toBe('DTS 7.1 · DTS 5.1');
    });

    it('keeps other titles next to the format', () => {
        expect(getAudioTrackDetails({ label: 'Commentary', format: format('aac', { channelCount: 2 }) }, ENGLISH))
            .toBe('Commentary · AAC 2.0');
        expect(getAudioTrackDetails({ label: 'VFF AD', format: format('eac3', { channelCount: 6 }) }, FRENCH))
            .toBe('VFF AD · Dolby Digital Plus 5.1');
        expect(getAudioTrackDetails({ label: 'Movie Dubbing', format: format('eac3', { channelCount: 6 }) }, ['rus', 'Russian', 'Русский']))
            .toBe('Movie Dubbing · Dolby Digital Plus 5.1');
    });
});
