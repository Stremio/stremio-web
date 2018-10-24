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

    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    return (
        <span className={styles['released-date']}>{released.getDate() + ' ' + months[released.getMonth()]}</span>
    );
}

const renderLabel = (isWatched, isUpcoming) => {
    if (!isWatched && !isUpcoming) {
        return null;
    }

    return (
        <div className={styles['label-container']}>
            <span className={styles[isWatched ? 'watched-label' : 'upcoming-label']}>{isWatched ? 'WATCHED' : 'UPCOMING'}</span>
        </div>
    );
}

const renderProgress = (progress) => {
    if (progress <= 0) {
        return null;
    }

    return (
        <div className={styles['progress-container']}>
            <div style={{ width: progress + '%' }} className={styles['progress']}></div>
        </div>
    );
}

const getClassName = (poster, progress) => {
    if (poster.length > 0 && !progress) return 'with-poster';
    if (progress && poster.length === 0) return 'with-progress';
    if (poster.length > 0 && progress) return 'with-poster-progress';
    return 'video';
}

const Video = (props) => {
    return (
        <div onClick={props.onVideoClicked} style={{ padding: props.poster.length > 0 ? '10px 10px' : '10px 16px' }} className={styles[getClassName(props.poster, props.progress)]}>
            {renderPoster(props.poster)}
            {renderNumber(props.number)}
            {renderName(props.name)}
            {renderDuration(props.duration)}
            {renderReleasedDate(props.released)}
            {renderLabel(props.isWatched, props.isUpcoming)}
            {renderProgress(props.progress)}
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