import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Icon from 'stremio-icons/dom';
import styles from './styles';

class Stream extends Component {
    renderLogo() {
        if(this.props.logo.length === 0 && this.props.sourceName.length === 0){
            return null;
        }

        if(this.props.logo) {
            return (
                <Icon className={styles['logo']} icon={this.props.logo}/>
            );
        }

        return (
            <span className={styles['source-name']}>{this.props.sourceName}</span>
        );
    }

    renderTitle() {
        if(this.props.title.length === 0) {
            return null;
        }

        return (
            <div className={styles['title']}>{this.props.title.split(',').join("\n")}</div>
        );
    }

    renderSubtitle() {
        if(!this.props.isFree && !this.props.isSubscription && !this.props.subtitle){
            return null;
        }

        if(this.props.isFree) {
            return (
                <span className={styles['free-label']}>FREE</span>
            );
        }

        if(this.props.isSubscription) {
            return (
                <span className={styles['subscription-label']}>SUBSCRIPTION</span>
            );
        }

        return (
            <div className={styles['subtitle']}>{this.props.subtitle}</div>
        );
    }

    renderPlay() {
        return (
            <div className={styles['play-container']}>
                <Icon className={styles['play']} icon={'ic_play'}/>
            </div>
        );
    }

    renderProgress() {
        if(this.props.lastWatched) {
            return (
                <div className={styles['progress-container']}>
                    <div className={styles['progress']}></div>
                </div>
            );
        }
    }
    
    render() {
        return (
            <div className={styles['stream']}>
                <div className={styles[this.props.lastWatched ? 'last-watched' : 'stream-item']}>
                    <div className={styles['stream-container']}>
                        <div className={styles['stream-holder']}>
                            <div className={styles['logo-container']}>
                                {this.renderLogo()}
                            </div>
                            <div className={styles['title-container']}>
                                {this.renderTitle()}
                                {this.renderSubtitle()}
                            </div>
                        </div>
                        {this.renderProgress()}
                    </div>
                    {this.renderPlay()}
                </div>
            </div>
        );
    }
}

Stream.propTypes = {
    logo: PropTypes.string.isRequired,
    sourceName: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    subtitle: PropTypes.string.isRequired,
    isFree: PropTypes.bool.isRequired,
    isSubscription: PropTypes.bool.isRequired,
    progress: PropTypes.number.isRequired,
    lastWatched: PropTypes.bool.isRequired
};

Stream.defaultProps = {
    logo: '',
    sourceName: '',
    title: '',
    subtitle: '',
    isFree: false,
    isSubscription: false,
    progress: 0,
    lastWatched: false
};

export default Stream;