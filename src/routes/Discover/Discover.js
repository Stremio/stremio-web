const React = require('react');
const classnames = require('classnames');
const { Input } = require('stremio-navigation');
const Icon = require('stremio-icons/dom');
const { NavBar, MetaItem, Popup, useBinaryState } = require('stremio-common');
const useCatalog = require('./useCatalog');
const styles = require('./styles');

// TODO impl refocus to left of the scroll view
const Discover = ({ urlParams }) => {
    const catalog = useCatalog(urlParams);
    const [typePickerOpen, typePickerOnOpen, typePickerOnClose] = useBinaryState(false);
    const [catalogPickerOpen, catalogPickerOnOpen, catalogPickerOnClose] = useBinaryState(false);
    const [categoryPickerOpen, categoryPickerOnOpen, categoryPickerOnClose] = useBinaryState(false);
    React.useEffect(() => {
        if (typeof urlParams.type !== 'string' || typeof urlParams.catalog !== 'string') {
            const type = urlParams.type || 'movie';
            const catalog = urlParams.catalog || 'com.linvo.cinemeta:top';
            const category = urlParams.category || '';
            window.location.replace(`#/discover/${type}/${catalog}/${category}`);
        }
    }, []);
    return (
        <div className={styles['discover-container']}>
            <NavBar
                className={styles['nav-bar']}
                backButton={false}
                tabs={[
                    { label: 'Board', icon: 'ic_board', href: '#/' },
                    { label: 'Discover', icon: 'ic_discover', href: '#/discover' },
                    { label: 'Library', icon: 'ic_library', href: '#/library' },
                    { label: 'Calendar', icon: 'ic_calendar', href: '#/calendar' },
                ]}
                searchBar={true}
                userMenu={true}
            />
            {
                typeof urlParams.type === 'string' || typeof urlParams.catalog === 'string' ?
                    <div className={styles['discover-content']}>
                        <div className={styles['pickers-container']}>
                            <Popup onOpen={typePickerOnOpen} onClose={typePickerOnClose}>
                                <Popup.Label>
                                    <Input className={classnames(styles['picker-button'], styles['types-picker-button'], { 'active': typePickerOpen }, 'focusable-with-border')} type={'button'}>
                                        <div className={styles['picker-label']}>{urlParams.type}</div>
                                        <Icon className={styles['picker-icon']} icon={'ic_arrow_down'} />
                                    </Input>
                                </Popup.Label>
                                <Popup.Menu className={styles['menu-layer']}>
                                    <div className={classnames(styles['menu-items-container'], styles['menu-types-container'])}>
                                        <Input className={classnames(styles['menu-item-container'], 'focusable-with-border')} type={'button'}>
                                            <div className={styles['menu-label']}>movie</div>
                                        </Input>
                                        <Input className={classnames(styles['menu-item-container'], 'focusable-with-border')} type={'button'}>
                                            <div className={styles['menu-label']}>series</div>
                                        </Input>
                                        <Input className={classnames(styles['menu-item-container'], 'focusable-with-border')} type={'button'}>
                                            <div className={styles['menu-label']}>channel</div>
                                        </Input>
                                        <Input className={classnames(styles['menu-item-container'], 'focusable-with-border')} type={'button'}>
                                            <div className={styles['menu-label']}>TV channels</div>
                                        </Input>
                                    </div>
                                </Popup.Menu>
                            </Popup>
                            <Popup onOpen={catalogPickerOnOpen} onClose={catalogPickerOnClose}>
                                <Popup.Label>
                                    <Input className={classnames(styles['picker-button'], { 'active': catalogPickerOpen }, 'focusable-with-border')} type={'button'}>
                                        <div className={styles['picker-label']}>{urlParams.catalog}</div>
                                        <Icon className={styles['picker-icon']} icon={'ic_arrow_down'} />
                                    </Input>
                                </Popup.Label>
                                <Popup.Menu className={styles['menu-layer']}>
                                    <div className={styles['menu-items-container']}>
                                        <Input className={classnames(styles['menu-item-container'], 'focusable-with-border')} type={'button'}>
                                            <div className={styles['menu-label']}>catalog1</div>
                                        </Input>
                                        <Input className={classnames(styles['menu-item-container'], 'focusable-with-border')} type={'button'}>
                                            <div className={styles['menu-label']}>catalog2</div>
                                        </Input>
                                    </div>
                                </Popup.Menu>
                            </Popup>
                            <Popup onOpen={categoryPickerOnOpen} onClose={categoryPickerOnClose}>
                                <Popup.Label>
                                    <Input className={classnames(styles['picker-button'], { 'active': categoryPickerOpen }, 'focusable-with-border')} type={'button'}>
                                        <div className={styles['picker-label']}>{urlParams.category !== null ? urlParams.category : 'Select category'}</div>
                                        <Icon className={styles['picker-icon']} icon={'ic_arrow_down'} />
                                    </Input>
                                </Popup.Label>
                                <Popup.Menu className={styles['menu-layer']}>
                                    <div className={styles['menu-items-container']}>
                                        <Input className={classnames(styles['menu-item-container'], 'focusable-with-border')} type={'button'}>
                                            <div className={styles['menu-label']}>category1</div>
                                        </Input>
                                        <Input className={classnames(styles['menu-item-container'], 'focusable-with-border')} type={'button'}>
                                            <div className={styles['menu-label']}>category2</div>
                                        </Input>
                                    </div>
                                </Popup.Menu>
                            </Popup>
                        </div>
                        <div className={styles['meta-items-container']} tabIndex={-1}>
                            {catalog.map(({ id, type, name, posterShape }) => (
                                <div key={id} className={styles['meta-item-container']}>
                                    <MetaItem
                                        className={styles['meta-item']}
                                        id={id}
                                        type={type}
                                        name={name}
                                        posterShape={posterShape}
                                    />
                                </div>
                            ))}
                        </div>
                        <div className={styles['info-container']}>
                        </div>
                    </div>
                    :
                    null
            }
        </div>
    );
};

module.exports = Discover;
