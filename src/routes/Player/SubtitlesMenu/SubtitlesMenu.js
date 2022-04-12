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
    const subtitlesLanguages = React.useMemo(() => {
        return (Array.isArray(props.subtitlesTracks) ? props.subtitlesTracks : [])
            .concat(Array.isArray(props.extraSubtitlesTracks) ? props.extraSubtitlesTracks : [])
            .reduce((subtitlesLanguages, { lang }) => {
                if (!subtitlesLanguages.includes(lang)) {
                    subtitlesLanguages.push(lang);
                }

                return subtitlesLanguages;
            }, [])
            .sort(comparatorWithPriorities(LANGUAGE_PRIORITIES));
    }, [props.subtitlesTracks, props.extraSubtitlesTracks]);
    const selectedSubtitlesLanguages = React.useMemo(() => {
        return typeof props.selectedSubtitlesTrackId === 'string' ?
            (Array.isArray(props.subtitlesTracks) ? props.subtitlesTracks : [])
                .reduce((selectedSubtitlesLanguages, { id, lang }) => {
                    if (id === props.selectedSubtitlesTrackId) {
                        return lang;
                    }

                    return selectedSubtitlesLanguages;
                }, null)
            :
            typeof props.selectedExtraSubtitlesTrackId === 'string' ?
                (Array.isArray(props.extraSubtitlesTracks) ? props.extraSubtitlesTracks : [])
                    .reduce((selectedSubtitlesLanguages, { id, lang }) => {
                        if (id === props.selectedExtraSubtitlesTrackId) {
                            return lang;
                        }

                        return selectedSubtitlesLanguages;
                    }, null)
                :
                null;
    }, [props.subtitlesTracks, props.extraSubtitlesTracks, props.selectedSubtitlesTrackId, props.selectedExtraSubtitlesTrackId]);
    const tracksForLanguage = React.useMemo(() => {
        return (Array.isArray(props.subtitlesTracks) ? props.subtitlesTracks : [])
            .concat(Array.isArray(props.extraSubtitlesTracks) ? props.extraSubtitlesTracks : [])
            .filter(({ lang }) => lang === selectedSubtitlesLanguages)
            .sort((t1, t2) => comparatorWithPriorities(ORIGIN_PRIORITIES)(t1.origin, t2.origin));
    }, [props.subtitlesTracks, props.extraSubtitlesTracks, selectedSubtitlesLanguages]);
    const onMouseDown = React.useCallback((event) => {
        event.nativeEvent.subtitlesMenuClosePrevented = true;
    }, []);
    const languageOnClick = React.useCallback((event) => {
        const track = (Array.isArray(props.subtitlesTracks) ? props.subtitlesTracks : [])
            .concat(Array.isArray(props.extraSubtitlesTracks) ? props.extraSubtitlesTracks : [])
            .filter(({ lang }) => lang === event.currentTarget.dataset.lang)
            .sort((t1, t2) => comparatorWithPriorities(ORIGIN_PRIORITIES)(t1.origin, t2.origin))
            .shift();
        if (!track) {
            if (typeof props.onSubtitlesTrackSelected === 'function') {
                props.onSubtitlesTrackSelected(null);
            }
            if (typeof props.onExtraSubtitlesTrackSelected === 'function') {
                props.onExtraSubtitlesTrackSelected(null);
            }
        } else if (track.origin === 'EMBEDDED') {
            if (typeof props.onSubtitlesTrackSelected === 'function') {
                props.onSubtitlesTrackSelected(track.id);
            }
        } else {
            if (typeof props.onExtraSubtitlesTrackSelected === 'function') {
                props.onExtraSubtitlesTrackSelected(track.id);
            }
        }
    }, [props.subtitlesTracks, props.extraSubtitlesTracks, props.onSubtitlesTrackSelected, props.onExtraSubtitlesTrackSelected]);
    const trackOnClick = React.useCallback((event) => {
        if (event.currentTarget.dataset.origin === 'EMBEDDED') {
            if (typeof props.onSubtitlesTrackSelected === 'function') {
                props.onSubtitlesTrackSelected(event.currentTarget.dataset.id);
            }
        } else {
            if (typeof props.onExtraSubtitlesTrackSelected === 'function') {
                props.onExtraSubtitlesTrackSelected(event.currentTarget.dataset.id);
            }
        }
    }, [props.onSubtitlesTrackSelected, props.onExtraSubtitlesTrackSelected]);
    const onSubtitlesDelayChanged = React.useCallback((event) => {
        const delta = event.value === 'increment' ? 250 : -250;
        if (typeof props.selectedExtraSubtitlesTrackId === 'string') {
            if (props.extraSubtitlesDelay !== null && !isNaN(props.extraSubtitlesDelay)) {
                const extraDelay = props.extraSubtitlesDelay + delta;
                if (typeof props.onExtraSubtitlesDelayChanged === 'function') {
                    props.onExtraSubtitlesDelayChanged(extraDelay);
                }
            }
        }
    }, [props.selectedExtraSubtitlesTrackId, props.extraSubtitlesDelay, props.onExtraSubtitlesDelayChanged]);
    const onSubtitlesSizeChanged = React.useCallback((event) => {
        const delta = event.value === 'increment' ? 1 : -1;
        if (typeof props.selectedSubtitlesTrackId === 'string') {
            if (props.subtitlesSize !== null && !isNaN(props.subtitlesSize)) {
                const sizeIndex = CONSTANTS.SUBTITLES_SIZES.indexOf(props.subtitlesSize);
                const size = CONSTANTS.SUBTITLES_SIZES[Math.max(0, Math.min(CONSTANTS.SUBTITLES_SIZES.length - 1, sizeIndex + delta))];
                if (typeof props.onSubtitlesSizeChanged === 'function') {
                    props.onSubtitlesSizeChanged(size);
                }
            }
        } else if (typeof props.selectedExtraSubtitlesTrackId === 'string') {
            if (props.extraSubtitlesSize !== null && !isNaN(props.extraSubtitlesSize)) {
                const extraSizeIndex = CONSTANTS.SUBTITLES_SIZES.indexOf(props.extraSubtitlesSize);
                const extraSize = CONSTANTS.SUBTITLES_SIZES[Math.max(0, Math.min(CONSTANTS.SUBTITLES_SIZES.length - 1, extraSizeIndex + delta))];
                if (typeof props.onExtraSubtitlesSizeChanged === 'function') {
                    props.onExtraSubtitlesSizeChanged(extraSize);
                }
            }
        }
    }, [props.selectedSubtitlesTrackId, props.selectedExtraSubtitlesTrackId, props.subtitlesSize, props.extraSubtitlesSize, props.onSubtitlesSizeChanged, props.onExtraSubtitlesSizeChanged]);
    const onSubtitlesOffsetChanged = React.useCallback((event) => {
        const delta = event.value === 'increment' ? 1 : -1;
        if (typeof props.selectedSubtitlesTrackId === 'string') {
            if (props.extraSubtitlesOffset !== null && !isNaN(props.extraSubtitlesOffset)) {
                const offset = Math.max(0, Math.min(100, Math.floor(props.extraSubtitlesOffset + delta)));
                if (typeof props.onExtraSubtitlesOffsetChanged === 'function') {
                    props.onExtraSubtitlesOffsetChanged(offset);
                }
            }
        } else if (typeof props.selectedExtraSubtitlesTrackId === 'string') {
            if (props.subtitlesOffset !== null && !isNaN(props.subtitlesOffset)) {
                const offset = Math.max(0, Math.min(100, Math.floor(props.subtitlesOffset + delta)));
                if (typeof props.onSubtitlesOffsetChanged === 'function') {
                    props.onSubtitlesOffsetChanged(offset);
                }
            }
        }
    }, [props.selectedSubtitlesTrackId, props.selectedExtraSubtitlesTrackId, props.subtitlesOffset, props.extraSubtitlesOffset, props.onSubtitlesOffsetChanged, props.onExtraSubtitlesOffsetChanged]);
    return (
        <div className={classnames(props.className, styles['subtitles-menu-container'])} onMouseDown={onMouseDown}>
            <div className={styles['languages-container']}>
                <div className={styles['languages-header']}>Languages</div>
                <div className={styles['languages-list']}>
                    <Button title={'Off'} className={classnames(styles['language-option'], { 'selected': selectedSubtitlesLanguages === null })} onClick={languageOnClick}>
                        <div className={styles['language-label']}>Off</div>
                        {
                            selectedSubtitlesLanguages === null ?
                                <div className={styles['icon']} />
                                :
                                null
                        }
                    </Button>
                    {subtitlesLanguages.map((lang, index) => (
                        <Button key={index} title={typeof languageNames[lang] === 'string' ? languageNames[lang] : lang} className={classnames(styles['language-option'], { 'selected': selectedSubtitlesLanguages === lang })} data-lang={lang} onClick={languageOnClick}>
                            <div className={styles['language-label']}>{typeof languageNames[lang] === 'string' ? languageNames[lang] : lang}</div>
                            {
                                selectedSubtitlesLanguages === lang ?
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
                                <Button key={index} title={track.label} className={classnames(styles['variant-option'], { 'selected': props.selectedSubtitlesTrackId === track.id || props.selectedExtraSubtitlesTrackId === track.id })} data-id={track.id} data-origin={track.origin} onClick={trackOnClick}>
                                    <div className={styles['variant-label']}>{track.origin}</div>
                                    {
                                        props.selectedSubtitlesTrackId === track.id || props.selectedExtraSubtitlesTrackId === track.id ?
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
                    value={typeof props.selectedExtraSubtitlesTrackId === 'string' && props.extraSubtitlesDelay !== null && !isNaN(props.extraSubtitlesDelay) ? `${(props.extraSubtitlesDelay / 1000).toFixed(2)}s` : '--'}
                    disabled={typeof props.selectedExtraSubtitlesTrackId !== 'string' || props.extraSubtitlesDelay === null || isNaN(props.extraSubtitlesDelay)}
                    onChange={onSubtitlesDelayChanged}
                />
                <DiscreteSelectInput
                    className={styles['discrete-input']}
                    label={'Size'}
                    value={
                        typeof props.selectedSubtitlesTrackId === 'string' ?
                            props.subtitlesSize !== null && !isNaN(props.subtitlesSize) ? `${props.subtitlesSize}%` : '--'
                            :
                            typeof props.selectedExtraSubtitlesTrackId === 'string' ?
                                props.extraSubtitlesSize !== null && !isNaN(props.extraSubtitlesSize) ? `${props.extraSubtitlesSize}%` : '--'
                                :
                                '--'
                    }
                    disabled={
                        typeof props.selectedSubtitlesTrackId === 'string' ?
                            props.subtitlesSize === null || isNaN(props.subtitlesSize)
                            :
                            typeof props.selectedExtraSubtitlesTrackId === 'string' ?
                                props.extraSubtitlesSize === null || isNaN(props.extraSubtitlesSize)
                                :
                                true
                    }
                    onChange={onSubtitlesSizeChanged}
                />
                <DiscreteSelectInput
                    className={styles['discrete-input']}
                    label={'Vertical position'}
                    value={
                        typeof props.selectedSubtitlesTrackId === 'string' ?
                            props.subtitlesOffset !== null && !isNaN(props.subtitlesOffset) ? `${props.subtitlesOffset}%` : '--'
                            :
                            typeof props.selectedExtraSubtitlesTrackId === 'string' ?
                                props.extraSubtitlesOffset !== null && !isNaN(props.extraSubtitlesOffset) ? `${props.extraSubtitlesOffset}%` : '--'
                                :
                                '--'
                    }
                    disabled={
                        typeof props.selectedSubtitlesTrackId === 'string' ?
                            props.subtitlesOffset === null || isNaN(props.subtitlesOffset)
                            :
                            typeof props.selectedExtraSubtitlesTrackId === 'string' ?
                                props.extraSubtitlesOffset === null || isNaN(props.extraSubtitlesOffset)
                                :
                                true
                    }
                    onChange={onSubtitlesOffsetChanged}
                />
                <div className={styles['spacing']} />
                <Button className={classnames(styles['advanced-button'], 'disabled')} title={'Advanced'}>Advanced</Button>
            </div>
        </div>
    );
};

SubtitlesMenu.propTypes = {
    className: PropTypes.string,
    subtitlesTracks: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.string.isRequired,
        lang: PropTypes.string.isRequired,
        origin: PropTypes.string.isRequired
    })),
    selectedSubtitlesTrackId: PropTypes.string,
    subtitlesOffset: PropTypes.number,
    subtitlesSize: PropTypes.number,
    extraSubtitlesTracks: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.string.isRequired,
        lang: PropTypes.string.isRequired,
        origin: PropTypes.string.isRequired
    })),
    selectedExtraSubtitlesTrackId: PropTypes.string,
    extraSubtitlesOffset: PropTypes.number,
    extraSubtitlesDelay: PropTypes.number,
    extraSubtitlesSize: PropTypes.number,
    onSubtitlesTrackSelected: PropTypes.func,
    onExtraSubtitlesTrackSelected: PropTypes.func,
    onSubtitlesOffsetChanged: PropTypes.func,
    onSubtitlesSizeChanged: PropTypes.func,
    onExtraSubtitlesOffsetChanged: PropTypes.func,
    onExtraSubtitlesDelayChanged: PropTypes.func,
    onExtraSubtitlesSizeChanged: PropTypes.func
};

module.exports = SubtitlesMenu;
