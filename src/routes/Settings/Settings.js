const React = require('react');
const classnames = require('classnames');
const { TextInput, Button, Dropdown, Checkbox, NavBar } = require('stremio/common');
const Icon = require('stremio-icons/dom/Icon');
const styles = require('./styles');

const settingsData = [
    { section: 'General', label: 'Username', type: 'user', avatar: '', email: '' },
    { section: 'General', label: 'LOG OUT', type: 'button' },
    { section: 'General', label: 'Change password', type: 'link', href: '' },
    { section: 'General', label: 'Import options', type: 'static-text' },
    { section: 'General', label: 'Import from Facebook', type: 'link', href: '' },
    { section: 'General', label: 'Export user data', type: 'link', href: '' },
    { section: 'General', label: 'Subscribe to calendar', type: 'link', href: '' },
    { section: 'General', label: 'Contact support', type: 'link', href: 'https://stremio.zendesk.com/' },
    { section: 'General', label: 'Request account deletion', type: 'link', href: 'https://docs.google.com/forms/d/e/1FAIpQLScubrlTpDMIPUUBlhZ5lwcXl3HxzKfunIMCX5Jnp-cDyglWjQ/viewform?usp=sf_link' },
    { section: 'General', header: 'Trakt Scrobbling', label: 'AUTHENTICATE', type: 'button', icon: 'ic_trackt' },
    { section: 'General', header: 'UI Language', label: 'UI Language', type: 'select', options: ['Български език', 'English', 'Deutsch', 'Español', 'Italiano'], value: 'English' },
    { section: 'Player', label: 'ADD-ONS', type: 'button', icon: 'ic_addons' },
    { section: 'Player', header: 'Default Subtitles Language', label: 'Default Subtitles Language', type: 'select', options: ['English', 'Nederlands', 'Avesta', 'Български език', 'Deutsch', 'Español', 'Italiano'], value: 'English' },
    { section: 'Player', header: 'Default Subtitles Size', label: 'Default Subtitles Size', type: 'select', options: ['72%', '80%', '100%', '120%', '140%', '160%', '180%'], value: '100%' },
    { section: 'Player', header: 'Subtitles Background', label: 'Subtitles background', type: 'select', options: ['None', 'Solid', 'Transparent'], value: 'None' },
    { section: 'Player', header: 'Subtitles color', label: 'Subtitles color', type: 'color', color: '#FFFFFF' },
    { section: 'Player', header: 'Subtitles outline color', label: 'Subtitles outline color', type: 'color', color: '#000000' },
    { section: 'Player', label: 'Auto-play next episode', type: 'checkbox', value: true },
    { section: 'Player', label: 'Pause playback when minimized', type: 'checkbox', value: false },
    { section: 'Player', label: 'Hardware-accelerated decoding', type: 'checkbox', value: true },
    { section: 'Player', label: 'Launch player in a separate window (advanced)', type: 'checkbox', value: true },
    { section: 'Streaming', header: 'Caching', label: 'Caching', type: 'select', options: ['No Caching', '2GB', '5GB', '10GB'], value: '2GB' },
    { section: 'Streaming', header: 'Torrent Profile', label: 'Torrent Profile', type: 'select', options: ['Default', 'Soft', 'Fast'], value: 'Default' },
    { section: 'Streaming', header: 'Streaming server URL: http://127.0.0.1:11470', label: 'Streaming server is available.', type: 'static-text', icon: 'ic_check' }
];

const SECTIONS_ORDER = {
    'General': 1,
    'Player': 2,
    'Streaming': 3
};

const Settings = () => {
    const [selectedSectionId, setSelectedSectionId] = React.useState(null)
    const [sections, setSections] = React.useState([])
    const [inputs, setInputs] = React.useState([])
    const scrollContainerRef = React.useRef(null)

    React.useEffect(() => {
        const theSections = settingsData.map(({ section }) => section)
            .filter((section, index, sections) => sections.indexOf(section) === index)
            .sort(function(a, b) {
                const valueA = SECTIONS_ORDER[a];
                const valueB = SECTIONS_ORDER[b];
                if (!isNaN(valueA) && !isNaN(valueB)) return valueA - valueB;
                if (!isNaN(valueA)) return -1;
                if (!isNaN(valueB)) return 1;
                return a - b;
            })
            .map((section) => ({
                id: section,
                ref: React.createRef()
            }));
        setSections(theSections);

        if (theSections.length > 0 && (selectedSectionId === null || !theSections.find(({ id }) => id === selectedSectionId))) {
            setSelectedSectionId(theSections[0].id)
        }

        setInputs(settingsData.map((setting) => ({
            ...setting,
            id: setting.label,
            ref: React.createRef(),
            active: !!(inputs.find(({ id }) => id === setting.label) || {}).active
        })))
    }, [])

    /////////////////

    const toggleCheckbox = (id) => {
        setInputs(inputs.map((input) => ({
            ...input,
            value: id === input.id ? !input.value : input.value
        })))
    }

    const updateDropdown = (event) => {
        var data = event.currentTarget.dataset;
        setInputs(inputs.map((input) => ({
            ...input,
            value: data.name === input.id ? data.value : input.value,
        })))
    }

    const changeSection = (event) => {
        const currentSectionId = event.currentTarget.dataset.section;
        const section = sections.find((section) => section.id === currentSectionId);
        setSelectedSectionId(currentSectionId)
        scrollContainerRef.current.scrollTo({
            top: section.ref.current.offsetTop,
            behavior: 'smooth'
        });
    }

    const onScroll = (event) => {
        const current = event.currentTarget
        if (sections.length <= 0) {
            return;
        }

        if (current.scrollTop + current.clientHeight === current.scrollHeight) {
            setSelectedSectionId(sections[sections.length - 1].id);
        } else {
            for (let i = sections.length - 1;i >= 0;i--) {
                if (sections[i].ref.current.offsetTop <= current.scrollTop) {
                    setSelectedSectionId(sections[i].id);
                    break;
                }
            }
        }
    }

    ////////////////

    const renderDropdown = ({ value, id, options, onClick }) => {
        // TODO provide proper data instead of this mapping
        options = options.map(o => ({ value: o, label: o }))
        return (
            <Dropdown options={options} selected={[value]} name={id} key={id} className={styles['dropdown']} onSelect={onClick} />
        );
    }

    return (
        <div className={styles['settings-parent-container']}>
            <NavBar
                className={styles['nav-bar']}
                backButton={true}
                addonsButton={true}
                fullscreenButton={true}
                navMenu={true} />
            <div className={styles['settings-container']}>
                <div className={styles['side-menu']}>
                    {sections.map((section) =>
                        <Button key={section.id} className={classnames(styles['section-label'], { [styles['selected']]: selectedSectionId === section.id })} type={'button'} data-section={section.id} onClick={changeSection}>
                            {section.id}
                        </Button>
                    )}
                </div>
                <div ref={scrollContainerRef} className={styles['scroll-container']} onScroll={onScroll}>
                    {sections.map((section) =>
                        <div key={section.id} ref={section.ref} className={styles['section']} data-section={section.id}>
                            <div className={styles['section-header']}>{section.id}</div>
                            {inputs
                                .filter((input) => input.section === section.id)
                                .map((input) => {
                                    if (input.type === 'user') {
                                        return (
                                            <div key={input.id} className={classnames(styles['input-container'], styles['user-container'])}>
                                                {
                                                    input.email.length === 0
                                                        ?
                                                        <div style={{ backgroundImage: `url('/images/anonymous.png')` }} className={styles['avatar']} />
                                                        :
                                                        <div style={{ backgroundImage: `url('${this.props.avatar}'), url('/images/default_avatar.png')` }} className={styles['avatar']} />
                                                }
                                                <div className={styles['email']}>{input.email.length === 0 ? 'Anonymous user' : input.email}</div>
                                            </div>
                                        );
                                    } else if (input.type === 'select') {
                                        return (
                                            <div key={input.id} className={classnames(styles['input-container'], styles['select-container'])}>
                                                {input.header ? <div className={styles['input-header']}>{input.header}</div> : null}
                                                {renderDropdown({
                                                    active: input.active,
                                                    id: input.id,
                                                    value: input.value,
                                                    options: input.options,
                                                    onClick: updateDropdown
                                                })}
                                            </div>
                                        );
                                    } else if (input.type === 'link') {
                                        return (
                                            <div key={input.id} className={classnames(styles['input-container'], styles['link-container'])}>
                                                {input.header ? <div className={styles['input-header']}>{input.header}</div> : null}
                                                <Button ref={input.ref} className={styles['link']} type={input.type} href={input.href} target={'_blank'}>
                                                    <div className={styles['label']}>{input.label}</div>
                                                </Button>
                                            </div>
                                        );
                                    } else if (input.type === 'button') {
                                        return (
                                            <div key={input.id} className={classnames(styles['input-container'], styles['button-container'])}>
                                                {input.header ? <div className={styles['input-header']}>{input.header}</div> : null}
                                                <Button ref={input.ref} className={styles['button']} type={input.type}>
                                                    {input.icon ? <Icon className={styles['icon']} icon={input.icon} /> : null}
                                                    <div className={styles['label']}>{input.label}</div>
                                                </Button>
                                            </div>
                                        );
                                    } else if (input.type === 'checkbox') {
                                        return (
                                            <div key={input.id} className={classnames(styles['input-container'], styles['checkbox-container'])}>
                                                {input.header ? <div className={styles['input-header']}>{input.header}</div> : null}
                                                <Checkbox ref={input.ref} className={styles['checkbox']} checked={input.value} onClick={toggleCheckbox.bind(null, input.label)}>
                                                    <div className={styles['label']}>{input.label}</div>
                                                </Checkbox>
                                            </div>
                                        );
                                    } else if (input.type === 'static-text') {
                                        return (
                                            <div key={input.id} className={classnames(styles['input-container'], styles['text-container'])}>
                                                {input.header ? <div className={styles['input-header']}>{input.header}</div> : null}
                                                <div className={styles['text']}>
                                                    {input.icon ? <Icon className={styles[input.icon === 'ic_x' ? 'x-icon' : 'icon']} icon={input.icon} /> : null}
                                                    <div className={styles['label']}>{input.label}</div>
                                                </div>
                                            </div>
                                        );
                                    } else if (input.type === 'color') {
                                        return (
                                            <div key={input.id} className={classnames(styles['input-container'], styles['color-container'])}>
                                                {input.header ? <div className={styles['input-header']}>{input.header}</div> : null}
                                                <TextInput className={styles['color-picker']} type={input.type} defaultValue={input.color} tabIndex={'-1'} />
                                            </div>
                                        );
                                    }
                                })}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

module.exports = Settings;
