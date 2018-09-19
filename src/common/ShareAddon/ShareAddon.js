import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Icon from 'stremio-icons/dom';
import styles from './styles';

class ShareAddon extends Component {
    renderX() {
        return(
            <div className={styles['x-container']}>
                <Icon className={styles['x-icon']} icon={'ic_x'}/>
            </div>
        );
    }

    renderShareLabel() {
        return (
            <span className={styles['share-label']}>Share Add-on</span>
        );
    }

    renderButtons() {
        return (
            <div className={styles['buttons']}>
                <div className={styles['facebook-button']}>
                    <Icon className={styles['facebook-icon']} icon={'ic_facebook'}/>FACEBOOK
                </div>
                <div className={styles['twitter-button']}>
                    <Icon className={styles['twitter-icon']} icon={'ic_twitter'}/>TWITTER
                </div>
                <div className={styles['gplus-button']}>
                    <Icon className={styles['gplus-icon']} icon={'ic_gplus'}/>GOOGLE+
                </div>
            </div>
        );
    }

    renderUrl() {
        if(this.props.url.length === 0) {
            return null;
        }

        return (
            <div className={styles['url-container']}>
                <input className={styles['url']} defaultValue={this.props.url}/>
                <span className={styles['copy-label']}>Copy</span>
            </div>
        );
    }

    render() {
        return (
            <div className={styles['share-addon']}>
                {this.renderX()}
                <div className={styles['info-container']}>
                    {this.renderShareLabel()}
                    {this.renderButtons()}
                    {this.renderUrl()}
                </div>
            </div>
        );
    }
}

ShareAddon.propTypes = {
    url: PropTypes.string.isRequired
};
ShareAddon.defaultProps = {
    url: ''
};

export default ShareAddon;