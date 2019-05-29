const React = require('react');
const classnames = require('classnames');
const Icon = require('stremio-icons/dom');
const { Input } = require('stremio-navigation');
const styles = require('./styles');

const MetaLinks = ({ label, links, href }) => (
    <React.Fragment>
        <div className={styles['links-label']}>{label}</div>
        <div className={styles['links-container']}>
            {links.map((link, index) => (
                <Input key={`${link}-${index}`} className={styles['link']} title={link} type={'link'} tabIndex={-1} href={href(link)}>
                    {link}
                    {index < links.length - 1 ? ',' : null}
                </Input>
            ))}
        </div>
    </React.Fragment>
);

const MetaPreview = ({ className, compact, id, type, name, logo = '', background = '', duration = '', releaseInfo = '', released = '', description = '', genres = [], writers = [], directors = [], cast = [], imdbId = '', imdbRating = '', inLibrary = false, trailer = '', share = '', toggleLibraryOnClick }) => {
    const releaseInfoText = React.useMemo(() => {
        const releasedDate = new Date(released);
        return releaseInfo.length > 0 ?
            releaseInfo
            :
            !isNaN(releasedDate.getFullYear()) ?
                releasedDate.getFullYear()
                :
                '';
    }, [releaseInfo, released]);
    const logoOnError = React.useCallback((event) => {
        event.currentTarget.style.display = 'none';
    }, []);
    const hrefForGenre = React.useCallback((genre) => {
        return `#/discover/${type}//${genre}`;
    }, [type]);
    const hrefForCrew = React.useCallback((name) => {
        return `#/search?q=${name}`;
    }, []);
    return (
        <div className={classnames(className, styles['meta-preview-container'], { [styles['compact']]: compact })} style={{ backgroundImage: `url(${background})` }}>
            <div className={styles['meta-preview-content']}>
                {
                    logo.length > 0 ?
                        <img
                            key={logo}
                            className={styles['logo']}
                            src={logo}
                            onError={logoOnError}
                        />
                        :
                        null
                }
                {
                    releaseInfoText.length > 0 || duration.length > 0 ?
                        <div className={styles['duration-release-info-container']}>
                            {
                                releaseInfoText.length > 0 ?
                                    <div className={styles['release-info']}>{releaseInfoText}</div>
                                    :
                                    null
                            }
                            {
                                duration.length > 0 ?
                                    <div className={styles['duration']}>{duration}</div>
                                    :
                                    null
                            }
                        </div>
                        :
                        null
                }
                {
                    name.length > 0 ?
                        <div className={styles['name-container']}>
                            <div className={styles['name']}>{name}</div>
                        </div>
                        :
                        null
                }
                {
                    description.length > 0 ?
                        <div className={styles['description-container']}>
                            <div className={styles['description']}>{description}</div>
                        </div>
                        :
                        null
                }
                {
                    genres.length > 0 ?
                        <MetaLinks label={'Genres:'} links={genres} href={hrefForGenre} />
                        :
                        null
                }
                {
                    cast.length > 0 ?
                        <MetaLinks label={'Cast:'} links={cast} href={hrefForCrew} />
                        :
                        null
                }
                {
                    writers.length > 0 && !compact ?
                        <MetaLinks label={'Writers:'} links={writers} href={hrefForCrew} />
                        :
                        null
                }
                {
                    directors.length > 0 && !compact ?
                        <MetaLinks label={'Directors:'} links={directors} href={hrefForCrew} />
                        :
                        null
                }
            </div>
            {/* 
            <div className={styles['action-buttons-container']}>
                {
                    trailer.length > 0 ?
                        <Input className={styles['action-button-container']} type={'link'} href={`#/player?stream=${trailer}`}>
                            <Icon className={styles['icon']} icon={'ic_movies'} />
                            <div className={styles['label']}>Trailer</div>
                        </Input>
                        :
                        null
                }
                {
                    imdbId.length > 0 ?
                        <Input className={styles['action-button-container']} type={'link'} href={`https://imdb.com/title/${imdbId}`} target={'_blank'}>
                            <Icon className={styles['icon']} icon={'ic_imdb'} />
                            {
                                imdbRating.length > 0 ?
                                    <div className={styles['label']}>{imdbRating} / 10</div>
                                    :
                                    null
                            }
                        </Input>
                        :
                        null
                }
                <Input className={styles['action-button-container']} type={'button'} data-meta-item-id={id} onClick={toggleLibraryOnClick}>
                    <Icon className={styles['icon']} icon={inLibrary ? 'ic_removelib' : 'ic_addlib'} />
                    <div className={styles['label']}>{inLibrary ? 'Remove from Library' : 'Add to library'}</div>
                </Input>
                {
                    share.length > 0 ?
                        <Input className={styles['action-button-container']} type={'button'}>
                            <Icon className={styles['icon']} icon={'ic_share'} />
                            <div className={styles['label']}>Share</div>
                            {
                                shareModalOpen ?
                                    <Modal>
                                        
                                    </Modal>
                                    :
                                    null
                            }
                        </Input>
                        :
                        null
                }
            </div> */}
        </div >
    );
};

module.exports = MetaPreview;
