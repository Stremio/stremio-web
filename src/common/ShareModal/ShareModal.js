import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { Input } from 'stremio-common';
import Icon, { dataUrl as iconDataUrl } from 'stremio-icons/dom';
import colors from 'stremio-colors';
import styles from './styles';

const renderInput = ({ className, href, icon, label }, url) => {
    return (
        <Input className={classnames(styles['button'], styles[className])} type={'link'} href={href + url} target={'_blank'}>
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
            <div onClick={copyToClipboard} className={styles['copy-button']}>
                <Icon className={styles['icon']} icon={'ic_link'} />
                <div className={styles['label']}>Copy</div>
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
                <div style={imageStyle} className={styles['x-icon']} onClick={props.onClose}/>
            </div>
            <div className={styles['info-container']}>
                <div className={styles['share-label']}>Share</div>
                <div className={styles['buttons']}>
                    {renderInput({ className: 'facebook-button', href: 'https://www.facebook.com/sharer/sharer.php?u=', icon: 'ic_facebook', label: 'FACEBOOK' })}
                    {renderInput({ className: 'twitter-button', href: 'https://twitter.com/home?status=', icon: 'ic_twitter', label: 'TWITTER' })}
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
