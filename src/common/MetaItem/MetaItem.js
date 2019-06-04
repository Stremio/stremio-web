const React = require('react');
const PropTypes = require('prop-types');
const classnames = require('classnames');
const { Input } = require('stremio-navigation');
const Icon = require('stremio-icons/dom');
const useBinaryState = require('../useBinaryState');
const Popup = require('../Popup');
const styles = require('./styles');

const ICON_FOR_TYPE = Object.freeze({
    'movie': 'ic_movies',
    'series': 'ic_series',
    'channel': 'ic_channels',
    'tv': 'ic_tv'
});

const MetaItem = React.memo(({ className, menuClassName, id, type, name, posterShape = 'square', poster, title, subtitle, progress, playIcon, menuOptions, onClick, menuOptionOnSelect }) => {
    const menuRef = React.useRef(null);
    const [menuOpen, onMenuOpen, onMenuClose] = useBinaryState(false);
    const onContextMenu = React.useCallback((event) => {
        if (!event.ctrlKey && menuRef.current !== null) {
            event.preventDefault();
            menuOpen ? menuRef.current.close() : menuRef.current.open();
        }
    }, [menuOpen]);
    const placeholderIcon = ICON_FOR_TYPE[type] || 'ic_movies';
    return (
        <Input className={classnames(className, styles['meta-item-container'], styles[`poster-shape-${posterShape}`])} title={name} type={'button'} data-id={id} onClick={onClick} onContextMenu={onContextMenu}>
            <div className={styles['poster-image-container']}>
                <div className={styles['placeholder-image-layer']}>
                    <Icon className={styles['placeholder-image']} icon={placeholderIcon} />
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
                        <div className={styles['progress-bar-container']}>
                            <div className={styles['progress']} style={{ width: `${Math.min(progress, 1) * 100}%` }} />
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
                                    <Popup ref={menuRef} onOpen={onMenuOpen} onClose={onMenuClose}>
                                        <Popup.Label>
                                            <Icon className={classnames(styles['menu-icon'], { 'active': menuOpen })} icon={'ic_more'} />
                                        </Popup.Label>
                                        <Popup.Menu className={classnames(menuClassName, styles['menu-container'])} tabIndex={-1}>
                                            <div className={styles['menu-items-container']}>
                                                {menuOptions.map(({ label, type }) => (
                                                    <Input key={type} className={styles['menu-item']} type={'button'} data-id={id} data-type={type} onClick={menuOptionOnSelect}>{label}</Input>
                                                ))}
                                            </div>
                                        </Popup.Menu>
                                    </Popup>
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
        </Input>
    );
});

MetaItem.displayName = 'MetaItem';

MetaItem.propTypes = {
    className: PropTypes.string,
    menuClassName: PropTypes.string,
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
        type: PropTypes.string.isRequired
    })),
    onClick: PropTypes.func,
    menuOptionOnSelect: PropTypes.func
};

module.exports = MetaItem;
