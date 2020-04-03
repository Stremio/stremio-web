const React = require('react');
const PropTypes = require('prop-types');
const classnames = require('classnames');
const { Button, CONSTANTS, comparatorWithPriorities, languageNames } = require('stremio/common');
const DiscreteSelectInput = require('./DiscreteSelectInput');
const styles = require('./styles');

const ORIGIN_PRIORITIES = {
    'EMBEDDED IN VIDEO': 1,
    'EMBEDDED IN STREAM': 2
};
const LANGUAGE_PRIORITIES = {
    'eng': 1
};

const SubtitlesMenu = (props) => {
    const languages = React.useMemo(() => {
        return Array.isArray(props.tracks) ?
            props.tracks
                .reduce((languages, { lang }) => {
                    if (!languages.includes(lang)) {
                        languages.push(lang);
                    }

                    return languages;
                }, [])
                .sort(comparatorWithPriorities(LANGUAGE_PRIORITIES))
            :
            [];
    }, [props.tracks]);
    const selectedLanguage = React.useMemo(() => {
        return Array.isArray(props.tracks) ?
            props.tracks.reduce((selectedLanguage, { id, lang }) => {
                if (id === props.selectedTrackId) {
                    return lang;
                }

                return selectedLanguage;
            }, null)
            :
            null;
    }, [props.tracks, props.selectedTrackId]);
    const tracksForLanguage = React.useMemo(() => {
        return Array.isArray(props.tracks) ?
            props.tracks
                .filter(({ lang }) => {
                    return lang === selectedLanguage;
                })
                .sort((t1, t2) => comparatorWithPriorities(ORIGIN_PRIORITIES)(t1.origin, t2.origin))
            :
            [];
    }, [props.tracks, selectedLanguage]);
    const onMouseDown = React.useCallback((event) => {
        event.nativeEvent.subtitlesMenuClosePrevented = true;
    }, []);
    const languageOnClick = React.useCallback((event) => {
        const trackId = Array.isArray(props.tracks) ?
            props.tracks
                .slice()
                .sort((t1, t2) => comparatorWithPriorities(ORIGIN_PRIORITIES)(t1.origin, t2.origin))
                .reduceRight((trackId, track) => {
                    if (track.lang === event.currentTarget.dataset.lang) {
                        return track.id;
                    }

                    return trackId;
                }, null)
            :
            null;
        props.onTrackSelected(trackId);
    }, [props.tracks, props.onTrackSelected]);
    const trackOnClick = React.useCallback((event) => {
        props.onTrackSelected(event.currentTarget.dataset.trackId);
    }, [props.onTrackSelected]);
    const onDelayChanged = React.useCallback((event) => {
        if (props.delay !== null && !isNaN(props.delay)) {
            const delta = event.value === 'increment' ? 250 : -250;
            const delay = props.delay + delta;
            if (typeof props.onDelayChanged === 'function') {
                props.onDelayChanged(delay);
            }
        }
    }, [props.delay, props.onDelayChanged]);
    const onSizeChanged = React.useCallback((event) => {
        if (props.size !== null && !isNaN(props.size)) {
            const sizeIndex = CONSTANTS.SUBTITLES_SIZES.indexOf(props.size);
            const delta = event.value === 'increment' ? 1 : -1;
            const size = CONSTANTS.SUBTITLES_SIZES[Math.max(0, Math.min(CONSTANTS.SUBTITLES_SIZES.length, sizeIndex + delta))];
            if (typeof props.onSizeChanged === 'function') {
                props.onSizeChanged(size);
            }
        }
    }, [props.size, props.onSizeChanged]);
    const onOffsetChange = React.useCallback((event) => {
        if (props.offset !== null && !isNaN(props.offset)) {
            const delta = event.value === 'increment' ? 1 : -1;
            const offset = props.offset + delta;
            if (typeof props.onOffsetChanged === 'function') {
                props.onOffsetChanged(offset);
            }
        }
    }, [props.offset, props.onOffsetChanged]);
    return (
        <div className={classnames(props.className, styles['subtitles-menu-container'])} onMouseDown={onMouseDown}>
            <div className={styles['languages-container']}>
                <div className={styles['languages-header']}>Languages</div>
                <div className={styles['languages-list']}>
                    <Button title={'Off'} className={classnames(styles['language-option'], { 'selected': selectedLanguage === null })} onClick={languageOnClick}>
                        <div className={styles['language-label']}>Off</div>
                        {
                            selectedLanguage === null ?
                                <div className={styles['icon']} />
                                :
                                null
                        }
                    </Button>
                    {languages.map((lang, index) => (
                        <Button key={index} title={typeof languageNames[lang] === 'string' ? languageNames[lang] : lang} className={classnames(styles['language-option'], { 'selected': selectedLanguage === lang })} data-lang={lang} onClick={languageOnClick}>
                            <div className={styles['language-label']}>{typeof languageNames[lang] === 'string' ? languageNames[lang] : lang}</div>
                            {
                                selectedLanguage === lang ?
                                    <div className={styles['icon']} />
                                    :
                                    null
                            }
                        </Button>
                    ))}
                </div>
            </div>
            <div className={styles['variants-container']}>
                <div className={styles['variants-header']}>Variants</div>
                {
                    tracksForLanguage.length > 0 ?
                        <div className={styles['variants-list']}>
                            {tracksForLanguage.map((track, index) => (
                                <Button key={index} title={track.origin} className={classnames(styles['variant-option'], { 'selected': props.selectedTrackId === track.id })} data-track-id={track.id} onClick={trackOnClick}>
                                    <div className={styles['variant-label']}>{track.origin}</div>
                                    {
                                        props.selectedTrackId === track.id ?
                                            <div className={styles['icon']} />
                                            :
                                            null
                                    }
                                </Button>
                            ))}
                        </div>
                        :
                        <div className={styles['no-variants-container']}>
                            <div className={styles['no-variants-label']}>
                                Subtitles are disabled
                            </div>
                        </div>
                }
            </div>
            <div className={styles['subtitles-settings-container']}>
                <div className={styles['settings-header']}>Settings</div>
                <DiscreteSelectInput
                    className={styles['discrete-input']}
                    label={'Delay'}
                    value={props.delay !== null && !isNaN(props.delay) ? `${(props.delay / 1000).toFixed(2)}s` : '--'}
                    disabled={tracksForLanguage.length === 0 || props.delay === null || isNaN(props.delay)}
                    onChange={onDelayChanged}
                />
                <DiscreteSelectInput
                    className={styles['discrete-input']}
                    label={'Size'}
                    value={props.size !== null && !isNaN(props.size) ? `${props.size}%` : '--'}
                    disabled={tracksForLanguage.length === 0 || props.size === null || isNaN(props.size)}
                    onChange={onSizeChanged}
                />
                <DiscreteSelectInput
                    className={styles['discrete-input']}
                    label={'Vertical position'}
                    value={props.offset !== null && !isNaN(props.offset) ? `${props.offset}%` : '--'}
                    disabled={tracksForLanguage.length === 0 || props.offset === null || isNaN(props.offset)}
                    onChange={onOffsetChange}
                />
                <div className={styles['spacing']} />
                <Button className={classnames(styles['advanced-button'], 'disabled')} title={'Advanced'}>Advanced</Button>
            </div>
        </div>
    );
};

SubtitlesMenu.propTypes = {
    className: PropTypes.string,
    tracks: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.string.isRequired,
        lang: PropTypes.string.isRequired,
        origin: PropTypes.string.isRequired
    })),
    selectedTrackId: PropTypes.string,
    offset: PropTypes.number,
    size: PropTypes.number,
    delay: PropTypes.number,
    textColor: PropTypes.string,
    backgroundColor: PropTypes.string,
    outlineColor: PropTypes.string,
    onTrackSelected: PropTypes.func,
    onDelayChanged: PropTypes.func,
    onSizeChanged: PropTypes.func,
    onOffsetChanged: PropTypes.func
};

module.exports = SubtitlesMenu;
