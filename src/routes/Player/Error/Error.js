// Copyright (C) 2017-2023 Smart code 203358507

const React = require('react');
const { useTranslation } = require('react-i18next');
const PropTypes = require('prop-types');
const classNames = require('classnames');
const { default: Icon } = require('@stremio/stremio-icons/react');
const Button = require('stremio/common/Button');
const styles = require('./styles');

const Error = ({ className, code, message, stream }) => {
    const { t } = useTranslation();

    const [playlist, fileName] = React.useMemo(() => {
        return [
            stream?.deepLinks?.externalPlayer?.playlist,
            stream?.deepLinks?.externalPlayer?.fileName,
        ];
    }, [stream]);

    return (
        <div className={classNames(className, styles['error'])}>
            <div className={styles['error-label']} title={message}>{message}</div>
            {
                code === 2 ?
                    <div className={styles['error-sub']} title={t('EXTERNAL_PLAYER_HINT')}>{t('EXTERNAL_PLAYER_HINT')}</div>
                    :
                    null
            }
            {
                playlist && fileName ?
                    <Button
                        className={styles['playlist-button']}
                        title={t('PLAYER_OPEN_IN_EXTERNAL')}
                        href={playlist}
                        download={fileName}
                        target={'_blank'}
                    >
                        <Icon className={styles['icon']} name={'ic_downloads'} />
                        <div className={styles['label']}>{t('PLAYER_OPEN_IN_EXTERNAL')}</div>
                    </Button>
                    :
                    null
            }
        </div>
    );
};

Error.propTypes = {
    className: PropTypes.string,
    code: PropTypes.number,
    message: PropTypes.string,
    stream: PropTypes.object,
};

module.exports = Error;
