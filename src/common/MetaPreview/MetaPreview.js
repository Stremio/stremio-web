const React = require('react');
const classnames = require('classnames');
const Icon = require('stremio-icons/dom');
const { Input } = require('stremio-navigation');
const styles = require('./styles');

const MetaPreview = ({ className, compact, id, type, name, logo = '', background = '', duration = '', releaseInfo = '', released, description, genres = [], writers = [], directors = [], cast = [], imdbId = '', imdbRating = '', inLibrary = false, trailer = '', share = '', toggleLibraryOnClick }) => {
    const logoOnError = React.useCallback((event) => {
        event.currentTarget.style.display = 'none';
    }, []);
    const releaseInfoText = releaseInfo.length > 0 ?
        releaseInfo
        :
        released instanceof Date && !isNaN(released.getFullYear()) ?
            released.getFullYear()
            :
            '';
    return (
        <div className={classnames(className, styles['meta-preview-container'], { [styles['compact']]: compact })} style={{ backgroundImage: `url(${background})` }}>
            <div className={styles['meta-preview-content']}>
                <img className={styles['logo']} src={logo} onError={logoOnError} />
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
                            <div className={styles['name']} title={name}>{name}</div>
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
                        <div className={styles['links-container']}>
                            <div className={styles['title']}>Genres:</div>
                            {genres.map((genre) => (
                                <Input key={genre} className={styles['link']} tabIndex={-1} type={'link'} href={`#/discover/${type}//${genre}`}>
                                    {genre}
                                </Input>
                            ))}
                        </div>
                        :
                        null
                }
            </div>
            {/* 
            {
                writers.length > 0 ?
                    <div className={styles['links-container']}>
                        <div className={styles['title']}>Writers</div>
                        {writers.map((writer) => (
                            <Input key={writer} className={styles['link']} type={'link'} href={`#/search?q=${writer}`}>
                                {writer}
                            </Input>
                        ))}
                    </div>
                    :
                    null
            }
            {
                cast.length > 0 ?
                    <div className={styles['links-container']}>
                        <div className={styles['title']}>Cast</div>
                        {cast.map((actor) => (
                            <Input key={actor} className={styles['link']} type={'link'} href={`#/search?q=${actor}`}>
                                {actor}
                            </Input>
                        ))}
                    </div>
                    :
                    null
            }
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
