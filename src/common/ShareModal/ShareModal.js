import React, { useRef } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { Input, Modal } from 'stremio-common';
import Icon from 'stremio-icons/dom';
import styles from './styles';

const renderInput = ({ className, href, icon, label }) => {
    return (
        <Input className={classnames(styles['button'], className)} type={'link'} href={href} target={'_blank'}>
            <Icon className={styles['icon']} icon={icon} />{label}
        </Input>
    );
};

const renderUrl = (url) => {
    const inputRef = useRef(null);
    const copyToClipboard = () => {
        inputRef.current.select();
        document.execCommand('copy');
    };

    if (url.length === 0) {
        return null;
    }

    return (
        <div className={styles['url-container']}>
            <input ref={inputRef} className={styles['url']} type={'text'} tabIndex={'-1'} defaultValue={url} readOnly />
            <div className={styles['copy-button']} onClick={copyToClipboard}>
                <Icon className={styles['icon']} icon={'ic_link'} />
                <div className={styles['label']}>Copy</div>
            </div>
        </div>
    );
};

const ShareModal = (props) => {
    return (
        <Modal>
            <div className={styles['share-modal']}>
                <div className={styles['x-container']}>
                    <Icon className={styles['icon']} icon={'ic_x'} onClick={props.onClose} />
                </div>
                <div className={styles['info-container']}>
                    <div className={styles['share-label']}>Share</div>
                    <div className={styles['buttons']}>
                        {renderInput({ className: styles['facebook-button'], href: `https://www.facebook.com/sharer/sharer.php?u=${props.url}`, icon: 'ic_facebook', label: 'FACEBOOK' })}
                        {renderInput({ className: styles['twitter-button'], href: `https://twitter.com/home?status=${props.url}`, icon: 'ic_twitter', label: 'TWITTER' })}
                    </div>
                    {renderUrl(props.url)}
                </div>
            </div>
        </Modal>
    );
};

ShareModal.propTypes = {
    url: PropTypes.string.isRequired,
    onClose: PropTypes.func
};
ShareModal.defaultProps = {
    url: ''
};

export default ShareModal;
