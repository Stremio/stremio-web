// Copyright (C) 2017-2026 Smart code 203358507

// Builds the second line of an audio menu entry from the track title and the
// audio format reported by the player (currently only the shell / mpv provides one).

const CODEC_NAMES = {
    aac: 'AAC',
    ac3: 'Dolby Digital',
    eac3: 'Dolby Digital Plus',
    truehd: 'Dolby TrueHD',
    mlp: 'MLP',
    dts: 'DTS',
    flac: 'FLAC',
    alac: 'ALAC',
    opus: 'Opus',
    vorbis: 'Vorbis',
    mp3: 'MP3',
    mp2: 'MP2',
    pcm: 'PCM',
};

const CHANNELS_BY_COUNT = {
    1: '1.0',
    2: '2.0',
    6: '5.1',
    8: '7.1',
};

// Ways a codec is written in track titles, most specific codec first
// ("Dolby Digital Plus" must win over "Dolby Digital").
const CODEC_ALIASES = [
    ['eac3', ['dolby digital plus', 'e-ac-3', 'e-ac3', 'eac3', 'ddp', 'dd+']],
    ['truehd', ['dolby truehd', 'truehd', 'true-hd', 'true hd']],
    ['ac3', ['dolby digital', 'ac-3', 'ac3', 'dd']],
    ['dts', ['dts']],
    ['aac', ['aac']],
    ['flac', ['flac']],
    ['opus', ['opus']],
    ['mp3', ['mp3']],
    ['vorbis', ['vorbis']],
    ['pcm', ['lpcm', 'pcm']],
];

const CHANNEL_ALIASES = {
    '1.0': ['mono'],
    '2.0': ['stereo'],
};

const escapeRegExp = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

// Whole-word match, so "dd" does not match inside "ddp" and "5.1" not inside "15.1".
const containsWord = (text, word) => {
    return new RegExp(`(^|[^a-z0-9])${escapeRegExp(word)}($|[^a-z0-9])`).test(text);
};

const getCodecName = (format) => {
    const codec = format.codec;
    const profile = typeof format.profile === 'string' ? format.profile : '';

    if (codec === 'dts') {
        // FFmpeg profiles: DTS, DTS-ES, DTS 96/24, DTS-HD HRA, DTS-HD MA, DTS Express, DTS-HD MA + DTS:X
        if (/DTS:X/i.test(profile)) return 'DTS:X';
        return profile.length > 0 ? profile : 'DTS';
    }

    if (codec === 'aac' && /^HE-AAC/i.test(profile)) {
        return profile;
    }

    const name = CODEC_NAMES[codec] ?? codec.toUpperCase();
    return /atmos/i.test(profile) ? `${name} Atmos` : name;
};

const getChannels = (format) => {
    if (typeof format.channels === 'string') {
        return format.channels;
    }

    if (typeof format.channelCount === 'number' && format.channelCount > 0) {
        return CHANNELS_BY_COUNT[format.channelCount] ?? `${format.channelCount}ch`;
    }

    return null;
};

// "Dolby Digital Plus Atmos 5.1", "AAC 2.0", ... or null without a known codec.
const getAudioFormatLabel = (format) => {
    if (!format || typeof format.codec !== 'string' || format.codec.length === 0) {
        return null;
    }

    return [getCodecName(format), getChannels(format)]
        .filter((part) => typeof part === 'string')
        .join(' ');
};

const getMentionedCodec = (title) => {
    const entry = CODEC_ALIASES.find(([, aliases]) => aliases.some((alias) => containsWord(title, alias)));
    return entry ? entry[0] : null;
};

// True when the title already names the detected codec and channels ("DTS-HD MA 5.1", "DD 5.1").
// A title naming a different codec ("DTS-HD MA 7.1" on a TrueHD track) is not a description of it.
const titleDescribesFormat = (title, format) => {
    const text = title.toLowerCase();
    if (getMentionedCodec(text) !== format.codec) {
        return false;
    }

    const channels = getChannels(format);
    if (channels === null) {
        return true;
    }

    return [channels, ...(CHANNEL_ALIASES[channels] ?? [])].some((alias) => containsWord(text, alias));
};

const isLanguageName = (title, languageNames) => {
    const text = title.toLowerCase();
    return languageNames.some((name) => typeof name === 'string' && name.trim().toLowerCase() === text);
};

// Second line of an audio menu entry.
// - no format (browser, TV players): the title as before
// - title only repeats the language ("French"): the format only
// - title already describes the format ("DTS-HD MA 5.1"): the title only
// - any other title ("Commentary", "VFF AD", a wrong format): "title · format"
const getAudioTrackDetails = ({ label, format }, languageNames = []) => {
    const title = typeof label === 'string' ? label.trim() : '';
    const formatLabel = getAudioFormatLabel(format);

    if (formatLabel === null) {
        return title;
    }

    const visibleTitle = title.length > 0 && !isLanguageName(title, languageNames) ? title : '';
    if (visibleTitle.length > 0 && titleDescribesFormat(visibleTitle, format)) {
        return visibleTitle;
    }

    return [visibleTitle, formatLabel]
        .filter((part) => part.length > 0)
        .join(' · ');
};

module.exports = {
    getAudioFormatLabel,
    getAudioTrackDetails,
};
