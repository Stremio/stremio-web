import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { dataUrl as iconDataUrl } from 'stremio-icons/dom';
import colors from 'stremio-colors';
import styles from './styles';

class Video extends Component {
    renderPoster() {
        const placeholderIconUrl = iconDataUrl({ icon: 'ic_channels', fill: colors.accent, width: 40, height: 36});
        const imageStyle = {
            width: 70,
            height: 40,
            backgroundImage: `url('${this.props.poster}'), url('${placeholderIconUrl}')`
        };

        if (this.props.poster.length === 0) {
            return null;
        }

        return (
            <div style={imageStyle} className={styles['poster']}></div>
        );
    }

    renderEpisode() {
        if (this.props.episode <= 0) {
            return null;
        }

        return (
            <span className={styles['episode']}>{this.props.episode + '.'}</span>
        );
    }

    renderName() {
        if (this.props.name.length === 0) {
            return null;
        }

        if (this.props.name.length > 50) {
            return (
                <div className={styles['info']}>
                    <div className={styles['name']}>{this.props.name}</div>
                </div>
            );
        }

        return (
            <div className={styles['name']}>{this.props.name}</div>
        );
    }

    renderDuration() {
        if (this.props.duration <= 0) {
            return null;
        }

        return (
            <span className={styles['duration']}>{this.props.duration + ' min'}</span>
        );
    }

    renderWatched() {
        if (!this.props.isWatched) {
            return null;
        }

        return (
            <span className={styles['watched-label']}>WATCHED</span>
        );
    }

    renderReleasedDate() {
        if (isNaN(this.props.released.getTime())) {
            return null;
        }

        return (
            <span className={styles['released-date']}>{this.props.released.toDateString().slice(4, 10)}</span>
        );
    }

    renderUpcoming() {
        if (!this.props.isUpcoming) {
            return null;
        }

        return (
            <span className={styles['upcoming-label']}>UPCOMING</span>
        );
    }

    renderProgress() {
        if (this.props.progress <= 0) {
            return null;
        }

        return (
            <div style={{ width: this.props.poster.length > 0 ? 220 : 300}} className={styles['progress-container']}>
                <div style={{ width: this.props.progress + '%' }} className={styles['progress']}></div>
            </div>
        );
    }

    render() {
        return (
            <div style={{ backgroundColor: this.props.progress ? colors.black40 : null, display: this.props.poster.length > 0 && this.props.progress ? 'flex' : null }} className={styles['video']}>
                {this.renderPoster()}
                <div className={styles['video-container']}>
                    {this.renderEpisode()}
                    {this.renderName()}
                    {this.renderDuration()}
                    {this.renderWatched()}
                    {this.renderReleasedDate()}
                    {this.renderUpcoming()}
                    {this.renderProgress()}
                </div>
            </div>
        );
    }
}

Video.propTypes = {
    poster: PropTypes.string.isRequired,
    episode: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    duration: PropTypes.number.isRequired,
    isWatched: PropTypes.bool.isRequired,
    released: PropTypes.instanceOf(Date).isRequired,
    isUpcoming: PropTypes.bool.isRequired,
    progress: PropTypes.number.isRequired
};
Video.defaultProps = {
    poster: '',
    episode: 0,
    name: '',
    duration: 0,
    isWatched: false,
    released: new Date(''), //Invalid Date
    isUpcoming: false,
    progress: 0
};

export default Video;