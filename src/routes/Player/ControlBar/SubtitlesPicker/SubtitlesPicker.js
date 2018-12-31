import React, { PureComponent, Fragment } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import Icon from 'stremio-icons/dom';
import styles from './styles';

const ORIGIN_PRIORITIES = {
    'LOCAL': 1,
    'EMBEDDED': 2
};

class SubtitlesPicker extends PureComponent {
    subtitlesComparator = (PRIORITIES) => {
        return (a, b) => {
            const valueA = PRIORITIES[a];
            const valueB = PRIORITIES[b];
            if (!isNaN(valueA) && !isNaN(valueB)) return valueA - valueB;
            if (!isNaN(valueA)) return -1;
            if (!isNaN(valueB)) return 1;
            return a - b;
        }
    }

    toggleOnClick = () => {
        this.props.setSelectedSubtitleTrackId(this.props.selectedSubtitleTrackId === null ? this.props.subtitleTracks[0].id : null);
    }

    labelOnClick = (event) => {
        const selectedTrack = this.props.subtitleTracks.find(({ label, origin }) => {
            return label === event.currentTarget.dataset.label &&
                origin === event.currentTarget.dataset.origin;
        });
        if (selectedTrack) {
            this.props.setSelectedSubtitleTrackId(selectedTrack.id);
        }
    }

    trackOnClick = (event) => {
        this.props.setSelectedSubtitleTrackId(event.currentTarget.dataset.trackId);
    }

    setSubtitleSize = (event) => {
        this.props.setSubtitleSize(event.currentTarget.dataset.value);
    }

    renderToggleButton({ selectedTrack }) {
        return (
            <div className={styles['toggle-button-container']} onClick={this.toggleOnClick}>
                <div className={styles['toggle-label']}>ON</div>
                <div className={styles['toggle-label']}>OFF</div>
                <div className={classnames(styles['toggle-thumb'], { [styles['on']]: selectedTrack })} />
            </div>
        );
    }

    renderLabelsList({ groupedTracks, selectedTrack }) {
        return (
            <div className={styles['labels-list-container']}>
                {
                    Object.keys(groupedTracks)
                        .sort(this.subtitlesComparator(ORIGIN_PRIORITIES))
                        .map((origin) => (
                            <Fragment key={origin}>
                                <div className={styles['track-origin']}>{origin}</div>
                                {
                                    Object.keys(groupedTracks[origin])
                                        .sort(this.subtitlesComparator(this.props.languagePriorities))
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
                            </Fragment>
                        ))
                }
            </div>
        );
    }

    renderNumberInput({ value, unit, onChange }) {
        if (value === null) {
            return null;
        }

        return (
            <div className={styles['number-input-container']}>
                <div className={styles['number-input-button']} data-value={value - 1} onClick={onChange}>
                    <Icon className={styles['number-input-icon']} icon={'ic_minus'} />
                </div>
                <div className={styles['number-input-value']}>{value}{unit}</div>
                <div className={styles['number-input-button']} data-value={value + 1} onClick={onChange}>
                    <Icon className={styles['number-input-icon']} icon={'ic_plus'} />
                </div>
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
                <div className={styles['preferences-label']}>Preferences</div>
                {
                    groupedTracks[selectedTrack.origin][selectedTrack.label].length > 1 ?
                        <div className={styles['variants-container']}>
                            {groupedTracks[selectedTrack.origin][selectedTrack.label].map((track, index) => {
                                return (
                                    <div key={track.id}
                                        className={classnames(styles['variant-button'], { [styles['selected']]: track.id === selectedTrack.id })}
                                        title={track.id}
                                        onClick={this.trackOnClick}
                                        data-track-id={track.id}
                                        children={index}
                                    />
                                );
                            })}
                        </div>
                        :
                        null
                }
                <div className={styles['number-input-container']}>
                    <div className={styles['number-input-button']}>
                        <Icon className={styles['number-input-icon']} icon={'ic_minus'} />
                    </div>
                    <div className={styles['number-input-value']}>{(17).toFixed(2)}s</div>
                    <div className={styles['number-input-button']}>
                        <Icon className={styles['number-input-icon']} icon={'ic_plus'} />
                    </div>
                </div>
                {this.renderNumberInput({ value: this.props.subtitleSize, unit: 'pt', onChange: this.setSubtitleSize })}
            </div>
        );
    }

    render() {
        const selectedTrack = this.props.subtitleTracks.find(({ id }) => id === this.props.selectedSubtitleTrackId);
        const groupedTracks = this.props.subtitleTracks.reduce((result, track) => {
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
    selectedSubtitleTrackId: PropTypes.string,
    languagePriorities: PropTypes.objectOf(PropTypes.number).isRequired,
    subtitleTracks: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.string.isRequired,
        label: PropTypes.string.isRequired,
        origin: PropTypes.string.isRequired
    })).isRequired,
    setSelectedSubtitleTrackId: PropTypes.func.isRequired
};
SubtitlesPicker.defaultProps = {
    languagePriorities: Object.freeze({
        English: 1
    })
};

export default SubtitlesPicker;
