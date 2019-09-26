const React = require('react');
const PropTypes = require('prop-types');
const classnames = require('classnames');
const Icon = require('stremio-icons/dom');
const Button = require('stremio/common/Button');
const TextInput = require('stremio/common/TextInput');
const styles = require('./styles');

const renderInput = ({ className, href, icon, label }) => {
    return (
        <Button className={classnames(styles['button'], className)} type={'link'} href={href} target={'_blank'}>
            <Icon className={styles['icon']} icon={icon} />{label}
        </Button>
    );
};

const renderUrl = (url) => {
    const inputRef = React.useRef(null);
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
            <Button className={styles['copy-button']} type={'button'} onClick={copyToClipboard}>
                <Icon className={styles['icon']} icon={'ic_link'} />
                <div className={styles['label']}>Copy</div>
            </Button>
        </div>
    );
};

const ShareModal = (props) => {
    return (
        <div className={styles['share-modal']}>
            <Button className={styles['x-container']} type={'button'}>
                <Icon className={styles['icon']} icon={'ic_x'} onClick={props.onClose} />
            </Button>
            <div className={styles['info-container']}>
                <div className={styles['share-label']}>Share</div>
                <div className={styles['buttons']}>
                    {renderInput({ className: styles['facebook-button'], href: `https://www.facebook.com/sharer/sharer.php?u=${props.url}`, icon: 'ic_facebook', label: 'FACEBOOK' })}
                    {renderInput({ className: styles['twitter-button'], href: `https://twitter.com/home?status=${props.url}`, icon: 'ic_twitter', label: 'TWITTER' })}
                </div>
                {renderUrl(props.url)}
            </div>
        </div>
    );
};

ShareModal.propTypes = {
    url: PropTypes.string.isRequired,
    onClose: PropTypes.func
};
ShareModal.defaultProps = {
    url: ''
};

module.exports = ShareModal;
