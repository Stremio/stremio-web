// Copyright (C) 2017-2023 Smart code 203358507

const React = require('react');
const PropTypes = require('prop-types');
const classnames = require('classnames');
const { useTranslation } = require('react-i18next');
const { default: Icon } = require('@stremio/stremio-icons/react');
const { useRouteFocused } = require('stremio-router');
const { useServices } = require('stremio/services');
const { Button } = require('stremio/components');
const { default: TextInput } = require('stremio/components/TextInput');
const useToast = require('stremio/common/Toast/useToast');
const styles = require('./styles');

const SharePrompt = ({ className, url }) => {
    const { t } = useTranslation();
    const { core } = useServices();
    const toast = useToast();
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
            toast.show({
                type: 'success',
                title: 'Copied to clipboard',
                timeout: 3000,
            });
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
                </Button>
                <Button className={classnames(styles['button-container'], styles['x-button'])} title={'X (Twitter)'} href={`https://twitter.com/intent/tweet?text=${url}`} target={'_blank'}>
                    <Icon className={styles['icon']} name={'x'} />
                </Button>
                <Button className={classnames(styles['button-container'], styles['reddit-button'])} title={'Reddit'} href={`https://www.reddit.com/submit?url=${url}`} target={'_blank'}>
                    <Icon className={styles['icon']} name={'reddit'} />
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
                <Button className={styles['copy-button']} title={t('CTX_COPY_TO_CLIPBOARD')} onClick={copyToClipboard}>
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
