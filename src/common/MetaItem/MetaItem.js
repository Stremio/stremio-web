const React = require('react');
const PropTypes = require('prop-types');
const classnames = require('classnames');
const Icon = require('stremio-icons/dom');
const Button = require('stremio/common/Button');
const useBinaryState = require('stremio/common/useBinaryState');
const Popup = require('stremio/common/Popup');
const styles = require('./styles');

const ICON_FOR_TYPE = Object.assign(Object.create(null), {
    'movie': 'ic_movies',
    'series': 'ic_series',
    'channel': 'ic_channels',
    'tv': 'ic_tv'
});

const MetaItem = React.memo(({ className, id, type, name = '', posterShape = 'square', poster = '', title = '', subtitle = '', progress = 0, playIcon = false, menuOptions = [], onSelect, menuOptionOnSelect, ...props }) => {
    const [menuOpen, openMenu, closeMenu, toggleMenu] = useBinaryState(false);
    const metaItemOnClick = React.useCallback((event) => {
        if (!event.nativeEvent.selectItemPrevented && typeof onSelect === 'function') {
            onSelect(event);
        }
    }, [onSelect]);
    const menuLabelOnClick = React.useCallback((event) => {
        toggleMenu();
        event.nativeEvent.selectItemPrevented = true;
    }, [toggleMenu]);
    const menuOptionOnClick = React.useCallback((event) => {
        if (typeof menuOptionOnSelect === 'function') {
            menuOptionOnSelect(event);
        }

        if (!event.nativeEvent.closeMenuPrevented) {
            closeMenu();
        }

        event.nativeEvent.selectItemPrevented = true;
    }, [menuOptionOnSelect]);
    return (
        <Button {...props} className={classnames(className, styles['meta-item-container'], styles[`poster-shape-${posterShape}`], { 'active': menuOpen })} title={name} data-id={id} onClick={metaItemOnClick}>
            <div className={styles['poster-image-container']}>
                <div className={styles['placeholder-image-layer']}>
                    <Icon className={styles['placeholder-image']} icon={ICON_FOR_TYPE[type] || 'ic_movies'} />
                </div>
                {
                    typeof poster === 'string' && poster.length > 0 ?
                        <div className={styles['poster-image-layer']}>
                            <div className={styles['poster-image']} style={{ backgroundImage: `url('${poster}')` }} />
                        </div>
                        :
                        null
                }
                {
                    playIcon ?
                        <div className={styles['play-icon-layer']}>
                            <svg className={styles['play-icon-container']} viewBox={'0 0 100 100'}>
                                <circle className={styles['play-icon-background']} cx={'50'} cy={'50'} r={'50'} />
                                <svg className={styles['play-icon']} x={'0'} y={'25'} width={'100'} height={'50'} viewBox={'0 0 37.14 32'}>
                                    <path d={'M 9.14,0 37.14,16 9.14,32 Z'} />
                                </svg>
                            </svg>
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
                                    <div className={styles['title']}>{title}</div>
                                    :
                                    null
                            }
                            {
                                Array.isArray(menuOptions) && menuOptions.length > 0 ?
                                    <Popup
                                        open={menuOpen}
                                        onCloseRequest={closeMenu}
                                        renderLabel={(ref) => (
                                            <Button ref={ref} className={classnames(styles['menu-label-container'], { 'active': menuOpen })} tabIndex={-1} onClick={menuLabelOnClick}>
                                                <Icon className={styles['menu-icon']} icon={'ic_more'} />
                                            </Button>
                                        )}
                                        renderMenu={() => (
                                            <div className={styles['menu-container']}>
                                                {menuOptions.map(({ label, type }) => (
                                                    <Button key={type} className={styles['menu-option-container']} data-id={id} data-type={type} onClick={menuOptionOnClick}>
                                                        {label}
                                                    </Button>
                                                ))}
                                            </div>
                                        )}
                                    />
                                    :
                                    null
                            }
                        </div>
                        {
                            typeof subtitle === 'string' && subtitle.length > 0 ?
                                <div className={styles['title-bar-container']}>
                                    <div className={styles['title']}>{subtitle}</div>
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
    id: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    name: PropTypes.string,
    posterShape: PropTypes.oneOf(['poster', 'landscape', 'square']),
    poster: PropTypes.string,
    title: PropTypes.string,
    subtitle: PropTypes.string,
    progress: PropTypes.number,
    playIcon: PropTypes.bool,
    menuOptions: PropTypes.arrayOf(PropTypes.shape({
        label: PropTypes.string.isRequired,
        type: PropTypes.string.isRequired
    })),
    onSelect: PropTypes.func,
    menuOptionOnSelect: PropTypes.func
};

module.exports = MetaItem;
