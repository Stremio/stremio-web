const React = require('react');
const PropTypes = require('prop-types');
const classnames = require('classnames');
const { Modal } = require('stremio-router');
const useBinaryState = require('stremio/common/useBinaryState');
const ActionButton = require('./ActionButton');
const MetaLinks = require('./MetaLinks');
const styles = require('./styles');

const MetaPreview = ({ className, compact, id, type, name, logo, background, duration, releaseInfo, released, description, genres, writers, directors, cast, imdbRating, links, inLibrary, toggleInLibrary }) => {
    const [shareModalOpen, openShareModal, closeShareModal] = useBinaryState(false);
    const genresLinks = React.useMemo(() => {
        return Array.isArray(genres) ?
            genres.map((genre) => ({
                label: genre,
                href: `#/discover/${type}//?genre=${genre}`
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
            {
                typeof background === 'string' && background.length > 0 ?
                    <div className={styles['background-image-layer']}>
                        <img
                            className={styles['background-image']}
                            src={background}
                            alt={' '}
                        />
                    </div>
                    :
                    null
            }
            <div className={styles['meta-info-container']}>
                {
                    typeof logo === 'string' && logo.length > 0 ?
                        <img
                            key={logo}
                            className={styles['logo']}
                            src={logo}
                            alt={' '}
                        />
                        :
                        null
                }
                {
                    (typeof releaseInfo === 'string' && releaseInfo.length > 0) || (released instanceof Date && !isNaN(released.getFullYear())) || (typeof duration === 'string' && duration.length > 0) ?
                        <div className={styles['duration-release-info-container']}>
                            {
                                typeof releaseInfo === 'string' && releaseInfo.length > 0 ?
                                    <div className={styles['release-info-label']}>{releaseInfo}</div>
                                    :
                                    released instanceof Date && !isNaN(released.getFullYear()) ?
                                        <div className={styles['release-info-label']}>{released.getFullYear()}</div>
                                        :
                                        null
                            }
                            {
                                typeof duration === 'string' && duration.length > 0 ?
                                    <div className={styles['duration-label']}>{duration}</div>
                                    :
                                    null
                            }
                        </div>
                        :
                        null
                }
                <div className={styles['name-container']}>
                    {typeof name === 'string' && name.length > 0 ? name : id}
                </div>
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
                            tabIndex={compact ? -1 : null}
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
                            tabIndex={compact ? -1 : null}
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
                            tabIndex={compact ? -1 : null}
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
                                tabIndex={compact ? -1 : null}
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
    compact: PropTypes.bool,
    id: PropTypes.string,
    type: PropTypes.string,
    name: PropTypes.string,
    logo: PropTypes.string,
    background: PropTypes.string,
    duration: PropTypes.string,
    releaseInfo: PropTypes.string,
    released: PropTypes.instanceOf(Date),
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
