const React = require('react');
const { NavBar } = require('stremio/common');
const styles = require('./styles');
const SectionsSelector = require('./SectionsSelector');
const SectionsList = require('./SectionsList');
const { settingsSections } = require('./constants');

const devTestWithUser = true;

const settingsValues = {
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
};

const Settings = () => {
    const sections = Object.keys(settingsSections)
        .map((section) => ({
            id: section,
            inputs: settingsSections[section],
            ref: React.useRef(null)
        }));
    const [selectedSectionId, setSelectedSectionId] = React.useState(sections[0].id);
    const [preferences, setPreferences] = React.useState(settingsValues);
    const scrollContainerRef = React.useRef(null);

    /////////////////

    const updatePreference = (option, value) => {
        const newPrefs = { ...preferences };
        newPrefs[option] = value;
        setPreferences(newPrefs);
    }

    const changeSection = React.useCallback((event) => {
        const currentSectionId = event.currentTarget.dataset.section;
        const section = sections.find((section) => section.id === currentSectionId);
        //setSelectedSectionId(currentSectionId);
        scrollContainerRef.current.scrollTo({
            top: section.ref.current.offsetTop,
            behavior: 'smooth'
        });
    });
    const updateSection = React.useCallback((event) => {
        const scrollContainer = event.currentTarget;
        if (scrollContainer.scrollTop + scrollContainer.clientHeight === scrollContainer.scrollHeight) {
            setSelectedSectionId(sections[sections.length - 1].id);
        } else {
            for (let i = sections.length - 1;i >= 0;i--) {
                if (sections[i].ref.current.offsetTop <= scrollContainer.scrollTop) {
                    setSelectedSectionId(sections[i].id);
                    break;
                }
            }
        }
    });

    return (
        <div className={styles['settings-parent-container']}>
            <NavBar
                className={styles['nav-bar']}
                backButton={true}
                addonsButton={true}
                fullscreenButton={true}
                navMenu={true} />
            <div className={styles['settings-container']}>
                <SectionsSelector className={styles['side-menu']} sections={sections} selectedSectionId={selectedSectionId} onSelectedSection={changeSection} />
                <SectionsList ref={scrollContainerRef} className={styles['scroll-container']} sections={sections} preferences={preferences} onPreferenceChanged={updatePreference} onScroll={updateSection} />
            </div>
        </div>
    );
};

module.exports = Settings;
