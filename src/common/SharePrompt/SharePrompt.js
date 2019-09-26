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
        <div className={classnames(props.className, styles['share-prompt-container'])}>
            <Button className={styles['close-button-container']}>
                <Icon className={styles['icon']} icon={'ic_x'} onClick={props.onClose} />
            </Button>
            <div className={styles['share-prompt-content']}>
                <div className={styles['share-prompt-label']}>{props.label}</div>
                <div className={styles['buttons-container']}>
                    <Button className={classnames(styles['button-container'], styles['facebook-button'])} href={`https://www.facebook.com/sharer/sharer.php?u=${props.url}`} target={'_blank'}>
                        <Icon className={styles['icon']} icon={'ic_facebook'} />FACEBOOK
                    </Button>
                    <Button className={classnames(styles['button-container'], styles['twitter-button'])} href={`https://www.facebook.com/sharer/sharer.php?u=${props.url}`} target={'_blank'}>
                        <Icon className={styles['icon']} icon={'ic_twitter'} />TWITTER
                    </Button>
                </div>
                <div className={styles['url-container']}>
                    <TextInput ref={inputRef} className={styles['url-content']} type={'text'} tabIndex={'-1'} defaultValue={props.url} readOnly />
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
    label: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired,
    onClose: PropTypes.func
};
SharePrompt.defaultProps = {
    label: 'Share',
    url: ''
};

module.exports = SharePrompt;
