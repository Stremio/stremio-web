// Copyright (C) 2017-2023 Smart code 203358507

const React = require('react');
const PropTypes = require('prop-types');
const classnames = require('classnames');
const { useTranslation } = require('react-i18next');
const { default: Icon } = require('@stremio/stremio-icons/react');
const { useRouteFocused } = require('stremio-router');
const { useServices } = require('stremio/services');
const Button = require('stremio/common/Button');
const TextInput = require('stremio/common/TextInput');
const styles = require('./styles');

const SharePrompt = ({ className, url }) => {
    const { t } = useTranslation();
    const { core } = useServices();
    const inputRef = React.useRef(null);
    const routeFocused = useRouteFocused();
    const selectInputContent = React.useCallback(() => {
        if (inputRef.current !== null) {
            inputRef.current.select();
        }
    }, []);
    const copyToClipboard = React.useCallback(() => {
        if (inputRef.current !== null) {
            inputRef.current.select();
            document.execCommand('copy');
        }
    }, []);
    React.useEffect(() => {
        if (routeFocused && inputRef.current !== null) {
            inputRef.current.select();
        }
    }, [routeFocused]);
    React.useEffect(() => {
        core.transport.analytics({
            event: 'Share',
            args: {
                url: url
            }
        });
    }, [url]);
    return (
        <div className={classnames(className, styles['share-prompt-container'])}>
            <div className={styles['buttons-container']}>
                <Button className={classnames(styles['button-container'], styles['facebook-button'])} title={'Facebook'} href={`https://www.facebook.com/sharer/sharer.php?u=${url}`} target={'_blank'}>
                    <Icon className={styles['icon']} name={'facebook'} />
                    <div className={styles['label']}>Facebook</div>
                </Button>
                <Button className={classnames(styles['button-container'], styles['twitter-button'])} title={'Twitter'} href={`https://twitter.com/home?status=${url}`} target={'_blank'}>
                    <Icon className={styles['icon']} name={'ic_twitter'} />
                    <div className={styles['label']}>Twitter</div>
                </Button>
            </div>
            <div className={styles['url-container']}>
                <TextInput
                    ref={inputRef}
                    className={styles['url-text-input']}
                    type={'text'}
                    readOnly={true}
                    defaultValue={url}
                    onClick={selectInputContent}
                    tabIndex={-1}
                />
                <Button className={styles['copy-button']} title={'Copy to clipboard'} onClick={copyToClipboard}>
                    <Icon className={styles['icon']} name={'link'} />
                    <div className={styles['label']}>{ t('COPY') }</div>
                </Button>
            </div>
        </div>
    );
};

SharePrompt.propTypes = {
    className: PropTypes.string,
    url: PropTypes.string
};

module.exports = SharePrompt;
