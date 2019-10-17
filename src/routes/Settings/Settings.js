const React = require('react');
const { NavBar } = require('stremio/common');
const styles = require('./styles');
const SectionsSelector = require('./SectionsSelector');
const SectionsList = require('./SectionsList');
const { settingsSections } = require('./constants');
const useSettings = require('./useSettings');

const Settings = () => {
    const [preferences, setPreferences] = useSettings();
    const [dynamicSections, setDynamicSections] = React.useState(settingsSections);
    // TODO: The Streaming section should be handled separately
    const sections = React.useMemo(()=>Object.keys(dynamicSections)
        .map((section) => ({
            id: section,
            inputs: dynamicSections[section],
            ref: React.createRef()
        })), [dynamicSections]);

    const [selectedSectionId, setSelectedSectionId] = React.useState(sections[0].id);
    const scrollContainerRef = React.useRef(null);

    const updatePreference = (option, value) => {
        setPreferences({ ...preferences, [option]: value });
    }

    const changeSection = React.useCallback((event) => {
        const currentSectionId = event.currentTarget.dataset.section;
        const section = sections.find((section) => section.id === currentSectionId);
        //setSelectedSectionId(currentSectionId);
        scrollContainerRef.current.scrollTo({
            top: section.ref.current.offsetTop,
            behavior: 'smooth'
        });
    }, [sections]);

    const sectionListOnScorll = React.useCallback((event) => {
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
    }, [sections]);

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
                <SectionsList ref={scrollContainerRef} className={styles['scroll-container']} sections={sections} preferences={preferences} onPreferenceChanged={updatePreference} onScroll={sectionListOnScorll} />
            </div>
        </div>
    );
};

module.exports = Settings;
