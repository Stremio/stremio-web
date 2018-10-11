import React from 'react';
import PropTypes from 'prop-types';
import Icon, { dataUrl as iconDataUrl } from 'stremio-icons/dom';
import colors from 'stremio-colors';
import styles from './styles';

const renderX = (closeModalDialog) => {
    const placeholderIconUrl = iconDataUrl({ icon: 'ic_x', fill: colors.neutrallight });
    const imageStyle = {
        width: 10,
        height: 10,
        backgroundImage: `url('${placeholderIconUrl}')`
    };
    return (
        <div className={styles['x-container']}>
            <div onClick={closeModalDialog} style={imageStyle} className={styles['x-icon']} />
        </div>
    );
}

const renderButtons = (shareInFacebook, shareInTwitter, shareInGplus) => {
    return (
        <div className={styles['buttons']}>
            <div onClick={shareInFacebook} className={styles['facebook-button']}>
                <Icon className={styles['facebook-icon']} icon={'ic_facebook'} />FACEBOOK
            </div>
            <div onClick={shareInTwitter} className={styles['twitter-button']}>
                <Icon className={styles['twitter-icon']} icon={'ic_twitter'} />TWITTER
            </div>
            <div onClick={shareInGplus} className={styles['gplus-button']}>
                <Icon className={styles['gplus-icon']} icon={'ic_gplus'} />GOOGLE+
            </div>
        </div>
    );
}

const renderUrl = (copyToClipboard, url) => {
    if (url.length === 0) {
        return null;
    }

    return (
        <div className={styles['url-container']}>
            <input className={styles['url']} defaultValue={url} readOnly />
            <span onClick={copyToClipboard} className={styles['copy-label']}>Copy</span>
        </div>
    );
}

const ShareAddon = (props) => {
    return (
        <div className={styles['share-addon']}>
            {renderX(props.closeModalDialog)}
            <div className={styles['info-container']}>
                <span className={styles['share-label']}>Share Add-on</span>
                {renderButtons(props.shareInFacebook, props.shareInTwitter, props.shareInGplus)}
                {renderUrl(props.copyToClipboard, props.url)}
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
    copyToClipboard: PropTypes.func
};
ShareAddon.defaultProps = {
    url: ''
};

export default ShareAddon;