import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Icon, { dataUrl as iconDataUrl } from 'stremio-icons/dom';
import colors from 'stremio-colors';
import { RELATIVE_POSTER_SIZE } from './constants';
import styles from './styles';

class MetadataItem extends PureComponent {
    getPosterSize = () => {
        switch (this.props.posterShape) {
            case 'poster':
                return {
                    width: RELATIVE_POSTER_SIZE,
                    height: RELATIVE_POSTER_SIZE * 1.464
                };
            case 'landscape':
                return {
                    width: RELATIVE_POSTER_SIZE / 0.5625,
                    height: RELATIVE_POSTER_SIZE
                };
            default:
                return {
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

    renderInCinemaLabel() {
        if (!this.props.isInCinema) {
            return null;
        }

        return (
            <div className={styles['in-cinema-container']}>
                <Icon className={styles['in-cinema-icon']} icon={'ic_star'} />
                <span className={styles['in-cinema-label']}>IN CINEMA</span>
            </div>
        );
    }

    renderName() {
        if (this.props.name.length === 0) {
            return null;
        }

        return (
            <span className={styles['name']}>{this.props.name}</span>
        );
    }

    renderYear() {
        if (this.props.year.length === 0) {
            return null;
        }

        return (
            <span className={styles['year']}>{this.props.year}</span>
        );
    }

    render() {
        const posterSize = this.getPosterSize();
        const contentContainerStyle = {
            width: posterSize.width
        };
        const placeholderIcon = this.getPlaceholderIcon();
        const placeholderIconUrl = iconDataUrl({ icon: placeholderIcon, fill: colors.accent, width: Math.round(RELATIVE_POSTER_SIZE / 2.2) });
        const imageStyle = {
            height: posterSize.height,
            backgroundImage: `url(${this.props.posterUrl}), url('${placeholderIconUrl}')`
        };

        return (
            <div className={styles['root-container']}>
                <div style={contentContainerStyle} className={styles['content-container']}>
                    <div style={imageStyle} className={styles['poster']}>
                        {this.renderInCinemaLabel()}
                    </div>
                    {this.renderName()}
                    {this.renderYear()}
                </div>
            </div>
        );
    }
}

MetadataItem.propTypes = {
    type: PropTypes.oneOf(['movie', 'series', 'channel', 'tv', 'other']).isRequired,
    name: PropTypes.string.isRequired,
    posterUrl: PropTypes.string.isRequired,
    posterShape: PropTypes.oneOf(['poster', 'landscape', 'square']).isRequired,
    isInCinema: PropTypes.bool.isRequired,
    year: PropTypes.string.isRequired
};
MetadataItem.defaultProps = {
    type: 'other',
    name: '',
    posterUrl: '',
    posterShape: 'poster',
    isInCinema: false,
    year: ''
};

export default MetadataItem;
