// Copyright (C) 2017-2023 Smart code 203358507

const React = require('react');
const PropTypes = require('prop-types');
const classnames = require('classnames');
const { default: Icon } = require('@stremio/stremio-icons/react');
const { CONSTANTS, useProfile } = require('stremio/common');
const { Button, Image } = require('stremio/components');
const styles = require('./styles');
const { useTranslation } = require('react-i18next');

const NextVideoPopup = ({ className, metaItem, nextVideo, onDismiss, onNextVideoRequested }) => {
    const { t } = useTranslation();
    const profile = useProfile();
    const blurPosterImage = profile.settings.hideSpoilers && metaItem.type === 'series';
    const watchNowButtonRef = React.useRef(null);
    const [animationEnded, setAnimationEnded] = React.useState(false);
    const videoName = React.useMemo(() => {
        const title = nextVideo && nextVideo.title || metaItem && metaItem.title;
        return nextVideo !== null &&
            typeof nextVideo.season === 'number' &&
            typeof nextVideo.episode === 'number' ?
            `${title} (S${nextVideo.season}E${nextVideo.episode})`
            :
            title;
    }, [metaItem, nextVideo]);
    const onAnimationEnd = React.useCallback(() => {
        setAnimationEnded(true);
    }, []);
    const renderPosterFallback = React.useCallback(() => {
        return metaItem !== null && typeof metaItem.type === 'string' ?
            <Icon
                className={styles['placeholder-icon']}
                name={CONSTANTS.ICON_FOR_TYPE.has(metaItem.type) ? CONSTANTS.ICON_FOR_TYPE.get(metaItem.type) : CONSTANTS.ICON_FOR_TYPE.get('other')}
            />
            :
            null;
    }, [metaItem]);
    const onDismissButtonClick = React.useCallback(() => {
        if (typeof onDismiss === 'function') {
            onDismiss();
        }
    }, [onDismiss]);
    const onWatchNowButtonClick = React.useCallback(() => {
        if (typeof onNextVideoRequested === 'function') {
            onNextVideoRequested();
        }
    }, [onNextVideoRequested]);
    React.useLayoutEffect(() => {
        if (animationEnded === true && watchNowButtonRef.current !== null) {
            watchNowButtonRef.current.focus();
        }
    }, [animationEnded]);
    return (
        <div className={classnames(className, styles['next-video-popup-container'])} onAnimationEnd={onAnimationEnd}>
            <div className={styles['poster-container']}>
                <Image
                    className={classnames(styles['poster-image'], { [styles['blurred']]: blurPosterImage })}
                    src={nextVideo?.thumbnail}
                    alt={' '}
                    fallbackSrc={metaItem?.poster}
                    renderFallback={renderPosterFallback}
                />
            </div>
            <div className={styles['info-container']}>
                <div className={styles['details-container']}>
                    {
                        typeof metaItem?.name === 'string' ?
                            <div className={styles['name']}>
                                <span className={styles['label']}>{t('PLAYER_NEXT_VIDEO_TITLE_SHORT')}</span> { metaItem.name }
                            </div>
                            :
                            null
                    }
                    {
                        typeof videoName === 'string' ?
                            <div className={styles['title']}>
                                { videoName }
                            </div>
                            :
                            null
                    }
                </div>
                <div className={styles['buttons-container']}>
                    <Button className={classnames(styles['button-container'], styles['dismiss'])} onClick={onDismissButtonClick}>
                        <Icon className={styles['icon']} name={'close'} />
                        <div className={styles['label']}>{t('PLAYER_NEXT_VIDEO_BUTTON_DISMISS')}</div>
                    </Button>
                    <Button ref={watchNowButtonRef} className={classnames(styles['button-container'], styles['play-button'])} onClick={onWatchNowButtonClick}>
                        <Icon className={styles['icon']} name={'play'} />
                        <div className={styles['label']}>{t('PLAYER_NEXT_VIDEO_BUTTON_WATCH')}</div>
                    </Button>
                </div>
            </div>
        </div>
    );
};

NextVideoPopup.propTypes = {
    className: PropTypes.string,
    metaItem: PropTypes.object,
    nextVideo: PropTypes.object,
    onDismiss: PropTypes.func,
    onNextVideoRequested: PropTypes.func
};

module.exports = NextVideoPopup;
