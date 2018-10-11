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

const renderPlay = (play, progress) => {
    return (
        <div onClick={play} style={progress ? { visibility: 'visible' } : null} className={styles['play-container']}>
            <Icon className={styles['play']} icon={'ic_play'} />
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

const renderIcon = (showInfo, progress) => {
    if (progress > 0) {
        return (
            <div onClick={showInfo} className={styles['more-icon-container']}>
                <Icon className={styles['more-icon']} icon={'ic_more'} />
            </div>
        );
    }
    return null;
}

const MetaItem = (props) => {
    const posterSize = getShapeSize(props.posterShape, props.progress);
    const contentContainerStyle = {
        width: posterSize.width,
        height: props.episode.length === 0 && props.title.length === 0 && props.releaseInfo.length === 0 && props.progress == 0? posterSize.height : posterSize.containerHeight
    };
    const placeholderIcon = getPlaceholderIcon(props.type);
    const placeholderIconUrl = iconDataUrl({ icon: placeholderIcon, fill: colors.accent, width: Math.round(RELATIVE_POSTER_SIZE / 2.2), height: Math.round(RELATIVE_POSTER_SIZE / 2.2) });
    const imageStyle = {
        height: posterSize.height,
        backgroundImage: `url(${props.poster}), url('${placeholderIconUrl}')`
    };

    return (
        <div style={contentContainerStyle} className={styles['meta-item']}>
            <div style={imageStyle} className={styles['poster']}>
                {renderPlay(props.play, props.progress)}
            </div>
            {renderProgress(props.progress)}
            <div className={styles['info-container']}>
                <div className={styles['info']}>
                    {renderEpisode(props.episode)}
                    {renderTitle(props.title)}
                    {renderReleaseInfo(props.releaseInfo)}
                </div>
                {renderIcon(props.showInfo, props.progress)}
            </div>
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
    showInfo: PropTypes.func
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