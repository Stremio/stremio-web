import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './styles';

class Episode extends Component {
    renderNumber() {
        if(this.props.number <= 0){
            return null;
        }

        if(this.props.number > 0) {
            return (
                <span className={styles['number']}>{this.props.number + '.'}</span>
            );
        }
    }

    renderName() {
        if(this.props.name.length === 0){
            return null;
        }

        return (
            <span className={styles['name']}>{this.props.name}</span>
        );
    }

    renderProgress() {
        if(this.props.lastWatched) {
            return (
                <div className={styles['episode-last']}>
                    <div className={styles['progress']}></div>
                </div>
            );
        }
    }

    renderState() {
        if(this.props.isUpcoming) {
            return (
                <div className={styles['episode-upcoming']}>
                    <span className={styles['date']}>{this.props.date}</span>
                    <span className={styles['upcoming-label']}>UPCOMING</span>
                </div>
            );
        }

        if(this.props.isWatched) {
            return (
                <div className={styles['episode-watched']}>
                    <span className={styles['duration']}>{this.props.duration + ' min'}</span>
                    <span className={styles['watched-label']}>WATCHED</span>
                </div>
            );
        }

        return (
            <div className={styles['episode-duration']}>
                <span className={styles['duration']}>{this.props.duration + ' min'}</span>
            </div>
        );
    }

    render() {
        return (
            <div className={styles['episode']}>
                <div className={styles[this.props.lastWatched ? 'last-watched' : null]}>
                    <div className={styles['episode-container']}>
                        {this.renderNumber()}
                        {this.renderName()}
                        {this.renderState()}
                        {this.renderProgress()}
                    </div>
                </div>
            </div>
        );
    }
}

Episode.propTypes = {
    number: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    duration: PropTypes.number.isRequired,
    isWatched: PropTypes.bool.isRequired,
    date: PropTypes.string.isRequired,
    isUpcoming: PropTypes.bool.isRequired,
    progress: PropTypes.number.isRequired,
    lastWatched: PropTypes.bool.isRequired
};
Episode.defaultProps = {
    number: 0,
    name: '',
    duration: 0,
    isWatched: false,
    date: '',
    isUpcoming: false,
    progress: 0,
    lastWatched: false
};

export default Episode;