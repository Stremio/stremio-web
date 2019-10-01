const React = require('react');

module.exports = (devTestWithUser) => React.useState({
    "user": devTestWithUser ? {
        "_id": "neo",
        "email": "neo@example.com",
        "avatar": "https://www.thenational.ae/image/policy:1.891803:1566372420/AC17-Matrix-20-04.jpg?f=16x9&w=1200&$p$f$w=5867e40",
    } : null,
    "ui_language": "eng",
    "default_subtitles_language": "bul",
    "default_subtitles_size": "100%",
    "subtitles_background": "",
    "subtitles_color": "#ffffff",
    "subtitles_outline_color": "#000",
    "auto-play_next_episode": true,
    "pause_playback_when_minimized": false,
    "hardware-accelerated_decoding": true,
    "launch_player_in_a_separate_window_(advanced)": true,
    "caching": "2048",
    "torrent_profile": "profile-default",
    "streaming_server_is_available.": true,
});