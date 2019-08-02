const React = require('react');
const PropTypes = require('prop-types');
const classnames = require('classnames');
const Icon = require('stremio-icons/dom');
const { Modal } = require('stremio-navigation');
const { ColorPicker } = require('stremio/common');
const styles = require('./styles');

const ORIGIN_PRIORITIES = Object.freeze({
    'LOCAL': 1,
    'EMBEDDED': 2
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
}

const NumberInput = ({ value, label, delta, onChange }) => {
    if (value === null) {
        return null;
    }

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

const SubtitlesColorPicker = ({ label, value, onChange }) => {
    const [open, setOpen] = React.useState(false);
    const onOpen = () => setOpen(true);
    const onClose = () => setOpen(false);
    if (value === null) {
        return null;
    }

    return (
        <React.Fragment>
            <div className={styles['color-picker-button-container']}>
                <div style={{ backgroundColor: value }} className={styles['color-picker-indicator']} onClick={onOpen} />
                <div className={styles['color-picker-label']}>{label}</div>
            </div>
            {
                open ?
                    <Modal>
                        <div className={styles['color-picker-modal-container']} onClick={onClose}>
                            <ColorPicker className={styles['color-picker-container']} value={value} onChange={onChange} />
                        </div>
                    </Modal>
                    :
                    null
            }
        </React.Fragment>
    );
};

class SubtitlesPicker extends React.Component {
    shouldComponentUpdate(nextProps, nextState) {
        return nextProps.className !== this.props.className ||
            nextProps.subtitlesTracks !== this.props.subtitlesTracks ||
            nextProps.selectedSubtitlesTrackId !== this.props.selectedSubtitlesTrackId ||
            nextProps.subtitlesSize !== this.props.subtitlesSize ||
            nextProps.subtitlesDelay !== this.props.subtitlesDelay ||
            nextProps.subtitlesTextColor !== this.props.subtitlesTextColor ||
            nextProps.subtitlesBackgroundColor !== this.props.subtitlesBackgroundColor ||
            nextProps.subtitlesOutlineColor !== this.props.subtitlesOutlineColor;
    }

    toggleSubtitleEnabled = () => {
        const selectedSubtitlesTrackId = this.props.selectedSubtitlesTrackId === null && this.props.subtitlesTracks.length > 0 ?
            this.props.subtitlesTracks[0].id
            :
            null;
        this.props.dispatch({ propName: 'selectedSubtitlesTrackId', propValue: selectedSubtitlesTrackId });
    }

    labelOnClick = (event) => {
        const subtitleTrack = this.props.subtitlesTracks.find(({ label, origin }) => {
            return label === event.currentTarget.dataset.label &&
                origin === event.currentTarget.dataset.origin;
        });
        if (subtitleTrack) {
            this.props.dispatch({ propName: 'selectedSubtitlesTrackId', propValue: subtitleTrack.id });
        }
    }

    variantOnClick = (event) => {
        this.props.dispatch({ propName: 'selectedSubtitlesTrackId', propValue: event.currentTarget.dataset.trackId });
    }

    setsubtitlesSize = (event) => {
        this.props.dispatch({ propName: 'subtitlesSize', propValue: event.currentTarget.dataset.value });
    }

    setSubtitlesDelay = (event) => {
        this.props.dispatch({ propName: 'subtitlesDelay', propValue: event.currentTarget.dataset.value });
    }

    setSubtitlesTextColor = (color) => {
        this.props.dispatch({ propName: 'subtitlesTextColor', propValue: color });
    }

    setSubtitlesBackgroundColor = (color) => {
        this.props.dispatch({ propName: 'subtitlesBackgroundColor', propValue: color });
    }

    setSubtitlesOutlineColor = (color) => {
        this.props.dispatch({ propName: 'subtitlesOutlineColor', propValue: color });
    }

    renderToggleButton({ selectedTrack }) {
        return (
            <div className={styles['toggle-button-container']} onClick={this.toggleSubtitleEnabled}>
                <div className={styles['toggle-label']}>ON</div>
                <div className={styles['toggle-label']}>OFF</div>
                <div className={classnames(styles['toggle-thumb'], { [styles['on']]: !!selectedTrack })} />
            </div>
        );
    }

    renderLabelsList({ groupedTracks, selectedTrack }) {
        return (
            <div className={styles['labels-list-container']}>
                {
                    Object.keys(groupedTracks)
                        .sort(comparatorWithPriorities(ORIGIN_PRIORITIES))
                        .map((origin) => (
                            <React.Fragment key={origin}>
                                <div className={styles['track-origin']}>{origin}</div>
                                {
                                    Object.keys(groupedTracks[origin])
                                        .sort(comparatorWithPriorities(this.props.languagePriorities))
                                        .map((label) => {
                                            const selected = selectedTrack && selectedTrack.label === label && selectedTrack.origin === origin;
                                            return (
                                                <div key={label}
                                                    className={classnames(styles['language-label'], { [styles['selected']]: selected })}
                                                    onClick={this.labelOnClick}
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
        );
    }

    renderVariantsList({ groupedTracks, selectedTrack }) {
        if (groupedTracks[selectedTrack.origin][selectedTrack.label].length <= 1) {
            return null;
        }

        return (
            <div className={styles['variants-container']}>
                {
                    groupedTracks[selectedTrack.origin][selectedTrack.label].map((track, index) => (
                        <div key={track.id}
                            className={classnames(styles['variant-button'], { [styles['selected']]: track.id === selectedTrack.id })}
                            title={track.id}
                            onClick={this.variantOnClick}
                            data-track-id={track.id}
                            children={index + 1}
                        />
                    ))
                }
            </div>
        );
    }

    renderPreferences({ groupedTracks, selectedTrack }) {
        if (!selectedTrack) {
            return (
                <div className={styles['preferences-container']}>
                    <div className={styles['subtitles-disabled-label']}>Subtitles are disabled</div>
                </div>
            );
        }

        return (
            <div className={styles['preferences-container']}>
                <div className={styles['preferences-title']}>Preferences</div>
                {this.renderVariantsList({ groupedTracks, selectedTrack })}
                <SubtitlesColorPicker
                    label={'Text color'}
                    value={this.props.subtitlesTextColor}
                    onChange={this.setSubtitlesTextColor}
                />
                <SubtitlesColorPicker
                    label={'Background color'}
                    value={this.props.subtitlesBackgroundColor}
                    onChange={this.setSubtitlesBackgroundColor}
                />
                <SubtitlesColorPicker
                    label={'Outline color'}
                    value={this.props.subtitlesOutlineColor}
                    onChange={this.setSubtitlesOutlineColor}
                />
                <NumberInput
                    label={SUBTITLES_SIZE_LABELS[this.props.subtitlesSize]}
                    value={this.props.subtitlesSize}
                    delta={1}
                    onChange={this.setsubtitlesSize}
                />
                <NumberInput
                    label={`${(this.props.subtitlesDelay / 1000).toFixed(2)}s`}
                    value={this.props.subtitlesDelay}
                    delta={100}
                    onChange={this.setSubtitlesDelay}
                />
            </div>
        );
    }

    render() {
        const selectedTrack = this.props.subtitlesTracks.find(({ id }) => id === this.props.selectedSubtitlesTrackId);
        const groupedTracks = this.props.subtitlesTracks.reduce((result, track) => {
            result[track.origin] = result[track.origin] || {};
            result[track.origin][track.label] = result[track.origin][track.label] || [];
            result[track.origin][track.label].push(track);
            return result;
        }, {});

        return (
            <div className={classnames(this.props.className, styles['subtitles-picker-container'])}>
                {this.renderToggleButton({ selectedTrack })}
                {this.renderLabelsList({ groupedTracks, selectedTrack })}
                {this.renderPreferences({ groupedTracks, selectedTrack })}
            </div>
        );
    }
}

SubtitlesPicker.propTypes = {
    className: PropTypes.string,
    languagePriorities: PropTypes.objectOf(PropTypes.number).isRequired,
    subtitlesTracks: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.string.isRequired,
        label: PropTypes.string.isRequired,
        origin: PropTypes.string.isRequired
    })).isRequired,
    selectedSubtitlesTrackId: PropTypes.string,
    subtitlesSize: PropTypes.number,
    subtitlesDelay: PropTypes.number,
    subtitlesTextColor: PropTypes.string,
    subtitlesBackgroundColor: PropTypes.string,
    subtitlesOutlineColor: PropTypes.string,
    dispatch: PropTypes.func.isRequired
};
SubtitlesPicker.defaultProps = {
    subtitlesTracks: Object.freeze([]),
    languagePriorities: Object.freeze({
        English: 1
    })
};

module.exports = SubtitlesPicker;
