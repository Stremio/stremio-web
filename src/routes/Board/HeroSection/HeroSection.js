// Copyright (C) 2017-2023 Smart code 203358507

const React = require('react');
const PropTypes = require('prop-types');
const classnames = require('classnames');
const { useTranslation } = require('react-i18next');
const { default: Icon } = require('@stremio/stremio-icons/react');
const { default: Button } = require('stremio/components/Button');
const { default: Image } = require('stremio/components/Image');
const { ICON_FOR_TYPE } = require('stremio/common/CONSTANTS');
const { useStreamingServer } = require('stremio/common');
const styles = require('./styles');

const HeroSection = ({ className, items = [], onPlayClick, onDetailsClick }) => {
    const { t } = useTranslation();
    const streamingServer = useStreamingServer();
    const [currentIndex, setCurrentIndex] = React.useState(0);
    const [hovered, setHovered] = React.useState(false);
    const item = items[currentIndex] || null;

    // Auto-rotate carousel
    React.useEffect(() => {
        if (!items.length || hovered) return;
        const interval = setInterval(() => {
            setCurrentIndex(i => (i < items.length - 1 ? i + 1 : 0));
        }, 4000); // 4s interval
        return () => clearInterval(interval);
    }, [items.length, hovered]);

    const href = React.useMemo(() => {
        return item?.deepLinks?.metaDetailsStreams || item?.deepLinks?.metaDetailsVideos || item?.deepLinks?.player || null;
    }, [item]);

    const handlePlayClick = React.useCallback((event) => {
        event.preventDefault();
        event.stopPropagation();
        if (typeof onPlayClick === 'function') {
            onPlayClick(event, item, currentIndex);
        }
    }, [onPlayClick, item, currentIndex]);

    const handleDetailsClick = React.useCallback((event) => {
        event.preventDefault();
        event.stopPropagation();
        if (typeof onDetailsClick === 'function') {
            onDetailsClick(event, item, currentIndex);
        }
    }, [onDetailsClick, item, currentIndex]);

    const renderPosterFallback = React.useCallback(() => (
        <Icon
            className={styles['placeholder-icon']}
            name={item?.type && ICON_FOR_TYPE.has(item.type)
                ? ICON_FOR_TYPE.get(item.type)
                : ICON_FOR_TYPE.get('other')}
        />
    ), [item]);

    if (!item) {
        return null;
    }

    const releaseInfo = item.releaseInfo || item.released?.getFullYear() || '';
    const typeLabel = item.type ? t(`TYPE_${item.type.toUpperCase()}`) : 'Movie';

    const goPrev = () => setCurrentIndex((i) => (i > 0 ? i - 1 : items.length - 1));
    const goNext = () => setCurrentIndex((i) => (i < items.length - 1 ? i + 1 : 0));

    const handleMouseEnter = () => setHovered(true);
    const handleMouseLeave = () => setHovered(false);

    return (
        <div
            className={classnames(className, styles['hero-section-container'])}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            <div className={styles['hero-background-layer']}>
                <Image
                    className={styles['hero-background-image']}
                    src={item.background || item.poster}
                    alt={' '}
                    renderFallback={renderPosterFallback}
                    enableBlurHash
                />
                <div className={styles['hero-gradient-layer']} />
            </div>
            <div className={styles['hero-content-layer']}>
                <div className={styles['hero-content-container']}>
                    <div className={styles['hero-content-wrapper']}>
                        <h1 className={styles['hero-title']}>
                            {item.name}
                        </h1>
                        <div className={styles['hero-meta-info']}>
                            {releaseInfo && (
                                <span className={styles['meta-badge']}>
                                    {releaseInfo}
                                </span>
                            )}
                            <span className={styles['meta-badge']}>
                                {typeLabel}
                            </span>
                        </div>
                        {item.description && (
                            <p className={styles['hero-description']}>
                                {item.description}
                            </p>
                        )}
                        <div className={styles['hero-buttons']}>
                            <Button
                                className={styles['hero-button-play']}
                                title={t('BUTTON_PLAY')}
                                href={href}
                                onClick={handlePlayClick}
                            >
                                <Icon className={styles['button-icon']} name={'play'} />
                                <span className={styles['button-label']}>{t('BUTTON_PLAY')}</span>
                            </Button>
                            <Button
                                className={styles['hero-button-info']}
                                title={t('BUTTON_DETAILS')}
                                href={href}
                                onClick={handleDetailsClick}
                            >
                                <Icon className={styles['button-icon']} name={'info'} />
                                <span className={styles['button-label']}>{t('BUTTON_DETAILS')}</span>
                                <Icon className={styles['chevron-icon']} name={'chevron-down'} />
                            </Button>
                        </div>
                        {items.length > 1 && hovered && (
                            <div className={styles['hero-carousel-controls']}>
                                <Button className={styles['carousel-prev']} title={t('PREVIOUS')} onClick={goPrev}>
                                    {/* Inline SVG left arrow */}
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M15 6L9 12L15 18" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </Button>
                                <span className={styles['carousel-index']}>
                                    {currentIndex + 1} / {items.length}
                                </span>
                                <Button className={styles['carousel-next']} title={t('NEXT')} onClick={goNext}>
                                    {/* Inline SVG right arrow */}
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M9 6L15 12L9 18" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

HeroSection.propTypes = {
    className: PropTypes.string,
    items: PropTypes.arrayOf(PropTypes.shape({
        name: PropTypes.string,
        poster: PropTypes.string,
        background: PropTypes.string,
        type: PropTypes.string,
        releaseInfo: PropTypes.string,
        released: PropTypes.instanceOf(Date),
        description: PropTypes.string,
        deepLinks: PropTypes.shape({
            metaDetailsStreams: PropTypes.string,
            metaDetailsVideos: PropTypes.string,
            player: PropTypes.string,
        }),
    })),
    onPlayClick: PropTypes.func,
    onDetailsClick: PropTypes.func,
};

module.exports = HeroSection;
