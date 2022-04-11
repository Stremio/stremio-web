// Copyright (C) 2017-2022 Smart code 203358507

const React = require('react');
const PropTypes = require('prop-types');
const classnames = require('classnames');
const { Button, CONSTANTS, comparatorWithPriorities, languageNames } = require('stremio/common');
const DiscreteSelectInput = require('./DiscreteSelectInput');
const styles = require('./styles');

const ORIGIN_PRIORITIES = {
    'EMBEDDED': 1,
    'EXCLUSIVE': 2
};
const LANGUAGE_PRIORITIES = {
    'eng': 1
};

const SubtitlesMenu = (props) => {
    const languages = React.useMemo(() => {
        return (Array.isArray(props.tracks) ? props.tracks : [])
            .concat(Array.isArray(props.extraTracks) ? props.extraTracks : [])
            .reduce((languages, { lang }) => {
                if (!languages.includes(lang)) {
                    languages.push(lang);
                }

                return languages;
            }, [])
            .sort(comparatorWithPriorities(LANGUAGE_PRIORITIES));
    }, [props.tracks, props.extraTracks]);
    const selectedLanguage = React.useMemo(() => {
        return typeof props.selectedTrackId === 'string' ?
            (Array.isArray(props.tracks) ? props.tracks : [])
                .reduce((selectedLanguage, { id, lang }) => {
                    if (id === props.selectedTrackId) {
                        return lang;
                    }

                    return selectedLanguage;
                }, null)
            :
            typeof props.selectedExtraTrackId === 'string' ?
                (Array.isArray(props.extraTracks) ? props.extraTracks : [])
                    .reduce((selectedLanguage, { id, lang }) => {
                        if (id === props.selectedExtraTrackId) {
                            return lang;
                        }

                        return selectedLanguage;
                    }, null)
                :
                null;
    }, [props.tracks, props.extraTracks, props.selectedTrackId, props.selectedExtraTrackId]);
    const tracksForLanguage = React.useMemo(() => {
        return (Array.isArray(props.tracks) ? props.tracks : [])
            .concat(Array.isArray(props.extraTracks) ? props.extraTracks : [])
            .filter(({ lang }) => lang === selectedLanguage)
            .sort((t1, t2) => comparatorWithPriorities(ORIGIN_PRIORITIES)(t1.origin, t2.origin));
    }, [props.tracks, props.extraTracks, selectedLanguage]);
    const onMouseDown = React.useCallback((event) => {
        event.nativeEvent.subtitlesMenuClosePrevented = true;
    }, []);
    const languageOnClick = React.useCallback((event) => {
        const track = (Array.isArray(props.tracks) ? props.tracks : [])
            .concat(Array.isArray(props.extraTracks) ? props.extraTracks : [])
            .filter(({ lang }) => lang === event.currentTarget.dataset.lang)
            .sort((t1, t2) => comparatorWithPriorities(ORIGIN_PRIORITIES)(t1.origin, t2.origin))
            .shift();
        if (!track) {
            if (typeof props.onTrackSelected === 'function') {
                props.onTrackSelected(null);
            }
            if (typeof props.onExtraTrackSelected === 'function') {
                props.onExtraTrackSelected(null);
            }
        } else if (track.origin === 'EMBEDDED') {
            if (typeof props.onTrackSelected === 'function') {
                props.onTrackSelected(track.id);
            }
        } else {
            if (typeof props.onExtraTrackSelected === 'function') {
                props.onExtraTrackSelected(track.id);
            }
        }
    }, [props.tracks, props.extraTracks, props.onTrackSelected, props.onExtraTrackSelected]);
    const trackOnClick = React.useCallback((event) => {
        if (event.currentTarget.dataset.origin === 'EMBEDDED') {
            if (typeof props.onTrackSelected === 'function') {
                props.onTrackSelected(event.currentTarget.dataset.id);
            }
        } else {
            if (typeof props.onExtraTrackSelected === 'function') {
                props.onExtraTrackSelected(event.currentTarget.dataset.id);
            }
        }
    }, [props.onTrackSelected, props.onExtraTrackSelected]);
    const onExtraDelayChanged = React.useCallback((event) => {
        if (props.extraDelay !== null && !isNaN(props.extraDelay)) {
            const delta = event.value === 'increment' ? 250 : -250;
            const extraDelay = props.extraDelay + delta;
            if (typeof props.onExtraDelayChanged === 'function') {
                props.onExtraDelayChanged(extraDelay);
            }
        }
    }, [props.extraDelay, props.onExtraDelayChanged]);
    const onExtraSizeChanged = React.useCallback((event) => {
        if (props.extraSize !== null && !isNaN(props.extraSize)) {
            const extraSizeIndex = CONSTANTS.SUBTITLES_SIZES.indexOf(props.extraSize);
            const delta = event.value === 'increment' ? 1 : -1;
            const extraSize = CONSTANTS.SUBTITLES_SIZES[Math.max(0, Math.min(CONSTANTS.SUBTITLES_SIZES.length, extraSizeIndex + delta))];
            if (typeof props.onExtraSizeChanged === 'function') {
                props.onExtraSizeChanged(extraSize);
            }
        }
    }, [props.extraSize, props.onExtraSizeChanged]);
    const onOffsetChanged = React.useCallback((event) => {
        if (props.offset !== null && !isNaN(props.offset)) {
            const delta = event.value === 'increment' ? 1 : -1;
            const offset = Math.max(0, Math.min(100, Math.floor(props.offset + delta)));
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
                                <Button key={index} title={track.label} className={classnames(styles['variant-option'], { 'selected': props.selectedTrackId === track.id || props.selectedExtraTrackId === track.id })} data-id={track.id} data-origin={track.origin} onClick={trackOnClick}>
                                    <div className={styles['variant-label']}>{track.origin}</div>
                                    {
                                        props.selectedTrackId === track.id || props.selectedExtraTrackId === track.id ?
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
                    value={props.extraDelay !== null && !isNaN(props.extraDelay) ? `${(props.extraDelay / 1000).toFixed(2)}s` : '--'}
                    disabled={typeof props.selectedExtraTrackId !== 'string' || props.extraDelay === null || isNaN(props.extraDelay)}
                    onChange={onExtraDelayChanged}
                />
                <DiscreteSelectInput
                    className={styles['discrete-input']}
                    label={'Size'}
                    value={props.extraSize !== null && !isNaN(props.extraSize) ? `${props.extraSize}%` : '--'}
                    disabled={typeof props.selectedExtraTrackId !== 'string' || props.extraSize === null || isNaN(props.extraSize)}
                    onChange={onExtraSizeChanged}
                />
                <DiscreteSelectInput
                    className={styles['discrete-input']}
                    label={'Vertical position'}
                    value={props.offset !== null && !isNaN(props.offset) ? `${props.offset}%` : '--'}
                    disabled={props.offset === null || isNaN(props.offset)}
                    onChange={onOffsetChanged}
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
    extraTracks: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.string.isRequired,
        lang: PropTypes.string.isRequired,
        origin: PropTypes.string.isRequired
    })),
    selectedExtraTrackId: PropTypes.string,
    extraDelay: PropTypes.number,
    extraSize: PropTypes.number,
    onTrackSelected: PropTypes.func,
    onOffsetChanged: PropTypes.func,
    onExtraTrackSelected: PropTypes.func,
    onExtraDelayChanged: PropTypes.func,
    onExtraSizeChanged: PropTypes.func
};

module.exports = SubtitlesMenu;
