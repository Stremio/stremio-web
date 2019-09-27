const React = require('react');
const PropTypes = require('prop-types');
const classnames = require('classnames');
const Icon = require('stremio-icons/dom');
const Button = require('stremio/common/Button');
const Image = require('stremio/common/Image');
const PlayIconCircleCentered = require('stremio/common/PlayIconCircleCentered');
const Dropdown = require('stremio/common/Dropdown');
const styles = require('./styles');

const ICON_FOR_TYPE = Object.assign(Object.create(null), {
    'movie': 'ic_movies',
    'series': 'ic_series',
    'channel': 'ic_channels',
    'tv': 'ic_tv',
    'other': 'ic_movies'
});

const MetaItem = React.memo(({ className, id, type, name, posterShape, poster, title, subtitle, progress, playIcon, menuOptions, onSelect, menuOptionOnSelect }) => {
    const [menuOpen, setMenuOpen] = React.useState(false);
    const onOpen = React.useCallback(() => {
        setMenuOpen(true);
    }, []);
    const onClose = React.useCallback(() => {
        setMenuOpen(false);
    }, []);
    const metaItemOnClick = React.useCallback((event) => {
        if (!event.nativeEvent.selectMetaItemPrevented && typeof onSelect === 'function') {
            onSelect(event);
        }
    }, [onSelect]);
    const menuOnClick = React.useCallback((event) => {
        event.nativeEvent.selectMetaItemPrevented = true;
    }, []);
    return (
        <Button className={classnames(className, styles['meta-item-container'], styles['poster-shape-poster'], styles[`poster-shape-${posterShape}`], { 'active': menuOpen })} title={name} data-id={id} onClick={metaItemOnClick}>
            <div className={styles['poster-container']}>
                <div className={styles['poster-image-layer']}>
                    <Image
                        className={styles['poster-image-container']}
                        src={poster}
                        alt={' '}
                        id={id}
                        renderFallback={() => (
                            <Icon
                                className={styles['placeholder-icon']}
                                icon={typeof ICON_FOR_TYPE[type] === 'string' ? ICON_FOR_TYPE[type] : ICON_FOR_TYPE['other']}
                            />
                        )}
                    />
                </div>
                {
                    playIcon ?
                        <div className={styles['play-icon-layer']}>
                            <PlayIconCircleCentered className={styles['play-icon']} />
                        </div>
                        :
                        null
                }
                {
                    progress > 0 ?
                        <div className={styles['progress-bar-layer']}>
                            <div className={styles['progress-bar']} style={{ width: `${Math.min(progress, 1) * 100}%` }} />
                        </div>
                        :
                        null
                }
            </div>
            {
                (typeof title === 'string' && title.length > 0) || (typeof subtitle === 'string' && subtitle.length > 0) || (Array.isArray(menuOptions) && menuOptions.length > 0) ?
                    <React.Fragment>
                        <div className={styles['title-bar-container']}>
                            {
                                typeof title === 'string' && title.length > 0 ?
                                    <div className={styles['title-label']}>{title}</div>
                                    :
                                    null
                            }
                            {
                                Array.isArray(menuOptions) && menuOptions.length > 0 ?
                                    <div className={styles['dropdown-menu-container']} onClick={menuOnClick}>
                                        <Dropdown
                                            className={styles['menu-label-container']}
                                            menuClassName={styles['menu-container']}
                                            menuMatchLabelWidth={false}
                                            renderLabel={() => (
                                                <Icon className={styles['menu-icon']} icon={'ic_more'} />
                                            )}
                                            options={menuOptions}
                                            tabIndex={-1}
                                            onOpen={onOpen}
                                            onClose={onClose}
                                            onSelect={menuOptionOnSelect}
                                        />
                                    </div>
                                    :
                                    null
                            }
                        </div>
                        {
                            typeof subtitle === 'string' && subtitle.length > 0 ?
                                <div className={styles['title-bar-container']}>
                                    <div className={styles['title-label']}>{subtitle}</div>
                                </div>
                                :
                                null
                        }
                    </React.Fragment>
                    :
                    null
            }
        </Button>
    );
});

MetaItem.displayName = 'MetaItem';

MetaItem.propTypes = {
    className: PropTypes.string,
    id: PropTypes.string,
    type: PropTypes.string,
    name: PropTypes.string,
    posterShape: PropTypes.oneOf(['poster', 'landscape', 'square']),
    poster: PropTypes.string,
    title: PropTypes.string,
    subtitle: PropTypes.string,
    progress: PropTypes.number,
    playIcon: PropTypes.bool,
    menuOptions: PropTypes.arrayOf(PropTypes.shape({
        label: PropTypes.string.isRequired,
        value: PropTypes.string.isRequired
    })),
    onSelect: PropTypes.func,
    menuOptionOnSelect: PropTypes.func
};

module.exports = MetaItem;
