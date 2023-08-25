// Copyright (C) 2017-2023 Smart code 203358507

const React = require('react');
const PropTypes = require('prop-types');
const classnames = require('classnames');
const { Button, CONSTANTS, comparatorWithPriorities, languageNames } = require('stremio/common');
const DiscreteSelectInput = require('./DiscreteSelectInput');
const styles = require('./styles');
const { t } = require('i18next');

const ORIGIN_PRIORITIES = {
    'EMBEDDED': 2,
    'EXCLUSIVE': 1
};
const LANGUAGE_PRIORITIES = {
    'eng': 1
};

const SubtitlesMenu = React.memo((props) => {
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
    const selectedSubtitlesLanguage = React.useMemo(() => {
        return typeof props.selectedSubtitlesTrackId === 'string' ?
            (Array.isArray(props.subtitlesTracks) ? props.subtitlesTracks : [])
                .reduce((selectedSubtitlesLanguage, { id, lang }) => {
                    if (id === props.selectedSubtitlesTrackId) {
                        return lang;
                    }

                    return selectedSubtitlesLanguage;
                }, null)
            :
            typeof props.selectedExtraSubtitlesTrackId === 'string' ?
                (Array.isArray(props.extraSubtitlesTracks) ? props.extraSubtitlesTracks : [])
                    .reduce((selectedSubtitlesLanguage, { id, lang }) => {
                        if (id === props.selectedExtraSubtitlesTrackId) {
                            return lang;
                        }

                        return selectedSubtitlesLanguage;
                    }, null)
                :
                null;
    }, [props.subtitlesTracks, props.extraSubtitlesTracks, props.selectedSubtitlesTrackId, props.selectedExtraSubtitlesTrackId]);
    const subtitlesTracksForLanguage = React.useMemo(() => {
        return (Array.isArray(props.subtitlesTracks) ? props.subtitlesTracks : [])
            .concat(Array.isArray(props.extraSubtitlesTracks) ? props.extraSubtitlesTracks : [])
            .filter(({ lang }) => lang === selectedSubtitlesLanguage)
            .sort((t1, t2) => comparatorWithPriorities(ORIGIN_PRIORITIES)(t1.origin, t2.origin));
    }, [props.subtitlesTracks, props.extraSubtitlesTracks, selectedSubtitlesLanguage]);
    const onMouseDown = React.useCallback((event) => {
        event.nativeEvent.subtitlesMenuClosePrevented = true;
    }, []);
    const subtitlesLanguageOnClick = React.useCallback((event) => {
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
        } else if (track.embedded) {
            if (typeof props.onSubtitlesTrackSelected === 'function') {
                props.onSubtitlesTrackSelected(track.id);
            }
        } else {
            if (typeof props.onExtraSubtitlesTrackSelected === 'function') {
                props.onExtraSubtitlesTrackSelected(track.id);
            }
        }
    }, [props.subtitlesTracks, props.extraSubtitlesTracks, props.onSubtitlesTrackSelected, props.onExtraSubtitlesTrackSelected]);
    const subtitlesTrackOnClick = React.useCallback((event) => {
        if (event.currentTarget.dataset.embedded === 'true') {
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
    const audioTrackOnClick = React.useCallback((event) => {
        if (typeof props.onAudioTrackSelected === 'function') {
            props.onAudioTrackSelected(event.currentTarget.dataset.id);
        }
    }, [props.onAudioTrackSelected]);
    return (
        <div className={classnames(props.className, styles['subtitles-menu-container'])} onMouseDown={onMouseDown}>
            {
                Array.isArray(props.audioTracks) && props.audioTracks.length > 1 ?
                    <div className={styles['languages-container']}>
                        <div className={styles['languages-header']}>Audio Languages</div>
                        <div className={styles['languages-list']}>
                            {props.audioTracks.map(({ id, label, lang }, index) => (
                                <Button key={index} title={label} className={classnames(styles['language-option'], { 'selected': props.selectedAudioTrackId === id })} data-id={id} onClick={audioTrackOnClick}>
                                    <div className={styles['language-label']}>{typeof languageNames[lang] === 'string' ? languageNames[lang] : lang}</div>
                                    {
                                        props.selectedAudioTrackId === id ?
                                            <div className={styles['icon']} />
                                            :
                                            null
                                    }
                                </Button>
                            ))}
                        </div>
                    </div>
                    :
                    null
            }
            <div className={styles['languages-container']}>
                <div className={styles['languages-header']}>{ t('PLAYER_SUBTITLES_LANGUAGES') }</div>
                <div className={styles['languages-list']}>
                    <Button title={t('OFF')} className={classnames(styles['language-option'], { 'selected': selectedSubtitlesLanguage === null })} onClick={subtitlesLanguageOnClick}>
                        <div className={styles['language-label']}>{ t('OFF') }</div>
                        {
                            selectedSubtitlesLanguage === null ?
                                <div className={styles['icon']} />
                                :
                                null
                        }
                    </Button>
                    {subtitlesLanguages.map((lang, index) => (
                        <Button key={index} title={typeof languageNames[lang] === 'string' ? languageNames[lang] : lang} className={classnames(styles['language-option'], { 'selected': selectedSubtitlesLanguage === lang })} data-lang={lang} onClick={subtitlesLanguageOnClick}>
                            <div className={styles['language-label']}>{typeof languageNames[lang] === 'string' ? languageNames[lang] : lang}</div>
                            {
                                selectedSubtitlesLanguage === lang ?
                                    <div className={styles['icon']} />
                                    :
                                    null
                            }
                        </Button>
                    ))}
                </div>
            </div>
            <div className={styles['variants-container']}>
                <div className={styles['variants-header']}>{ t('PLAYER_SUBTITLES_VARIANTS') }</div>
                {
                    subtitlesTracksForLanguage.length > 0 ?
                        <div className={styles['variants-list']}>
                            {subtitlesTracksForLanguage.map((track, index) => (
                                <Button key={index} title={track.label} className={classnames(styles['variant-option'], { 'selected': props.selectedSubtitlesTrackId === track.id || props.selectedExtraSubtitlesTrackId === track.id })} data-id={track.id} data-origin={track.origin} data-embedded={track.embedded} onClick={subtitlesTrackOnClick}>
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
                                { t('PLAYER_SUBTITLES_DISABLED') }
                            </div>
                        </div>
                }
            </div>
            <div className={styles['subtitles-settings-container']}>
                <div className={styles['settings-header']}>Subtitles Settings</div>
                <DiscreteSelectInput
                    className={styles['discrete-input']}
                    label={t('DELAY')}
                    value={typeof props.selectedExtraSubtitlesTrackId === 'string' && props.extraSubtitlesDelay !== null && !isNaN(props.extraSubtitlesDelay) ? `${(props.extraSubtitlesDelay / 1000).toFixed(2)}s` : '--'}
                    disabled={typeof props.selectedExtraSubtitlesTrackId !== 'string' || props.extraSubtitlesDelay === null || isNaN(props.extraSubtitlesDelay)}
                    onChange={onSubtitlesDelayChanged}
                />
                <DiscreteSelectInput
                    className={styles['discrete-input']}
                    label={t('SIZE')}
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
                    label={t('PLAYER_SUBTITLES_VERTICAL_POSIITON')}
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
            </div>
        </div>
    );
});

SubtitlesMenu.displayName = 'MainNavBars';

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
        origin: PropTypes.string.isRequired,
        label: PropTypes.string.isRequired
    })),
    selectedExtraSubtitlesTrackId: PropTypes.string,
    extraSubtitlesOffset: PropTypes.number,
    extraSubtitlesDelay: PropTypes.number,
    extraSubtitlesSize: PropTypes.number,
    audioTracks: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.string.isRequired,
        lang: PropTypes.string.isRequired,
        origin: PropTypes.string.isRequired,
        label: PropTypes.string.isRequired
    })),
    selectedAudioTrackId: PropTypes.string,
    onSubtitlesTrackSelected: PropTypes.func,
    onExtraSubtitlesTrackSelected: PropTypes.func,
    onAudioTrackSelected: PropTypes.func,
    onSubtitlesOffsetChanged: PropTypes.func,
    onSubtitlesSizeChanged: PropTypes.func,
    onExtraSubtitlesOffsetChanged: PropTypes.func,
    onExtraSubtitlesDelayChanged: PropTypes.func,
    onExtraSubtitlesSizeChanged: PropTypes.func
};

module.exports = SubtitlesMenu;
