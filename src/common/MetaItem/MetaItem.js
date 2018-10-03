import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Icon, { dataUrl as iconDataUrl } from 'stremio-icons/dom';
import colors from 'stremio-colors';
import { RELATIVE_POSTER_SIZE } from './constants';
import styles from './styles';

class MetaItem extends PureComponent {
    getShapeSize = () => {
        switch (this.props.posterShape) {
            case 'poster':
                return {
                    containerHeight: 290,
                    width: RELATIVE_POSTER_SIZE,
                    height: RELATIVE_POSTER_SIZE * 1.464
                };
            case 'landscape':
                if (this.props.progress) {
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
                if (this.props.progress) {
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

    getPlaceholderIcon = () => {
        switch (this.props.type) {
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

    renderPlay() {
        return (
            <div style={this.props.progress ? { visibility: 'visible' } : null} className={styles['play-container']}>
                <Icon className={styles['play']} icon={'ic_play'} />
            </div>
        );
    }

    renderProgress() {
        if (this.props.progress <= 0) {
            return null;
        }

        return (
            <div className={styles['progress-container']}>
                <div style={{ width: this.props.progress + '%' }} className={styles['progress']}></div>
            </div>
        );
    }

    renderEpisode() {
        if (this.props.episode.length === 0) {
            return null;
        }

        return (
            <div className={styles['episode']}>{this.props.episode}</div>
        );
    }

    renderTitle() {
        if (this.props.title.length === 0) {
            return null;
        }

        return (
            <div className={styles['title']}>{this.props.title}</div>
        );
    }

    renderYear() {
        if (this.props.year.length === 0) {
            return null;
        }

        return (
            <div className={styles['year']}>{this.props.year}</div>
        );
    }

    renderIcon() {
        return (
            <Icon className={styles['more-icon']} icon={'ic_more'} />
        );
    }

    render() {
        const posterSize = this.getShapeSize();
        const contentContainerStyle = {
            width: posterSize.width,
            height: posterSize.containerHeight
        };
        const placeholderIcon = this.getPlaceholderIcon();
        const placeholderIconUrl = iconDataUrl({ icon: placeholderIcon, fill: colors.accent, width: Math.round(RELATIVE_POSTER_SIZE / 2.2), height: Math.round(RELATIVE_POSTER_SIZE / 2.2) });
        const imageStyle = {
            height: posterSize.height,
            backgroundImage: `url(${this.props.poster}), url('${placeholderIconUrl}')`
        };

        return (
            <div style={contentContainerStyle} className={styles['meta-item']}>
                <div style={imageStyle} className={styles['poster']}>
                    {this.renderPlay()}
                </div>
                {this.renderProgress()}
                <div className={styles['info-container']}>
                    <div className={styles['info']}>
                        {this.renderEpisode()}
                        {this.renderTitle()}
                        {this.renderYear()}
                    </div>
                    {this.renderIcon()}
                </div>
            </div>
        );
    }
}

MetaItem.propTypes = {
    type: PropTypes.oneOf(['movie', 'series', 'channel', 'tv', 'other']).isRequired,
    poster: PropTypes.string.isRequired,
    posterShape: PropTypes.oneOf(['poster', 'landscape', 'square']).isRequired,
    progress: PropTypes.number.isRequired,
    episode: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    year: PropTypes.string.isRequired
};
MetaItem.defaultProps = {
    type: 'other',
    poster: '',
    posterShape: 'poster',
    progress: 0,
    episode: '',
    title: '',
    year: ''
};

export default MetaItem;