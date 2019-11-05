const React = require('react');
const PropTypes = require('prop-types');
const classnames = require('classnames');
const Icon = require('stremio-icons/dom');
const Button = require('stremio/common/Button');
const TextInput = require('stremio/common/TextInput');
const styles = require('./styles');

const SharePrompt = ({ className, url }) => {
    const inputRef = React.useRef(null);
    const copyToClipboard = React.useCallback(() => {
        inputRef.current.select();
        document.execCommand('copy');
    }, []);
    return (
        <div className={classnames(className, styles['share-prompt-container'])}>
            <div className={styles['buttons-container']}>
                <Button className={classnames(styles['button-container'], styles['facebook-button'])} href={`https://www.facebook.com/sharer/sharer.php?u=${url}`} target={'_blank'}>
                    <Icon className={styles['icon']} icon={'ic_facebook'} />
                    <div className={styles['label']}>FACEBOOK</div>
                </Button>
                <Button className={classnames(styles['button-container'], styles['twitter-button'])} href={`https://twitter.com/home?status=${url}`} target={'_blank'}>
                    <Icon className={styles['icon']} icon={'ic_twitter'} />
                    <div className={styles['label']}>TWITTER</div>
                </Button>
            </div>
            <div className={styles['url-container']}>
                <TextInput ref={inputRef} className={styles['url-content']} type={'text'} tabIndex={'-1'} defaultValue={url} readOnly />
                <Button className={styles['copy-button']} onClick={copyToClipboard}>
                    <Icon className={styles['icon']} icon={'ic_link'} />
                    <div className={styles['label']}>Copy</div>
                </Button>
            </div>
        </div>
    );
};

SharePrompt.propTypes = {
    className: PropTypes.string,
    url: PropTypes.string.isRequired
};

module.exports = SharePrompt;
