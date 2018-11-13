import React from 'react';
import PropTypes from 'prop-types';
import { dataUrl as iconDataUrl } from 'stremio-icons/dom';
import colors from 'stremio-colors';
import styles from './styles';

const renderPoster = (poster) => {
    if (poster.length === 0) {
        return null;
    }

    const placeholderIconUrl = iconDataUrl({ icon: 'ic_channels', fill: colors.accent, width: 40, height: 36 });
    const imageStyle = {
        width: 70,
        height: 42,
        backgroundImage: `url('${poster}'), url('${placeholderIconUrl}')`
    };

    return (
        <div style={imageStyle} className={styles['poster']}></div>
    );
}

const renderNumber = (number) => {
    if (number <= 0) {
        return null;
    }

    return (
        <span className={styles['number']}>{number + '.'}</span>
    );
}

const renderName = (name) => {
    if (name.length === 0) {
        return null;
    }

    return (
        <span className={styles['name']}>{name}</span>
    );
}

const renderDuration = (duration) => {
    if (duration <= 0) {
        return null;
    }

    return (
        <span className={styles['duration']}>{duration + ' min'}</span>
    );
}

const renderReleasedDate = (released) => {
    if (isNaN(released.getTime())) {
        return null;
    }

    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    return (
        <span className={styles['released-date']}>{released.getDate() + ' ' + months[released.getMonth()]}</span>
    );
}

const renderWatched = (isWatched) => {
    if (!isWatched) {
        return null;
    }

    return (
        <span className={styles['watched-label']}>WATCHED</span>
    );
}

const renderUpcoming = (isUpcoming) => {
    if (!isUpcoming) {
        return null;
    }

    return (
        <span className={styles['upcoming-label']}>UPCOMING</span>
    );
}

const renderProgress = (poster, progress) => {
    if (progress <= 0) {
        return null;
    }

    return (
        <div style={{ width: poster.length > 0 ? 220 : 300 }} className={styles['progress-container']}>
            <div style={{ width: progress + '%' }} className={styles['progress']}></div>
        </div>
    );
}

const Video = (props) => {
    return (
        <div onClick={props.onVideoClicked} style={{ backgroundColor: props.progress ? colors.black40 : null, display: props.poster.length > 0 && props.progress ? 'flex' : null }} className={styles['video']}>
            {renderPoster(props.poster)}
            <div className={styles['video-container']}>
                <div className={styles['main-info']}>
                    {renderNumber(props.number)}
                    {renderName(props.name)}
                </div>
                {renderDuration(props.duration)}
                {renderReleasedDate(props.released)}
                {renderWatched(props.isWatched)}
                {renderUpcoming(props.isUpcoming)}
                {renderProgress(props.poster, props.progress)}
            </div>
        </div>
    );
}

Video.propTypes = {
    poster: PropTypes.string.isRequired,
    number: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    duration: PropTypes.number.isRequired,
    released: PropTypes.instanceOf(Date).isRequired,
    isWatched: PropTypes.bool.isRequired,
    isUpcoming: PropTypes.bool.isRequired,
    progress: PropTypes.number.isRequired,
    onVideoClicked: PropTypes.func
};
Video.defaultProps = {
    poster: '',
    number: 0,
    name: '',
    duration: 0,
    released: new Date(''), //Invalid Date
    isWatched: false,
    isUpcoming: false,
    progress: 0
};

export default Video;