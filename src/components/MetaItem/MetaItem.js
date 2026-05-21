// Copyright (C) 2017-2023 Smart code 203358507

const React = require('react');
const PropTypes = require('prop-types');
const classnames = require('classnames');
const filterInvalidDOMProps = require('filter-invalid-dom-props').default;
const { default: Icon } = require('@stremio/stremio-icons/react');
const { default: Button } = require('stremio/components/Button');
const { default: Image } = require('stremio/components/Image');
const Multiselect = require('stremio/components/Multiselect');
const useBinaryState = require('stremio/common/useBinaryState');
const { ICON_FOR_TYPE } = require('stremio/common/CONSTANTS');
const styles = require('./styles');
const useMetaDetailsForMetaItem = require('stremio/routes/Board/useMetaDetailsForMetaItem');
const useTranslate = require('stremio/common/useTranslate');

const MetaItem = React.memo(({ className, type, name, poster, posterShape, posterChangeCursor, progress, newVideos, options, deepLinks, dataset, optionOnSelect, onDismissClick, onPlayClick, watched, nextEpisodeReleaseDate, ...props }) => {
    const t = useTranslate();
    const [menuOpen, onMenuOpen, onMenuClose] = useBinaryState(false);
    const [isHovered, setIsHovered] = React.useState(false);
    const [mousePos, setMousePos] = React.useState({ x: 0, y: 0 });
    const hoverTimeoutRef = React.useRef();

    const onMouseEnter = React.useCallback(() => {
        hoverTimeoutRef.current = setTimeout(() => setIsHovered(true), 150);
    }, []);
    const onMouseLeave = React.useCallback(() => {
        clearTimeout(hoverTimeoutRef.current);
        setIsHovered(false);
    }, []);
    const onMouseMove = React.useCallback((event) => {
        setMousePos({ x: event.clientX, y: event.clientY });
    }, []);

    const upcomingDate = useMetaDetailsForMetaItem(
        { id: props.id || props._id || dataset?.id || dataset?._id, type },
        isHovered && (type === 'series' || type === 'tv') && !nextEpisodeReleaseDate
    );

    const displayDate = nextEpisodeReleaseDate || upcomingDate;

    const href = React.useMemo(() => {
        return deepLinks ?
            typeof deepLinks.metaDetailsStreams === 'string' ?
                deepLinks.metaDetailsStreams
                :
                typeof deepLinks.metaDetailsVideos === 'string' ?
                    deepLinks.metaDetailsVideos
                    :
                    typeof deepLinks.player === 'string' ?
                        deepLinks.player
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
    const title = React.useMemo(() => {
        // Suppress native tooltip for series/tv immediately on hover
        // to prevent the browser's native box from appearing during the fetch delay.
        if (isHovered && (type === 'series' || type === 'tv')) {
            return null;
        }
        if (typeof nextEpisodeReleaseDate === 'string' && nextEpisodeReleaseDate.length > 0) {
            return `${name} (${nextEpisodeReleaseDate})`;
        }
        return name;
    }, [name, nextEpisodeReleaseDate, isHovered, type]);
    return (
        <Button
            title={title}
            href={href}
            {...filterInvalidDOMProps(props)}
            className={classnames(className, styles['meta-item-container'], styles['poster-shape-poster'], styles[`poster-shape-${posterShape}`], { 'active': menuOpen })}
            onClick={metaItemOnClick}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
            onMouseMove={onMouseMove}
        >
            <div className={classnames(styles['poster-container'], { 'poster-change-cursor': posterChangeCursor })}>
                {
                    onDismissClick ?
                        <div title={t.string('LIBRARY_RESUME_DISMISS')} className={styles['dismiss-icon-layer']} onClick={onDismissClick}>
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
                        <div title={t.string('CONTINUE_WATCHING')} className={styles['play-icon-layer']} onClick={onPlayClick}>
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
            {
                isHovered && (type === 'series' || type === 'tv') ? (
                    <div
                        className={styles['upcoming-tooltip']}
                        style={{ top: mousePos.y + 15, left: mousePos.x + 15 }}
                    >
                        {name}{displayDate ? ` (${t.string('UPCOMING')}: ${displayDate})` : ''}
                    </div>
                ) : null
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
    nextEpisodeReleaseDate: PropTypes.string
};

module.exports = MetaItem;
