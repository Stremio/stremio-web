// Copyright (C) 2017-2023 Smart code 203358507

const React = require('react');
const PropTypes = require('prop-types');
const classnames = require('classnames');
const { default: Icon } = require('@stremio/stremio-icons/react');
const { Image, Button, CONSTANTS } = require('stremio/common');
const styles = require('./styles');

const NextVideoPopup = ({ className, metaItem, nextVideo, onDismiss, onPlayNextVideoRequested }) => {
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
        if (typeof onPlayNextVideoRequested === 'function') {
            onPlayNextVideoRequested();
        }
    }, [onPlayNextVideoRequested]);
    React.useLayoutEffect(() => {
        if (animationEnded === true && watchNowButtonRef.current !== null) {
            watchNowButtonRef.current.focus();
        }
    }, [animationEnded]);
    return (
        <div className={classnames(className, styles['next-video-popup-container'])} onAnimationEnd={onAnimationEnd}>
            <div className={styles['poster-container']}>
                <Image
                    className={styles['poster-image']}
                    src={nextVideo?.thumbnail}
                    alt={' '}
                    fallbackSrc={metaItem?.poster}
                    renderFallback={renderPosterFallback}
                />
            </div>
            <div className={styles['info-container']}>
                <div className={styles['details-container']}>
                    {
                        typeof videoName === 'string' ?
                            <div className={styles['name']}>
                                { videoName }
                            </div>
                            :
                            null
                    }
                    {
                        nextVideo !== null && typeof nextVideo.overview === 'string' ?
                            <div className={styles['description']}>
                                { nextVideo.overview }
                            </div>
                            :
                            null
                    }
                </div>
                <div className={styles['buttons-container']}>
                    <Button className={styles['button-container']} onClick={onDismissButtonClick}>
                        <Icon className={styles['icon']} name={'close'} />
                        <div className={styles['label']}>Dismiss</div>
                    </Button>
                    <Button ref={watchNowButtonRef} className={classnames(styles['button-container'], styles['play-button'])} onClick={onWatchNowButtonClick}>
                        <Icon className={styles['icon']} name={'play'} />
                        <div className={styles['label']}>Watch Now</div>
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
    onPlayNextVideoRequested: PropTypes.func
};

module.exports = NextVideoPopup;
