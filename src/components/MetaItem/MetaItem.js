// Copyright (C) 2017-2023 Smart code 203358507

const React = require('react');
const PropTypes = require('prop-types');
const classnames = require('classnames');
const { useTranslation } = require('react-i18next');
const filterInvalidDOMProps = require('filter-invalid-dom-props').default;
const { default: Icon } = require('@stremio/stremio-icons/react');
const { default: Button } = require('stremio/components/Button');
const { default: Image } = require('stremio/components/Image');
const Multiselect = require('stremio/components/Multiselect');
const HoverPreview = require('stremio/components/HoverPreview');
const useBinaryState = require('stremio/common/useBinaryState');
const { ICON_FOR_TYPE } = require('stremio/common/CONSTANTS');
const styles = require('./styles');

const MetaItem = React.memo(({ className, type, name, poster, posterShape, posterChangeCursor, progress, newVideos, options, deepLinks, dataset, optionOnSelect, onDismissClick, onPlayClick, watched, releaseInfo, runtime, description, genres, rating, ...props }) => {
    const { t } = useTranslation();
    const [menuOpen, onMenuOpen, onMenuClose] = useBinaryState(false);
    const [isHovered, setIsHovered] = React.useState(false);
    const [previewPosition, setPreviewPosition] = React.useState('top-center');
    const itemRef = React.useRef(null);
    
    const calculatePosition = React.useCallback(() => {
        if (!itemRef.current) return 'top-center';
        
        const rect = itemRef.current.getBoundingClientRect();
        const viewportHeight = window.innerHeight;
        const viewportWidth = window.innerWidth;
        
        // Get the preview width (from CSS or use an approximation)
        const previewWidth = 22 * 16; // 22rem in pixels (assuming 1rem = 16px)
        const previewHeight = 200; // Approximate height in pixels
        
        // Calculate vertical position (top or bottom)
        // For items near the top of the screen, show preview below
        // For items near the bottom of the screen, show preview above
        const verticalPos = rect.top < previewHeight + 50 || rect.top < viewportHeight * 0.3 ? 'bottom' : 'top';
        
        // Calculate horizontal position (left, center, or right)
        let horizontalPos = 'center';
        
        // If item is near the left edge, align preview to the left
        if (rect.left < previewWidth / 2 + 20) {
            horizontalPos = 'left';
        } 
        // If item is near the right edge, align preview to the right
        else if (viewportWidth - rect.right < previewWidth / 2 + 20) {
            horizontalPos = 'right';
        }
        
        return `${verticalPos}-${horizontalPos}`;
    }, []);
    
    const handleMouseEnter = React.useCallback(() => {
        const position = calculatePosition();
        setPreviewPosition(position);
        setIsHovered(true);
    }, [calculatePosition]);
    
    const handleMouseLeave = React.useCallback(() => {
        setIsHovered(false);
    }, []);
    
    // Recalculate position on window resize
    React.useEffect(() => {
        if (!isHovered) return;
        
        const handleResize = () => {
            const position = calculatePosition();
            setPreviewPosition(position);
        };
        
        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, [isHovered, calculatePosition]);
    
    const href = React.useMemo(() => {
        return deepLinks ?
            typeof deepLinks.player === 'string' ?
                deepLinks.player
                :
                typeof deepLinks.metaDetailsStreams === 'string' ?
                    deepLinks.metaDetailsStreams
                    :
                    typeof deepLinks.metaDetailsVideos === 'string' ?
                        deepLinks.metaDetailsVideos
                        :
                        null
            :
            null;
    }, [deepLinks]);
    const metaItemOnClick = React.useCallback((event) => {
        if (event.nativeEvent.selectPrevented) {
            event.preventDefault();
        } else if (typeof props.onClick === 'function') {
            props.onClick(event);
        }
    }, [props.onClick]);
    const menuOnClick = React.useCallback((event) => {
        event.nativeEvent.selectPrevented = true;
    }, []);
    const menuOnSelect = React.useCallback((event) => {
        if (typeof optionOnSelect === 'function') {
            optionOnSelect({
                type: 'select-option',
                value: event.value,
                dataset: dataset,
                reactEvent: event.reactEvent,
                nativeEvent: event.nativeEvent
            });
        }
    }, [dataset, optionOnSelect]);
    const renderPosterFallback = React.useCallback(() => (
        <Icon
            className={styles['placeholder-icon']}
            name={ICON_FOR_TYPE.has(type) ? ICON_FOR_TYPE.get(type) : ICON_FOR_TYPE.get('other')}
        />
    ), [type]);
    const renderMenuLabelContent = React.useCallback(() => (
        <Icon className={styles['icon']} name={'more-vertical'} />
    ), []);
    return (
        <Button 
            title={name} 
            href={href} 
            ref={itemRef}
            {...filterInvalidDOMProps(props)} 
            className={classnames(
                className, 
                styles['meta-item-container'], 
                styles['poster-shape-poster'], 
                styles[`poster-shape-${posterShape}`], 
                { 'active': menuOpen },
                { [styles['is-hovered']]: isHovered }
            )} 
            onClick={metaItemOnClick} 
            onMouseEnter={handleMouseEnter} 
            onMouseLeave={handleMouseLeave}
        >
            {isHovered && name && (
                <HoverPreview
                    className={styles['hover-preview']}
                    name={name}
                    type={type}
                    releaseInfo={releaseInfo}
                    runtime={runtime}
                    description={description}
                    genres={genres}
                    rating={rating}
                    position={previewPosition}
                />
            )}
            <div className={classnames(styles['poster-container'], { 'poster-change-cursor': posterChangeCursor })}>
                {
                    onDismissClick ?
                        <div title={t('LIBRARY_RESUME_DISMISS')} className={styles['dismiss-icon-layer']} onClick={onDismissClick}>
                            <Icon className={styles['dismiss-icon']} name={'close'} />
                            <div className={styles['dismiss-icon-backdrop']} />
                        </div>
                        :
                        null
                }
                {
                    watched ?
                        <div className={styles['watched-icon-layer']}>
                            <Icon className={styles['watched-icon']} name={'checkmark'} />
                        </div>
                        :
                        null
                }
                <div className={styles['poster-image-layer']}>
                    <Image
                        className={styles['poster-image']}
                        src={poster}
                        alt={' '}
                        renderFallback={renderPosterFallback}
                    />
                </div>
                {
                    onPlayClick ?
                        <div title={t('CONTINUE_WATCHING')} className={styles['play-icon-layer']} onClick={onPlayClick}>
                            <Icon className={styles['play-icon']} name={'play'} />
                            <div className={styles['play-icon-outer']} />
                            <div className={styles['play-icon-background']} />
                        </div>
                        :
                        null
                }
                {
                    progress > 0 ?
                        <div className={styles['progress-bar-layer']}>
                            <div className={styles['progress-bar']} style={{ width: `${progress}%` }} />
                            <div className={styles['progress-bar-background']} />
                        </div>
                        :
                        null
                }
                {
                    newVideos > 0 ?
                        <div className={styles['new-videos']}>
                            <div className={styles['layer']} />
                            <div className={styles['layer']} />
                            <div className={styles['layer']}>
                                <Icon className={styles['icon']} name={'add'} />
                                <div className={styles['label']}>
                                    {newVideos}
                                </div>
                            </div>
                        </div>
                        :
                        null
                }
            </div>
            {
                (typeof name === 'string' && name.length > 0) || (Array.isArray(options) && options.length > 0) ?
                    <div className={styles['title-bar-container']}>
                        <div className={styles['title-label']}>
                            {typeof name === 'string' && name.length > 0 ? name : ''}
                        </div>
                        {
                            Array.isArray(options) && options.length > 0 ?
                                <Multiselect
                                    className={styles['menu-label-container']}
                                    renderLabelContent={renderMenuLabelContent}
                                    options={options}
                                    onOpen={onMenuOpen}
                                    onClose={onMenuClose}
                                    onSelect={menuOnSelect}
                                    tabIndex={-1}
                                    onClick={menuOnClick}
                                />
                                :
                                null
                        }
                    </div>
                    :
                    null
            }
        </Button>
    );
});

MetaItem.displayName = 'MetaItem';

MetaItem.propTypes = {
    className: PropTypes.string,
    type: PropTypes.string,
    name: PropTypes.string,
    poster: PropTypes.string,
    posterShape: PropTypes.oneOf(['poster', 'landscape', 'square']),
    posterChangeCursor: PropTypes.bool,
    progress: PropTypes.number,
    newVideos: PropTypes.number,
    options: PropTypes.array,
    deepLinks: PropTypes.shape({
        metaDetailsVideos: PropTypes.string,
        metaDetailsStreams: PropTypes.string,
        player: PropTypes.string
    }),
    dataset: PropTypes.object,
    optionOnSelect: PropTypes.func,
    onDismissClick: PropTypes.func,
    onPlayClick: PropTypes.func,
    onClick: PropTypes.func,
    watched: PropTypes.bool,
    // New props for hover preview
    releaseInfo: PropTypes.string,
    runtime: PropTypes.string,
    description: PropTypes.string,
    genres: PropTypes.arrayOf(PropTypes.string),
    rating: PropTypes.string
};

module.exports = MetaItem;
