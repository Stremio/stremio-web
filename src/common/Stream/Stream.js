import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Icon from 'stremio-icons/dom';
import colors from 'stremio-colors';
import styles from './styles';

class Stream extends PureComponent {
    renderLogo() {
        if(this.props.logo) {
            return (
                <Icon className={styles['logo']} icon={this.props.logo}/>
            );
        }

        return (
            <div className={styles['source-name']}>{this.props.sourceName}</div>
        );
    }

    renderTitle() {
        if(this.props.title.length === 0) {
            return null;
        }

        return (
            <div className={this.props.title.length > 22 ? styles['long-title'] : styles['title']}>{this.props.title}</div>
        );
    }

    renderSubtitle() {
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

        if(this.props.subtitle) {
            return (
                <div className={styles['subtitle']}>{this.props.subtitle}</div>
            );
        }
        return null;
    }

    renderPlay() {
        return (
            <div style={{backgroundColor: this.props.progress ? colors.white : null}} className={styles['play-container']}>
                <Icon style={{fill: this.props.progress ? colors.medium : null}} className={styles['play']} icon={'ic_play'}/>
            </div>
        );
    }

    renderProgress() {
        if(this.props.progress <= 0) {
            return null;
        }

        return (
            <div className={styles['progress-container']}>
                <div style={{width: this.props.progress + '%'}} className={styles['progress']}></div>
            </div>
        );
    }
    
    render() {
        return (
            <div style={{backgroundColor: this.props.progress ? colors.black40 : null}} className={styles['stream']}>
                <div className={styles['stream-info-container']}>
                    <div className={styles['stream-info']}>
                        {this.renderLogo()}
                        <div className={styles['text-container']}>
                            {this.renderTitle()}
                            {this.renderSubtitle()}
                        </div>
                    </div>
                    {this.renderProgress()}
                </div>
                {this.renderPlay()}
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
    progress: PropTypes.number.isRequired
};

Stream.defaultProps = {
    logo: '',
    sourceName: '',
    title: '',
    subtitle: '',
    isFree: false,
    isSubscription: false,
    progress: 0
};

export default Stream;