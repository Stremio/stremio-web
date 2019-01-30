import React from 'react';
import PropTypes from 'prop-types';
import { Input } from 'stremio-common';
import Icon, { dataUrl as iconDataUrl } from 'stremio-icons/dom';
import colors from 'stremio-colors';
import styles from './styles';

const renderInput = ({ className, href, icon, label }, url) => {
    return (
        <Input className={styles[className]} type={'link'} href={href + url} target={'_blank'}>
            <Icon className={styles['icon']} icon={icon} />{label}
        </Input>
    );
}

const renderUrl = (url) => {
    if (url.length === 0) {
        return null;
    }

    return (
        <div className={styles['url-container']}>
            <input className={styles['url']} defaultValue={url} readOnly={true} />
            <div onClick={copyToClipboard} className={styles['copy-label']}>
                <Icon className={styles['copy-icon']} icon={'ic_link'} />Copy
            </div>
        </div>
    );
}

const copyToClipboard = (event) => {
    event.currentTarget.parentNode.children[0].select();
    document.execCommand('copy');
}

const ShareModal = (props) => {
    const placeholderIconUrl = iconDataUrl({ icon: 'ic_x', fill: colors.surface });
    const imageStyle = {
        backgroundImage: `url('${placeholderIconUrl}')`
    };

    return (
        <div className={styles['share-modal']}>
            <div className={styles['x-container']}>
                <div onClick={props.onClose} style={imageStyle} className={styles['x-icon']} />
            </div>
            <div className={styles['info-container']}>
                <div className={styles['share-label']}>Share</div>
                <div className={styles['buttons']}>
                    {renderInput({ className: 'facebook-button', href: 'https://www.facebook.com/sharer/sharer.php?u=', icon: 'ic_facebook', label: 'FACEBOOK' })}
                    {renderInput({ className: 'twitter-button', href: 'https://twitter.com/home?status=', icon: 'ic_twitter', label: 'TWITTER' })}
                    {renderInput({ className: 'gplus-button', href: 'https://plus.google.com/share?url=', icon: 'ic_gplus', label: 'GOOGLE+' })}
                </div>
                {renderUrl(props.url)}
            </div>
        </div>
    );
}

ShareModal.propTypes = {
    url: PropTypes.string.isRequired,
    onClose: PropTypes.func
};
ShareModal.defaultProps = {
    url: ''
};

export default ShareModal;
