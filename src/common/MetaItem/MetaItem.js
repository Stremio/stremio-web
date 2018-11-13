import React from 'react';
import PropTypes from 'prop-types';
import Icon, { dataUrl as iconDataUrl } from 'stremio-icons/dom';
import colors from 'stremio-colors';
import { RELATIVE_POSTER_SIZE } from './constants';
import styles from './styles';

const getShapeSize = (posterShape, progress) => {
    switch (posterShape) {
        case 'poster':
            return {
                width: RELATIVE_POSTER_SIZE
            };
        case 'landscape':
            return {
                width: RELATIVE_POSTER_SIZE / 0.5625
            };
        default:
            if (progress) {
                return {
                    width: RELATIVE_POSTER_SIZE * 1.464
                };
            }
            return {
                width: RELATIVE_POSTER_SIZE
            };
    }
}

const getPlaceholderIcon = (type) => {
    switch (type) {
        case 'tv':
            return 'ic_tv';
        case 'series':
            return 'ic_series';
        case 'channel':
            return 'ic_channels';
        default:
            return 'ic_movies';
    }
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

const renderEpisode = (episode) => {
    if (episode.length === 0) {
        return null;
    }

    return (
        <div className={styles['episode']}>{episode}</div>
    );
}

const renderTitle = (title) => {
    if (title.length === 0) {
        return null;
    }

    return (
        <div className={styles['title']}>{title}</div>
    );
}

const renderReleaseInfo = (releaseInfo) => {
    if (releaseInfo.length === 0) {
        return null;
    }

    return (
        <div className={styles['year']}>{releaseInfo}</div>
    );
}

const renderPopupIcon = (onItemClicked, popup) => {
    if (!popup) {
        return null;
    }
     return (
        <div onClick={onItemClicked} className={styles['popup-icon-container']}>
            <Icon className={styles['popup-icon']} icon={'ic_more'} />
        </div>
    );
}

const getClassName = (progress, posterShape, title, releaseInfo, episode) => {
    if ((progress > 0) && (title.length > 0 || releaseInfo.length > 0 || episode.length > 0)) {
        if (posterShape === 'landscape') return 'progress-info-landscape-shape';
        if (posterShape === 'square') return 'progress-info-square-shape';
        return 'progress-info-poster-shape';
    }
    if ((progress > 0) && (title.length === 0 && releaseInfo.length === 0 && episode.length === 0)) {
        if (posterShape === 'landscape') return 'progress-landscape-shape';
        if (posterShape === 'square') return 'progress-square-shape';
        return 'progress-poster-shape';
    }
    if (!progress && (title.length > 0 || releaseInfo.length > 0 || episode.length > 0)) {
        if (posterShape === 'landscape') return 'info-landscape-shape';
        if (posterShape === 'square') return 'info-square-shape';
        return 'info-poster-shape';
    }
    if (!progress && (title.length === 0 && releaseInfo.length === 0 && episode.length === 0)) {
        if (posterShape === 'landscape') return 'landscape-shape';
        if (posterShape === 'square') return 'square-shape';
        return 'poster-shape';
    }
    return 'meta-item';
}

const MetaItem = (props) => {
    const posterSize = getShapeSize(props.posterShape, props.progress);
    const contentContainerStyle = {
        width: posterSize.width
    };
    const placeholderIcon = getPlaceholderIcon(props.type);
    const placeholderIconUrl = iconDataUrl({ icon: placeholderIcon, fill: colors.accent, width: Math.round(RELATIVE_POSTER_SIZE / 2.2), height: Math.round(RELATIVE_POSTER_SIZE / 2.2) });
    const imageStyle = {
        backgroundImage: `url(${props.poster}), url('${placeholderIconUrl}')`
    };

    return (
        <div style={contentContainerStyle} className={styles[getClassName(props.progress, props.posterShape, props.title, props.releaseInfo, props.episode)]}>
            <div style={imageStyle} className={styles['poster']}>
                <div onClick={props.play} style={props.progress ? { visibility: 'visible' } : null} className={styles['play-container']}>
                    <Icon className={styles['play']} icon={'ic_play'} />
                </div>
            </div>
            {renderProgress(props.progress)}
            <div className={styles['info']}>
                {renderEpisode(props.episode)}
                {renderTitle(props.title)}
                {renderReleaseInfo(props.releaseInfo)}
            </div>
            {renderPopupIcon(props.onItemClicked, props.popup)}
        </div>
    );
}

MetaItem.propTypes = {
    type: PropTypes.oneOf(['movie', 'series', 'channel', 'tv', 'other']).isRequired,
    poster: PropTypes.string.isRequired,
    posterShape: PropTypes.oneOf(['poster', 'landscape', 'square']).isRequired,
    progress: PropTypes.number.isRequired,
    episode: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    releaseInfo: PropTypes.string.isRequired,
    popup: PropTypes.bool.isRequired,
    play: PropTypes.func,
    onItemClicked: PropTypes.func
};
MetaItem.defaultProps = {
    type: 'other',
    poster: '',
    posterShape: 'poster',
    progress: 0,
    episode: '',
    title: '',
    releaseInfo: '',
    popup: false
};

export default MetaItem;