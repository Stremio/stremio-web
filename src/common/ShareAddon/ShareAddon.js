import React from 'react';
import PropTypes from 'prop-types';
import Icon, { dataUrl as iconDataUrl } from 'stremio-icons/dom';
import colors from 'stremio-colors';
import styles from './styles';

const renderUrl = (copyToClipboard, url) => {
    if (url.length === 0) {
        return null;
    }

    return (
        <div className={styles['url-container']}>
            <input className={styles['url']} defaultValue={url} readOnly />
            <div onClick={copyToClipboard} className={styles['copy-container']}>
                <Icon className={styles['copy-icon']} icon={'ic_link'} />
                <span className={styles['copy-label']}>Copy</span>
            </div>
        </div>
    );
}

const ShareAddon = (props) => {
    const placeholderIconUrl = iconDataUrl({ icon: 'ic_x', fill: colors.neutrallight });
    const imageStyle = {
        backgroundImage: `url('${placeholderIconUrl}')`
    };

    return (
        <div className={styles['share-addon']}>
            <div onClick={props.closeModalDialog} style={imageStyle} className={styles['x-icon']} />
            <span className={styles['share-label']}>Share Add-on</span>
            <div onClick={props.shareInFacebook} className={styles['facebook-button']}>
                <Icon className={styles['facebook-icon']} icon={'ic_facebook'} />FACEBOOK
            </div>
            <div onClick={props.shareInTwitter} className={styles['twitter-button']}>
                <Icon className={styles['twitter-icon']} icon={'ic_twitter'} />TWITTER
            </div>
            <div onClick={props.shareInGplus} className={styles['gplus-button']}>
                <Icon className={styles['gplus-icon']} icon={'ic_gplus'} />GOOGLE+
            </div>
            {renderUrl(props.copyToClipboard, props.url)}
        </div>
    );
}

ShareAddon.propTypes = {
    url: PropTypes.string.isRequired,
    closeModalDialog: PropTypes.func,
    shareInFacebook: PropTypes.func,
    shareInTwitter: PropTypes.func,
    shareInGplus: PropTypes.func,
    copyToClipboard: PropTypes.func
};
ShareAddon.defaultProps = {
    url: ''
};

export default ShareAddon;
