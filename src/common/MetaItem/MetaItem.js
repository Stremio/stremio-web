import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import Icon from 'stremio-icons/dom';
import styles from './styles';

class MetaItem extends PureComponent {
    renderProgress() {
        if (this.props.progress === 0) {
            return null;
        }

        return (
            <div className={styles['progress-bar-container']}>
                <div className={styles['progress']} style={{ width: `${this.props.progress * 100}%` }} />
            </div>
        );
    }

    renderPoster() {
        const placeholderIcon = this.props.type === 'tv' ? 'ic_tv'
            : this.props.type === 'series' ? 'ic_series'
                : this.props.type === 'channel' ? 'ic_channels'
                    : 'ic_movies';
        return (
            <div className={styles['poster-image-container']}>
                <Icon className={styles['placeholder-image']} icon={placeholderIcon} />
                <div className={styles['poster-image']} style={{ backgroundImage: `url('${this.props.poster}')` }} />
                {this.renderProgress()}
            </div>
        );
    }

    render() {
        return (
            <div className={classnames(styles['meta-item-container'], styles[`relative-size-${this.props.relativeSize}`], styles[`poster-shape-${this.props.posterShape}`], this.props.className)}>
                {this.renderPoster()}
            </div>
        );
    }
}

MetaItem.propTypes = {
    className: PropTypes.string,
    type: PropTypes.string.isRequired,
    relativeSize: PropTypes.oneOf(['auto', 'height']).isRequired,
    posterShape: PropTypes.oneOf(['poster', 'landscape', 'square']).isRequired,
    poster: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    subtitle: PropTypes.string.isRequired,
    progress: PropTypes.number.isRequired,
    released: PropTypes.instanceOf(Date).isRequired,
};
MetaItem.defaultProps = {
    relativeSize: 'auto',
    posterShape: 'square',
    poster: '',
    title: '',
    subtitle: '',
    progress: 0,
    released: new Date(NaN)
};

export default MetaItem;
