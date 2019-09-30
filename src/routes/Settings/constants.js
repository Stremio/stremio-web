const settingsSections = {
    'General': [
        { 'section': 'General', 'type': 'user' },
        { 'section': 'General', 'header': 'UI Language', 'label': 'UI Language', 'type': 'select', 'options': [{ 'label': 'Български език', 'value': 'bul' }, { 'label': 'English', 'value': 'eng' }, { 'label': 'Deutsch', 'value': 'ger' }, { 'label': 'Español', 'value': 'esp' }, { 'label': 'Italiano', 'value': 'ita' }], 'id': 'ui_language' },
    ],
    'Player': [
        { 'section': 'Player', 'label': 'ADD-ONS', 'type': 'button', 'icon': 'ic_addons', 'id': 'add-ons', 'href': '#/addons' },
        { 'section': 'Player', 'header': 'Default Subtitles Language', 'label': 'Default Subtitles Language', 'type': 'select', 'options': [{ 'label': 'Български език', 'value': 'bul' }, { 'label': 'English', 'value': 'eng' }, { 'label': 'Deutsch', 'value': 'ger' }, { 'label': 'Español', 'value': 'esp' }, { 'label': 'Italiano', 'value': 'ita' }], 'id': 'default_subtitles_language' },
        { 'section': 'Player', 'header': 'Default Subtitles Size', 'label': 'Default Subtitles Size', 'type': 'select', 'options': [{ 'label': '72%', 'value': '72%' }, { 'label': '80%', 'value': '80%' }, { 'label': '100%', 'value': '100%' }, { 'label': '120%', 'value': '120%' }, { 'label': '140%', 'value': '140%' }, { 'label': '160%', 'value': '160%' }, { 'label': '180%', 'value': '180%' }], 'id': 'default_subtitles_size' },
        { 'section': 'Player', 'header': 'Subtitles Background', 'label': 'Subtitles background', 'type': 'select', 'options': [{ 'label': 'None', 'value': '' }, { 'label': 'Solid', 'value': 'solid' }, { 'label': 'Transparent', 'value': 'transparent' }], 'id': 'subtitles_background' },
        { 'section': 'Player', 'header': 'Subtitles color', 'label': 'Subtitles color', 'type': 'color', 'color': '#FFFFFF', 'id': 'subtitles_color' },
        { 'section': 'Player', 'header': 'Subtitles outline color', 'label': 'Subtitles outline color', 'type': 'color', 'color': '#000000', 'id': 'subtitles_outline_color' },
        { 'section': 'Player', 'label': 'Auto-play next episode', 'type': 'checkbox', 'id': 'auto-play_next_episode' },
        { 'section': 'Player', 'label': 'Pause playback when minimized', 'type': 'checkbox', 'id': 'pause_playback_when_minimized' },
        { 'section': 'Player', 'label': 'Hardware-accelerated decoding', 'type': 'checkbox', 'id': 'hardware-accelerated_decoding' },
        { 'section': 'Player', 'label': 'Launch player in a separate window (advanced)', 'type': 'checkbox', 'id': 'launch_player_in_a_separate_window_(advanced)' },
    ],
    'Streaming': [
        { 'section': 'Streaming', 'header': 'Caching', 'label': 'Caching', 'type': 'select', 'options': [{ 'label': 'No Caching', 'value': '' }, { 'label': '2GB', 'value': '2048' }, { 'label': '5GB', 'value': '5120' }, { 'label': '10GB', 'value': '10240' }], 'id': 'caching' },
        { 'section': 'Streaming', 'header': 'Torrent Profile', 'label': 'Torrent Profile', 'type': 'select', 'options': [{ 'label': 'Default', 'value': 'profile-default' }, { 'label': 'Soft', 'value': 'profile-soft' }, { 'label': 'Fast', 'value': 'profile-fast' }], 'id': 'torrent_profile' },
        { 'section': 'Streaming', 'header': 'Streaming server URL: http://127.0.0.1:11470', 'label': 'Streaming server is available.', 'type': 'static-text', 'icon': 'ic_check', 'id': 'streaming_server_is_available.' }
    ]
};

const useSettings = {
    settingsSections
}

module.exports = useSettings;