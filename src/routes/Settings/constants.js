const settingsSections = {
    'General': [
        { 'id': 'user', 'type': 'user' },
        { 'id': 'language', 'header': 'UI Language', 'label': 'UI Language', 'type': 'select', 'options': [{ 'label': 'Български език', 'value': 'bul' }, { 'label': 'English', 'value': 'eng' }, { 'label': 'Deutsch', 'value': 'ger' }, { 'label': 'Español', 'value': 'esp' }, { 'label': 'Italiano', 'value': 'ita' }] },
        { 'id': 'show_vid_overview', 'label': 'Show videos overview', 'type': 'checkbox' },
    ],
    'Player': [
        { 'id': 'add-ons', 'label': 'ADD-ONS', 'type': 'button', 'icon': 'ic_addons', 'href': '#/addons' },
        { 'id': 'subtitles_language', 'header': 'Default Subtitles Language', 'label': 'Default Subtitles Language', 'type': 'select', 'options': [{ 'label': 'Български език', 'value': 'bul' }, { 'label': 'English', 'value': 'eng' }, { 'label': 'Deutsch', 'value': 'ger' }, { 'label': 'Español', 'value': 'esp' }, { 'label': 'Italiano', 'value': 'ita' }] },
        { 'id': 'subtitles_size', 'header': 'Default Subtitles Size', 'label': 'Default Subtitles Size', 'type': 'select', 'options': [{ 'label': '72%', 'value': '72%' }, { 'label': '80%', 'value': '80%' }, { 'label': '100%', 'value': '100%' }, { 'label': '120%', 'value': '120%' }, { 'label': '140%', 'value': '140%' }, { 'label': '160%', 'value': '160%' }, { 'label': '180%', 'value': '180%' }] },
        { 'id': 'subtitles_background', 'header': 'Subtitles Background', 'label': 'Subtitles background', 'type': 'select', 'options': [{ 'label': 'None', 'value': '' }, { 'label': 'Solid', 'value': 'solid' }, { 'label': 'Transparent', 'value': 'transparent' }] },
        { 'id': 'subtitles_color', 'header': 'Subtitles color', 'label': 'Subtitles color', 'type': 'color' },
        { 'id': 'subtitles_outline_color', 'header': 'Subtitles outline color', 'label': 'Subtitles outline color', 'type': 'color' },
        { 'id': 'autoplay_next_vid', 'label': 'Auto-play next episode', 'type': 'checkbox' },
        { 'id': 'pause_on_lost_focus', 'label': 'Pause playback when not in focus', 'type': 'checkbox' },
        { 'id': 'hardware-accelerated_decoding', 'label': 'Hardware-accelerated decoding', 'type': 'checkbox' },
        { 'id': 'use_external_player', 'label': 'Launch player in a separate window (advanced)', 'type': 'checkbox' },
    ],
    'Streaming': [
    ]
};

module.exports = {
    settingsSections,
};
