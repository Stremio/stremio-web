const React = require('react');
const PropTypes = require('prop-types');
const classnames = require('classnames');
const Icon = require('stremio-icons/dom');
const { useRouteFocused } = require('stremio-router');
const Button = require('stremio/common/Button');
const TextInput = require('stremio/common/TextInput');
const styles = require('./styles');

const SharePrompt = ({ className, label, url, close, onClick }) => {
    const inputRef = React.useRef(null);
    const focusable = useRouteFocused();
    const copyToClipboard = React.useCallback(() => {
        inputRef.current.select();
        document.execCommand('copy');
    }, []);
    React.useEffect(() => {
        const onKeyUp = (event) => {
            if (event.key === 'Escape' && typeof close === 'function') {
                close();
            }
        };
        if (focusable) {
            window.addEventListener('keyup', onKeyUp);
        }
        return () => {
            window.removeEventListener('keyup', onKeyUp);
        };
    }, [close, focusable]);
    return (
        <div className={classnames(className, styles['share-prompt-container'])} onClick={onClick}>
            <Button className={styles['close-button-container']} title={'Close'} tabIndex={-1} onClick={close}>
                <Icon className={styles['icon']} icon={'ic_x'} />
            </Button>
            <div className={styles['share-prompt-content']}>
                <div className={styles['share-prompt-label']}>{label}</div>
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
        </div>
    );
};

SharePrompt.propTypes = {
    className: PropTypes.string,
    label: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired,
    close: PropTypes.func,
    onClick: PropTypes.func
};

module.exports = SharePrompt;
