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
                containerHeight: 290,
                width: RELATIVE_POSTER_SIZE,
                height: RELATIVE_POSTER_SIZE * 1.464
            };
        case 'landscape':
            if (progress) {
                return {
                    containerHeight: 290,
                    width: RELATIVE_POSTER_SIZE / 0.5625,
                    height: RELATIVE_POSTER_SIZE * 1.464
                };
            }
            return {
                containerHeight: 210,
                width: RELATIVE_POSTER_SIZE / 0.5625,
                height: RELATIVE_POSTER_SIZE
            };
        default:
            if (progress) {
                return {
                    containerHeight: 290,
                    width: RELATIVE_POSTER_SIZE * 1.464,
                    height: RELATIVE_POSTER_SIZE * 1.464
                };
            }
            return {
                containerHeight: 210,
                width: RELATIVE_POSTER_SIZE,
                height: RELATIVE_POSTER_SIZE
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

const renderIcon = (onItemClicked, progress) => {
    if (progress > 0) {
        return (
            <div onClick={onItemClicked} className={styles['more-icon-container']}>
                <Icon className={styles['more-icon']} icon={'ic_more'} />
            </div>
        );
    }
    return null;
}

const getClassName = (progress, posterShape, title, releaseInfo, episode) => {
    if (title.length > 0 || releaseInfo.length > 0 || episode.length > 0) {
        if (progress > 0) {
            if (posterShape === 'poster') return 'progress-poster-shape';
            if (posterShape === 'landscape') return 'progress-landscape-shape';
            if (posterShape === 'square') return 'progress-square-shape';
        }
        if (!progress) {
            if (posterShape === 'poster') return 'poster-shape';
            if (posterShape === 'landscape') return 'landscape-shape';
            if (posterShape === 'square') return 'square-shape';
        }
    }
    return 'meta-item';
}

const MetaItem = (props) => {
    const posterSize = getShapeSize(props.posterShape, props.progress);
    const contentContainerStyle = {
        width: posterSize.width,
        height: props.episode.length === 0 && props.title.length === 0 && props.releaseInfo.length === 0 && props.progress == 0 ? posterSize.height : posterSize.containerHeight
    };
    const placeholderIcon = getPlaceholderIcon(props.type);
    const placeholderIconUrl = iconDataUrl({ icon: placeholderIcon, fill: colors.accent, width: Math.round(RELATIVE_POSTER_SIZE / 2.2), height: Math.round(RELATIVE_POSTER_SIZE / 2.2) });
    const imageStyle = {
        height: posterSize.height,
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
            {renderIcon(props.onItemClicked, props.progress)}
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
    releaseInfo: ''
};

export default MetaItem;