import React from 'react';
import PropTypes from 'prop-types';
import Icon from 'stremio-icons/dom';
import styles from './styles';

const renderX = (props) => {
    return (
        <div onClick={props.closeModalDialog} className={styles['x-container']}>
            <Icon className={styles['x-icon']} icon={'ic_x'} />
        </div>
    );
}

const renderButtons = (props) => {
    return (
        <div className={styles['buttons']}>
            <div onClick={props.shareInFacebook} className={styles['facebook-button']}>
                <Icon className={styles['facebook-icon']} icon={'ic_facebook'} />FACEBOOK
            </div>
            <div onClick={props.shareInTwitter} className={styles['twitter-button']}>
                <Icon className={styles['twitter-icon']} icon={'ic_twitter'} />TWITTER
            </div>
            <div onClick={props.shareInGplus} className={styles['gplus-button']}>
                <Icon className={styles['gplus-icon']} icon={'ic_gplus'} />GOOGLE+
            </div>
        </div>
    );
}

const renderUrl = (props, url) => {
    if (url.length === 0) {
        return null;
    }

    return (
        <div className={styles['url-container']}>
            <input className={styles['url']} defaultValue={url} readOnly />
            <span onClick={props.copyUrl} className={styles['copy-label']}>Copy</span>
        </div>
    );
}

const ShareAddon = (props) => {
    return (
        <div className={styles['share-addon']}>
            {renderX(props)}
            <div className={styles['info-container']}>
                <span className={styles['share-label']}>Share Add-on</span>
                {renderButtons(props)}
                {renderUrl(props, props.url)}
            </div>
        </div>
    );
}

ShareAddon.propTypes = {
    url: PropTypes.string.isRequired,
    closeModalDialog: PropTypes.func,
    shareInFacebook: PropTypes.func,
    shareInTwitter: PropTypes.func,
    shareInGplus: PropTypes.func,
    copyUrl: PropTypes.func
};
ShareAddon.defaultProps = {
    url: ''
};

export default ShareAddon;