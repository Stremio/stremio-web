import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import styles from './styles';

const ORIGIN_PRIORITIES = {
    'Local': 1,
    'Embedded': 2
};
const LABEL_PRIORITIES = {
    'English': 1,
    'Brazil': 2
};
const subtitlesComparator = (PRIORITIES) => {
    return (a, b) => {
        const valueA = PRIORITIES[a];
        const valueB = PRIORITIES[b];
        if (!isNaN(valueA) && !isNaN(valueB)) return valueA - valueB;
        if (!isNaN(valueA)) return -1;
        if (!isNaN(valueB)) return 1;
        return a - b;
    }
};

const SubtitlesPicker = ({ className, subtitleTracks, selectedSubtitleTrackId, setSelectedSubtitleTrackId }) => {
    const groupedSubtitleTracks = subtitleTracks.reduce((result, track) => {
        result[track.origin] = result[track.origin] || {};
        result[track.origin][track.label] = result[track.origin][track.label] || [];
        result[track.origin][track.label].push(track);
        return result;
    }, {});
    const toggleOnClick = () => {
        setSelectedSubtitleTrackId(selectedSubtitleTrackId === null ? subtitleTracks[0].id : null);
    };

    return (
        <div className={classnames(className, styles['subtitles-picker-container'])}>
            <div className={styles['toggle-button-container']} onClick={toggleOnClick}>
                <div className={styles['toggle-label']}>ON</div>
                <div className={styles['toggle-label']}>OFF</div>
                <div className={classnames(styles['toggle-thumb'], selectedSubtitleTrackId !== null ? styles['on'] : styles['off'])} />
            </div>
            <div className={styles['languages-container']}>
                {
                    Object.keys(groupedSubtitleTracks)
                        .sort(subtitlesComparator(ORIGIN_PRIORITIES))
                        .map((origin) => {
                            return (
                                <Fragment key={origin}>
                                    <div className={styles['language-origin']}>{origin}</div>
                                    {
                                        Object.keys(groupedSubtitleTracks[origin])
                                            .sort(subtitlesComparator(LABEL_PRIORITIES))
                                            .map((label) => (
                                                <div key={label} className={classnames(styles['language-label'], { [styles['selected']]: selectedSubtitleTrackId === label.id })}>{label}</div>
                                            ))
                                    }
                                </Fragment>
                            );
                        })
                }
            </div>
            <div className={styles['preferences-container']} />
        </div>
    );
};

SubtitlesPicker.propTypes = {
    className: PropTypes.string,
    selectedSubtitleTrackId: PropTypes.string,
    subtitleTracks: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.string.isRequired,
        label: PropTypes.string.isRequired,
        origin: PropTypes.string.isRequired
    })).isRequired,
    setSelectedSubtitleTrackId: PropTypes.func.isRequired
};

export default SubtitlesPicker;
