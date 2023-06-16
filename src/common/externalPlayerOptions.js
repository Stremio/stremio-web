// Copyright (C) 2017-2023 Smart code 203358507

const platform = require('./platform');

let options = [{ label: 'EXTERNAL_PLAYER_DISABLED', value: 'internal' }];

if (platform.name === 'ios') {
    options = options.concat([
        { label: 'VLC', value: 'vlc' },
        { label: 'Outplayer', value: 'outplayer' }
    ]);
} else if (platform.name === 'android') {
    options = options.concat([
        { label: 'EXTERNAL_PLAYER_ALLOW_CHOOSING', value: 'choose' },
        { label: 'VLC', value: 'vlc' },
        { label: 'Just Player', value: 'justplayer' },
        { label: 'MX Player', value: 'mxplayer' }
    ]);
} else if (['windows', 'macos', 'linux'].includes(platform.name)) {
    options = options.concat([
        { label: 'VLC', value: 'vlc' }
    ]);
} else {
    options = options.concat([
        { label: 'M3U Playlist', value: 'm3u' }
    ]);
}

module.exports = options;
