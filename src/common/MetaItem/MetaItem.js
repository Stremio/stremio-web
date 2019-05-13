const React = require('react');
const PropTypes = require('prop-types');
const classnames = require('classnames');
const { Input } = require('stremio-navigation');
const Icon = require('stremio-icons/dom');
const Popup = require('../Popup');
const styles = require('./styles');

const ICON_FOR_TYPE = Object.freeze({
    'movie': 'ic_movies',
    'series': 'ic_series',
    'channel': 'ic_channels',
    'tv': 'ic_tv'
});

const MetaItem = React.memo(({ className, menuClassName, id, type, posterShape = 'square', poster = '', title = '', subtitle = '', progress = 0, menuOptions = [], onClick, menuOptionOnSelect }) => {
    const menuRef = React.useRef(null);
    const [menuOpen, setMenuOpen] = React.useState(false);
    const onMenuOpen = React.useCallback(() => {
        setMenuOpen(true);
    }, []);
    const onMenuClose = React.useCallback(() => {
        setMenuOpen(false);
    }, []);
    const onContextMenu = React.useCallback((event) => {
        if (menuRef.current !== null && !menuOpen) {
            event.preventDefault();
            menuRef.current.open();
        }
    }, [menuOpen]);
    const placeholderIcon = ICON_FOR_TYPE[type] || 'ic_movies';

    return (
        <Input className={classnames(className, styles['meta-item-container'], styles[`poster-shape-${posterShape}`])} type={'button'} data-meta-item-id={id} onClick={onClick} onContextMenu={onContextMenu}>
            <div className={styles['poster-image-container']}>
                <div className={styles['placeholder-image-container']}>
                    <Icon className={styles['placeholder-image']} icon={placeholderIcon} />
                </div>
                <div className={styles['poster-image']} style={{ backgroundImage: `url('${poster}')` }} />
                <svg className={styles['play-icon-container']} viewBox={'0 0 100 100'}>
                    <circle className={styles['play-icon-background']} cx={'50'} cy={'50'} r={'50'} />
                    <svg className={styles['play-icon']} x={'0'} y={'25'} width={'100'} height={'50'} viewBox={'0 0 37.14 32'}>
                        <path d={'M 9.14,0 37.14,16 9.14,32 Z'} />
                    </svg>
                </svg>
                {
                    progress > 0 ?
                        <div className={styles['progress-bar-container']}>
                            <div className={styles['progress']} style={{ width: `${Math.min(progress, 1) * 100}%` }} />
                        </div>
                        :
                        null
                }
            </div>
            {
                title.length > 0 || subtitle.length > 0 || menuOptions.length > 0 ?
                    <React.Fragment>
                        <div className={styles['title-bar-container']}>
                            <div className={styles['title']}>{title}</div>
                            {
                                menuOptions.length > 0 ?
                                    <Popup ref={menuRef} onOpen={onMenuOpen} onClose={onMenuClose}>
                                        <Popup.Label>
                                            <Icon className={classnames(styles['menu-icon'], { 'active': menuOpen })} icon={'ic_more'} />
                                        </Popup.Label>
                                        <Popup.Menu className={classnames(menuClassName, styles['menu-container'])} tabIndex={-1}>
                                            <div className={styles['menu-items-container']}>
                                                {menuOptions.map(({ label, type }) => (
                                                    <Input key={type} className={styles['menu-item']} type={'button'} data-meta-item-id={id} data-menu-option-type={type} onClick={menuOptionOnSelect}>{label}</Input>
                                                ))}
                                            </div>
                                        </Popup.Menu>
                                    </Popup>
                                    :
                                    null
                            }
                        </div>
                        {
                            subtitle.length > 0 ?
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
        </Input>
    );
});

MetaItem.displayName = 'MetaItem';

MetaItem.propTypes = {
    className: PropTypes.string,
    menuClassName: PropTypes.string,
    id: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    posterShape: PropTypes.oneOf(['poster', 'landscape', 'square']),
    poster: PropTypes.string,
    title: PropTypes.string,
    subtitle: PropTypes.string,
    progress: PropTypes.number,
    menuOptions: PropTypes.arrayOf(PropTypes.shape({
        label: PropTypes.string.isRequired,
        type: PropTypes.string.isRequired
    })),
    onClick: PropTypes.func,
    menuOptionOnSelect: PropTypes.func
};

module.exports = MetaItem;
