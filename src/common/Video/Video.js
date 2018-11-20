import React from 'react';
import PropTypes from 'prop-types';
import Icon, { dataUrl as iconDataUrl } from 'stremio-icons/dom';
import colors from 'stremio-colors';
import styles from './styles';

const renderPoster = (poster) => {
    if (poster.length === 0) {
        return null;
    }

    const videoWidth = 340;
    const placeholderIconUrl = iconDataUrl({ icon: 'ic_channels', fill: colors.accent, width: '20%', height: videoWidth * 0.13 });
    const imageStyle = {
        backgroundImage: `url('${poster}'), url('${placeholderIconUrl}')`
    };

    return (
        <div style={imageStyle} className={styles['poster']} />
    );
}

const renderTitle = (number, title) => {
    if (title.length === 0) {
        return null;
    }

    return (
        <div className={styles['title']}>{number + '.' + ' ' + title}</div>
    );
}

const renderReleasedDate = (released) => {
    if (isNaN(released.getTime())) {
        return null;
    }

    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    return (
        <div className={styles['released-date']}>{released.getDate() + ' ' + months[released.getMonth()]}</div>
    );
}

const renderUpcomingLabel = (isUpcoming) => {
    if(!isUpcoming) {
        return null;
    }

    return (
        <div className={styles['upcoming-label']}>UPCOMING</div>
    );
}

const renderWatchedLabel = (isWatched) => {
    if(!isWatched) {
        return null;
    }

    return (
        <div className={styles['watched-label']}>WATCHED</div>
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
        <div onClick={props.onVideoClicked} style={{ backgroundColor: props.progress ? colors.black40 : null }} className={styles['video-container']}>
            <div className={styles['video']}>
                {renderPoster(props.poster)}
                <div style={{width: props.poster ? '50%' : '77%' }} className={styles['text-container']}>
                    {renderTitle(props.number, props.title)}
                    {renderReleasedDate(props.released)}
                    <div className={styles['label-container']}>
                        {renderUpcomingLabel(props.isUpcoming)}
                        {renderWatchedLabel(props.isWatched)}
                    </div>
                </div>
                <div className={styles['play-container']}>
                    <Icon style={{ width: props.progress ? '65%' : null, height: props.progress ? '65%' : null,  fill: props.progress ? colors.white : null }} className={styles['play']} icon={'ic_arrow_left'} />
                </div>
            </div>
            {renderProgress(props.progress)}
        </div>
    );
}

Video.propTypes = {
    poster: PropTypes.string.isRequired,
    number: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
    released: PropTypes.instanceOf(Date).isRequired,
    isWatched: PropTypes.bool.isRequired,
    isUpcoming: PropTypes.bool.isRequired,
    progress: PropTypes.number.isRequired,
    onVideoClicked: PropTypes.func
};
Video.defaultProps = {
    poster: '',
    number: 0,
    title: '',
    released: new Date(''), //Invalid Date
    isWatched: false,
    isUpcoming: false,
    progress: 0
};

export default Video;