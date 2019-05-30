const React = require('react');
const classnames = require('classnames');
const { Input } = require('stremio-navigation');
const Icon = require('stremio-icons/dom');
const { MainNavBar, MetaItem, MetaPreview, Popup, useBinaryState } = require('stremio-common');
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
    }, [urlParams.type, urlParams.catalog]);
    return (
        <div className={styles['discover-container']}>
            <MainNavBar className={styles['nav-bar']} />
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
                        <MetaPreview
                            className={styles['meta-preview-container']}
                            compact={true}
                            id={'tt0117951'}
                            type={'movie'}
                            name={'Trainspotting'}
                            logo={'https://s3.dexerto.com/thumbnails/_thumbnailLarge/Pewdiepie-overtaken-by-t-series.jpg'}
                            logo={'https://images.metahub.space/logo/medium/tt0117951/img'}
                            background={'https://www.bfi.org.uk/sites/bfi.org.uk/files/styles/full/public/image/trainspotting-1996-008-ewan-bremner-ewan-mcgregor-robert-carlyle-00m-m63.jpg?itok=tmpxRcqP'}
                            duration={'93 min'}
                            releaseInfo={'1996'}
                            released={'1996-08-09T00:00:00.000Z'}
                            description={'Renton, deeply immersed in the Edinburgh drug scene, tries to clean up and get out, despite the allure of the drugs and influence of friends. gg'}
                            genres={['action', 'drama', 'drama', 'drama', 'drama', 'drama', 'drama', 'drama', 'drama']}
                            writers={['Ewan McGregor', 'Ewen Bremner', 'Jonny Lee Miller', 'Kevin McKidd', 'Kevin McKidd', 'Kevin McKidd', 'Kevin McKidd', 'Kevin McKidd', 'Kevin McKidd']}
                            directors={['Ewan McGregor', 'Ewen Bremner', 'Jonny Lee Miller', 'Kevin McKidd', 'Kevin McKidd', 'Kevin McKidd', 'Kevin McKidd', 'Kevin McKidd', 'Kevin McKidd']}
                            cast={['Ewan McGregor', 'Ewen Bremner', 'Jonny Lee Miller', 'Kevin McKidd', 'Kevin McKidd', 'Kevin McKidd', 'Kevin McKidd', 'Kevin McKidd', 'Kevin McKidd']}
                            imdbId={'tt0117951'}
                            imdbRating={'8.2'}
                            trailer={'encodedStream'}
                            inLibrary={true}
                            share={'share_url'}
                        />
                    </div>
                    :
                    null
            }
        </div>
    );
};

module.exports = Discover;
