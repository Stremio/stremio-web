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

    setSubtitleDelay = (event) => {
        this.props.setSubtitleDelay(event.currentTarget.dataset.value * 1000);
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

    renderVariantsList({ groupedTracks, selectedTrack }) {
        if (groupedTracks[selectedTrack.origin][selectedTrack.label].length <= 1) {
            return null;
        }

        return (
            <div className={styles['variants-container']}>
                {groupedTracks[selectedTrack.origin][selectedTrack.label].map((track, index) => {
                    return (
                        <div key={track.id}
                            className={classnames(styles['variant-button'], { [styles['selected']]: track.id === selectedTrack.id })}
                            title={track.id}
                            onClick={this.trackOnClick}
                            data-track-id={track.id}
                            children={index + 1}
                        />
                    );
                })}
            </div>
        );
    }

    renderNumberInput({ value, unit, delta, onChange }) {
        if (value === null) {
            return null;
        }

        const fractionalDigits = delta.toString().split('.')[1];
        const digitsCount = typeof fractionalDigits === 'string' ? fractionalDigits.length : 0;
        return (
            <div className={styles['number-input-container']}>
                <div className={styles['number-input-button']} data-value={value - delta} onClick={onChange}>
                    <Icon className={styles['number-input-icon']} icon={'ic_minus'} />
                </div>
                <div className={styles['number-input-value']}>{value.toFixed(digitsCount)}{unit}</div>
                <div className={styles['number-input-button']} data-value={value + delta} onClick={onChange}>
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
                <div className={styles['preferences-title']}>Preferences</div>
                {this.renderVariantsList({ groupedTracks, selectedTrack })}
                {this.renderNumberInput({ value: this.props.subtitleSize, unit: 'pt', delta: 0.5, onChange: this.setSubtitleSize })}
                {this.renderNumberInput({ value: this.props.subtitleDelay / 1000, unit: 's', delta: 0.2, onChange: this.setSubtitleDelay })}
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
    languagePriorities: PropTypes.objectOf(PropTypes.number).isRequired,
    subtitleTracks: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.string.isRequired,
        label: PropTypes.string.isRequired,
        origin: PropTypes.string.isRequired
    })).isRequired,
    selectedSubtitleTrackId: PropTypes.string,
    subtitleSize: PropTypes.number,
    subtitleDelay: PropTypes.number,
    setSelectedSubtitleTrackId: PropTypes.func.isRequired,
    setSubtitleSize: PropTypes.func.isRequired,
    setSubtitleDelay: PropTypes.func.isRequired
};
SubtitlesPicker.defaultProps = {
    languagePriorities: Object.freeze({
        English: 1
    })
};

export default SubtitlesPicker;
