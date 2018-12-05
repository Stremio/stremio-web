import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import Icon, { dataUrl as iconDataUrl } from 'stremio-icons/dom';
import colors from 'stremio-colors';
import styles from './styles';

const MAX_TITLE_SYMBOLS = 100;

const renderPoster = (poster) => {
    if (poster.length === 0) {
        return null;
    }

    const placeholderIconUrl = iconDataUrl({ icon: 'ic_channels', fill: colors.accent });
    const imageStyle = {
        backgroundImage: `url('${poster}'), url('${placeholderIconUrl}')`
    };

    return (
        <div style={imageStyle} className={styles['poster']} />
    );
}

const renderTitle = (episode, title) => {
    if (title.length === 0) {
        return null;
    }

    return (
        <div className={styles['title']}>{episode}. {title.length > MAX_TITLE_SYMBOLS ? title.slice(0, MAX_TITLE_SYMBOLS) + '...' : title}</div>
    );
}

const renderReleasedDate = (released) => {
    if (isNaN(released.getTime())) {
        return null;
    }

    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    return (
        <div className={styles['released-date']}>{released.getDate()} {months[released.getMonth()]}</div>
    );
}

const renderUpcomingLabel = (isUpcoming) => {
    if (!isUpcoming) {
        return null;
    }

    return (
        <div className={styles['upcoming-label']}>UPCOMING</div>
    );
}

const renderWatchedLabel = (isWatched) => {
    if (!isWatched) {
        return null;
    }

    return (
        <div className={styles['watched-label']}>WATCHED</div>
    );
}

const renderLabels = (isUpcoming, isWatched) => {
    if (!isWatched && !isUpcoming) {
        return null;
    }

    return (
        <div className={styles['label-container']}>
            {renderUpcomingLabel(isUpcoming)}
            {renderWatchedLabel(isWatched)}
        </div>
    );
}

const renderProgress = (progress) => {
    if (progress <= 0) {
        return null;
    }

    return (
        <div className={styles['progress-container']}>
            <div style={{ width: progress + '%' }} className={styles['progress']} />
        </div>
    );
}

const Video = (props) => {
    return (
        <div onClick={props.onVideoClicked} className={classnames(styles['video-container'], props.className)}>
            <div className={styles['flex-row-container']}>
                {renderPoster(props.poster)}
                <div className={styles['info-container']}>
                    {renderTitle(props.episode, props.title)}
                    {renderReleasedDate(props.released)}
                    {renderLabels(props.isUpcoming, props.isWatched)}
                </div>
                <div className={styles['arrow-container']}>
                    <Icon className={styles['arrow']} icon={'ic_arrow_left'} />
                </div>
            </div>
            {renderProgress(props.progress)}
        </div>
    );
}

Video.propTypes = {
    className: PropTypes.string,
    poster: PropTypes.string.isRequired,
    episode: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
    released: PropTypes.instanceOf(Date).isRequired,
    isWatched: PropTypes.bool.isRequired,
    isUpcoming: PropTypes.bool.isRequired,
    progress: PropTypes.number.isRequired,
    onVideoClicked: PropTypes.func
};
Video.defaultProps = {
    poster: '',
    episode: 0,
    title: '',
    released: new Date(''), //Invalid Date
    isWatched: false,
    isUpcoming: false,
    progress: 0
};

export default Video;
