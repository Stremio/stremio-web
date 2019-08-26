const React = require('react');
const PropTypes = require('prop-types');
const classnames = require('classnames');
const { Modal } = require('stremio-router');
const useBinaryState = require('stremio/common/useBinaryState');
const ActionButton = require('./ActionButton');
const MetaLinks = require('./MetaLinks');
const styles = require('./styles');

const MetaPreview = ({ className, id, type, name, compact = false, logo = '', background = '', duration = '', releaseInfo = '', released = '', description = '', genres = [], writers = [], directors = [], cast = [], imdbRating = '', links = {}, inLibrary = false, toggleInLibrary }) => {
    const [shareModalOpen, openShareModal, closeShareModal] = useBinaryState(false);
    const releaseInfoText = React.useMemo(() => {
        const releasedDate = new Date(released);
        return typeof releaseInfo === 'string' && releaseInfo.length > 0 ?
            releaseInfo
            :
            !isNaN(releasedDate.getFullYear()) ?
                releasedDate.getFullYear()
                :
                null;
    }, [releaseInfo, released]);
    const logoOnError = React.useCallback((event) => {
        event.currentTarget.style.display = 'none';
    }, []);
    const genresLinks = React.useMemo(() => {
        return Array.isArray(genres) ?
            genres.map((genre) => ({
                label: genre,
                href: `#/discover/${type}//${genre}`
            }))
            :
            [];
    }, [type, genres]);
    const writersLinks = React.useMemo(() => {
        return Array.isArray(writers) ?
            writers.map((writer) => ({
                label: writer,
                href: `#/search?q=${writer}`
            }))
            :
            [];
    }, [writers]);
    const directorsLinks = React.useMemo(() => {
        return Array.isArray(directors) ?
            directors.map((director) => ({
                label: director,
                href: `#/search?q=${director}`
            }))
            :
            [];
    }, [directors]);
    const castLinks = React.useMemo(() => {
        return Array.isArray(cast) ?
            cast.map((name) => ({
                label: name,
                href: `#/search?q=${name}`
            }))
            :
            [];
    }, [cast]);
    const shareModalBackgroundOnClick = React.useCallback((event) => {
        if (!event.nativeEvent.closeShareModalPrevented) {
            closeShareModal();
        }
    }, []);
    const shareModalContentOnClick = React.useCallback((event) => {
        event.nativeEvent.closeShareModalPrevented = true;
    }, []);
    return (
        <div className={classnames(className, styles['meta-preview-container'], { [styles['compact']]: compact })}>
            <div className={styles['background-image-layer']}>
                <img
                    className={styles['background-image']}
                    src={background}
                    alt={' '}
                />
            </div>
            <div className={styles['meta-info']}>
                {
                    typeof logo === 'string' && logo.length > 0 ?
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
                    (typeof releaseInfoText === 'string' && releaseInfoText.length > 0) || (typeof duration === 'string' && duration.length > 0) ?
                        <div className={styles['duration-release-info-container']}>
                            {
                                typeof releaseInfoText === 'string' && releaseInfoText.length > 0 ?
                                    <div className={styles['release-info']}>{releaseInfoText}</div>
                                    :
                                    null
                            }
                            {
                                typeof duration === 'string' && duration.length > 0 ?
                                    <div className={styles['duration']}>{duration}</div>
                                    :
                                    null
                            }
                        </div>
                        :
                        null
                }
                {
                    typeof name === 'string' && name.length > 0 ?
                        <div className={styles['name-container']}>{name}</div>
                        :
                        null
                }
                {
                    typeof description === 'string' && description.length > 0 ?
                        <div className={styles['description-container']}>{description}</div>
                        :
                        null
                }
                {
                    genresLinks.length > 0 ?
                        <MetaLinks className={styles['meta-links']} label={'Genres'} links={genresLinks} />
                        :
                        null
                }
                {
                    writersLinks.length > 0 ?
                        <MetaLinks className={styles['meta-links']} label={'Writers'} links={writersLinks} />
                        :
                        null
                }
                {
                    directorsLinks.length > 0 ?
                        <MetaLinks className={styles['meta-links']} label={'Directors'} links={directorsLinks} />
                        :
                        null
                }
                {
                    castLinks.length > 0 ?
                        <MetaLinks className={styles['meta-links']} label={'Cast'} links={castLinks} />
                        :
                        null
                }
            </div>
            <div className={styles['action-buttons-container']}>
                {
                    typeof toggleInLibrary === 'function' ?
                        <ActionButton
                            className={styles['action-button']}
                            icon={inLibrary ? 'ic_removelib' : 'ic_addlib'}
                            label={inLibrary ? 'Remove from Library' : 'Add to library'}
                            data-id={id}
                            onClick={toggleInLibrary}
                        />
                        :
                        null
                }
                {
                    links && typeof links.trailer === 'string' && links.trailer.length > 0 ?
                        <ActionButton
                            className={styles['action-button']}
                            icon={'ic_movies'}
                            label={'Trailer'}
                            href={`#/player?stream=${links.trailer}`}
                        />
                        :
                        null
                }
                {
                    links && typeof links.imdb === 'string' && links.imdb.length > 0 ?
                        <ActionButton
                            className={styles['action-button']}
                            icon={'ic_imdb'}
                            label={typeof imdbRating === 'string' && imdbRating.length > 0 ? `${imdbRating} / 10` : null}
                            href={`https://imdb.com/title/${links.imdb}`}
                            target={'_blank'}
                        />
                        :
                        null
                }
                {
                    !compact && links && typeof links.share === 'string' && links.share.length > 0 ?
                        <React.Fragment>
                            <ActionButton
                                className={styles['action-button']}
                                icon={'ic_share'}
                                label={'Share'}
                                onClick={openShareModal}
                            />
                            {
                                shareModalOpen ?
                                    <Modal>
                                        <div style={{ width: '100%', height: '100%' }} onClick={shareModalBackgroundOnClick}>
                                            <div
                                                style={{ width: '50%', height: '50%', backgroundColor: 'red' }}
                                                onClick={shareModalContentOnClick}
                                            />
                                        </div>
                                    </Modal>
                                    :
                                    null
                            }
                        </React.Fragment>
                        :
                        null
                }
            </div>
        </div>
    );
};

MetaPreview.propTypes = {
    className: PropTypes.string,
    id: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    compact: PropTypes.bool,
    logo: PropTypes.string,
    background: PropTypes.string,
    duration: PropTypes.string,
    releaseInfo: PropTypes.string,
    released: PropTypes.string,
    description: PropTypes.string,
    genres: PropTypes.arrayOf(PropTypes.string),
    writers: PropTypes.arrayOf(PropTypes.string),
    directors: PropTypes.arrayOf(PropTypes.string),
    cast: PropTypes.arrayOf(PropTypes.string),
    imdbRating: PropTypes.string,
    links: PropTypes.shape({
        trailer: PropTypes.string,
        imdb: PropTypes.string,
        share: PropTypes.string
    }),
    inLibrary: PropTypes.bool,
    toggleInLibrary: PropTypes.func
};

module.exports = MetaPreview;
