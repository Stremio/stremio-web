const React = require('react');
const PropTypes = require('prop-types');
const classnames = require('classnames');
const Icon = require('stremio-icons/dom');
const Button = require('stremio/common/Button');
const TextInput = require('stremio/common/TextInput');
const styles = require('./styles');

const SharePrompt = (props) => {
    const inputRef = React.useRef(null);
    const copyToClipboard = () => {
        inputRef.current.select();
        document.execCommand('copy');
    };

    if (props.url.length === 0) {
        return null;
    }

    return (
        <div className={classnames(props.className, styles['share-prompt'])}>
            <Button className={styles['x-container']}>
                <Icon className={styles['icon']} icon={'ic_x'} onClick={props.onClose} />
            </Button>
            <div className={styles['info-container']}>
                <div className={styles['share-label']}>Share</div>
                <div className={styles['buttons']}>
                    <Button className={classnames(styles['button'], styles['facebook-button'])} href={`https://www.facebook.com/sharer/sharer.php?u=${props.url}`} target={'_blank'}>
                        <Icon className={styles['icon']} icon={'ic_facebook'} />FACEBOOK
                    </Button>
                    <Button className={classnames(styles['button'], styles['twitter-button'])} href={`https://www.facebook.com/sharer/sharer.php?u=${props.url}`} target={'_blank'}>
                        <Icon className={styles['icon']} icon={'ic_twitter'} />TWITTER
                    </Button>
                </div>
                <div className={styles['url-container']}>
                    <TextInput ref={inputRef} className={styles['url']} type={'text'} tabIndex={'-1'} defaultValue={props.url} readOnly />
                    <Button className={styles['copy-button']} onClick={copyToClipboard}>
                        <Icon className={styles['icon']} icon={'ic_link'} />
                        <div className={styles['label']}>Copy</div>
                    </Button>
                </div>
            </div>
        </div>
    );
};

SharePrompt.propTypes = {
    className: PropTypes.string,
    url: PropTypes.string.isRequired,
    onClose: PropTypes.func
};
SharePrompt.defaultProps = {
    url: ''
};

module.exports = SharePrompt;
