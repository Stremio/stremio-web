const React = require('react');
const PropTypes = require('prop-types');
const classnames = require('classnames');
const Icon = require('stremio-icons/dom');
const { Modal } = require('stremio-router');
const { ColorInput } = require('stremio/common');
const styles = require('./styles');

const ORIGIN_PRIORITIES = Object.freeze({
    'LOCAL': 1,
    'EMBEDDED': 2
});
const LANGUAGE_PRIORITIES = Object.freeze({
    'English': 1
});
const SUBTITLES_SIZE_LABELS = Object.freeze({
    1: '75%',
    2: '100%',
    3: '125%',
    4: '200%',
    5: '250%'
});

const comparatorWithPriorities = (priorities) => {
    return (a, b) => {
        const valueA = priorities[a];
        const valueB = priorities[b];
        if (!isNaN(valueA) && !isNaN(valueB)) return valueA - valueB;
        if (!isNaN(valueA)) return -1;
        if (!isNaN(valueB)) return 1;
        return a - b;
    };
};

const NumberInput = ({ value, label, delta, onChange }) => {
    return (
        <div className={styles['number-input-container']}>
            <div className={styles['number-input-button']} data-value={value - delta} onClick={onChange}>
                <Icon className={styles['number-input-icon']} icon={'ic_minus'} />
            </div>
            <div className={styles['number-input-value']}>{label}</div>
            <div className={styles['number-input-button']} data-value={value + delta} onClick={onChange}>
                <Icon className={styles['number-input-icon']} icon={'ic_plus'} />
            </div>
        </div>
    );
};

const SubtitlesPicker = (props) => {
    const toggleSubtitleEnabled = React.useCallback(() => {
        const selectedSubtitlesTrackId = props.selectedSubtitlesTrackId === null && props.subtitlesTracks.length > 0 ?
            props.subtitlesTracks[0].id
            :
            null;
        props.dispatch({ propName: 'selectedSubtitlesTrackId', propValue: selectedSubtitlesTrackId });
    }, [props.selectedSubtitlesTrackId, props.subtitlesTracks, props.dispatch]);
    const labelOnClick = React.useCallback((event) => {
        const subtitleTrack = props.subtitlesTracks.find(({ label, origin }) => {
            return label === event.currentTarget.dataset.label &&
                origin === event.currentTarget.dataset.origin;
        });
        if (subtitleTrack) {
            props.dispatch({ propName: 'selectedSubtitlesTrackId', propValue: subtitleTrack.id });
        }
    }, [props.subtitlesTracks, props.dispatch]);
    const variantOnClick = React.useCallback((event) => {
        props.dispatch({ propName: 'selectedSubtitlesTrackId', propValue: event.currentTarget.dataset.trackId });
    }, [props.dispatch]);
    const setsubtitlesSize = React.useCallback((event) => {
        props.dispatch({ propName: 'subtitlesSize', propValue: event.currentTarget.dataset.value });
    }, [props.dispatch]);
    const setSubtitlesDelay = React.useCallback((event) => {
        props.dispatch({ propName: 'subtitlesDelay', propValue: event.currentTarget.dataset.value });
    }, [props.dispatch]);
    const setSubtitlesTextColor = React.useCallback((event) => {
        props.dispatch({ propName: 'subtitlesTextColor', propValue: event.nativeEvent.value });
    }, [props.dispatch]);
    const setSubtitlesBackgroundColor = React.useCallback((color) => {
        props.dispatch({ propName: 'subtitlesBackgroundColor', propValue: color });
    }, [props.dispatch]);
    const setSubtitlesOutlineColor = React.useCallback((color) => {
        props.dispatch({ propName: 'subtitlesOutlineColor', propValue: color });
    }, [props.dispatch]);
    const selectedTrack = props.subtitlesTracks.find(({ id }) => id === props.selectedSubtitlesTrackId);
    const groupedTracks = props.subtitlesTracks.reduce((result, track) => {
        result[track.origin] = result[track.origin] || {};
        result[track.origin][track.label] = result[track.origin][track.label] || [];
        result[track.origin][track.label].push(track);
        return result;
    }, {});
    return (
        <div className={classnames(props.className, styles['subtitles-picker-container'])}>
            <div className={styles['toggle-button-container']} onClick={toggleSubtitleEnabled}>
                <div className={styles['toggle-label']}>ON</div>
                <div className={styles['toggle-label']}>OFF</div>
                <div className={classnames(styles['toggle-thumb'], { [styles['on']]: !!selectedTrack })} />
            </div>
            <div className={styles['labels-list-container']}>
                {
                    Object.keys(groupedTracks)
                        .sort(comparatorWithPriorities(ORIGIN_PRIORITIES))
                        .map((origin) => (
                            <React.Fragment key={origin}>
                                <div className={styles['track-origin']}>{origin}</div>
                                {
                                    Object.keys(groupedTracks[origin])
                                        .sort(comparatorWithPriorities(LANGUAGE_PRIORITIES))
                                        .map((label) => {
                                            const selected = selectedTrack && selectedTrack.label === label && selectedTrack.origin === origin;
                                            return (
                                                <div key={label}
                                                    className={classnames(styles['language-label'], { [styles['selected']]: selected })}
                                                    onClick={labelOnClick}
                                                    data-label={label}
                                                    data-origin={origin}
                                                    children={label}
                                                />
                                            );
                                        })
                                }
                            </React.Fragment>
                        ))
                }
            </div>
            {
                !selectedTrack ?
                    <div className={styles['preferences-container']}>
                        <div className={styles['subtitles-disabled-label']}>Subtitles are disabled</div>
                    </div>
                    :
                    <div className={styles['preferences-container']}>
                        <div className={styles['preferences-title']}>Preferences</div>
                        {
                            groupedTracks[selectedTrack.origin][selectedTrack.label].length > 1 ?
                                <div className={styles['variants-container']}>
                                    {
                                        groupedTracks[selectedTrack.origin][selectedTrack.label].map((track, index) => (
                                            <div key={track.id}
                                                className={classnames(styles['variant-button'], { [styles['selected']]: track.id === selectedTrack.id })}
                                                title={track.id}
                                                onClick={variantOnClick}
                                                data-track-id={track.id}
                                                children={index + 1}
                                            />
                                        ))
                                    }
                                </div>
                                :
                                null
                        }
                        <div className={styles['color-picker-button-container']}>
                            <ColorInput
                                className={styles['color-picker-indicator']}
                                value={props.subtitlesTextColor}
                                onChange={setSubtitlesTextColor}
                            />
                            <div className={styles['color-picker-label']}>Text color</div>
                        </div>
                        {/* <SubtitlesColorPicker
                            label={'Background color'}
                            value={props.subtitlesBackgroundColor}
                            onChange={setSubtitlesBackgroundColor}
                        />
                        <SubtitlesColorPicker
                            label={'Outline color'}
                            value={props.subtitlesOutlineColor}
                            onChange={setSubtitlesOutlineColor}
                        /> */}
                        <NumberInput
                            label={SUBTITLES_SIZE_LABELS[props.subtitlesSize]}
                            value={props.subtitlesSize}
                            delta={1}
                            onChange={setsubtitlesSize}
                        />
                        <NumberInput
                            label={`${(props.subtitlesDelay / 1000).toFixed(2)}s`}
                            value={props.subtitlesDelay}
                            delta={100}
                            onChange={setSubtitlesDelay}
                        />
                    </div>
            }
        </div>
    );
};

SubtitlesPicker.propTypes = {
    className: PropTypes.string,
    languagePriorities: PropTypes.objectOf(PropTypes.number),
    subtitlesTracks: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.string.isRequired,
        label: PropTypes.string.isRequired,
        origin: PropTypes.string.isRequired
    })),
    selectedSubtitlesTrackId: PropTypes.string,
    subtitlesSize: PropTypes.number,
    subtitlesDelay: PropTypes.number,
    subtitlesTextColor: PropTypes.string,
    subtitlesBackgroundColor: PropTypes.string,
    subtitlesOutlineColor: PropTypes.string,
    dispatch: PropTypes.func
};

module.exports = SubtitlesPicker;
