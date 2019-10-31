const React = require('react');
const PropTypes = require('prop-types');
const classnames = require('classnames');
const { Modal } = require('stremio-router');
const Icon = require('stremio-icons/dom');
const Image = require('stremio/common/Image');
const useBinaryState = require('stremio/common/useBinaryState');
const ActionButton = require('./ActionButton');
const MetaLinks = require('./MetaLinks');
const MetaPreviewPlaceholder = require('./MetaPreviewPlaceholder');
const styles = require('./styles');

const MetaPreview = ({ className, compact, id, type, name, logo, background, duration, releaseInfo, released, description, genres, writers, directors, cast, imdbId, imdbRating, trailer, share, inLibrary, toggleInLibrary }) => {
    const [shareModalOpen, openShareModal, closeShareModal] = useBinaryState(false);
    const genresLinks = React.useMemo(() => {
        return Array.isArray(genres) ?
            genres.filter(genre => typeof genre === 'string')
                .map((genre) => ({
                    label: genre,
                    href: `#/discover/${type}//?genre=${genre}`
                }))
            :
            [];
    }, [type, genres]);
    const writersLinks = React.useMemo(() => {
        return Array.isArray(writers) ?
            writers.filter(writer => typeof writer === 'string')
                .map((writer) => ({
                    label: writer,
                    href: `#/search?q=${writer}`
                }))
            :
            [];
    }, [writers]);
    const directorsLinks = React.useMemo(() => {
        return Array.isArray(directors) ?
            directors.filter(director => typeof director === 'string')
                .map((director) => ({
                    label: director,
                    href: `#/search?q=${director}`
                }))
            :
            [];
    }, [directors]);
    const castLinks = React.useMemo(() => {
        return Array.isArray(cast) ?
            cast.filter(name => typeof name === 'string')
                .map((name) => ({
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
                        <Image
                            key={logo}
                            className={styles['logo']}
                            src={logo}
                            alt={' '}
                            renderFallback={
                                compact ?
                                    () => (
                                        <Icon className={styles['logo-placeholder-icon']} icon={'ic_broken_link'} />
                                    )
                                    :
                                    null
                            }
                        />
                        :
                        null
                }
                {
                    (typeof releaseInfo === 'string' && releaseInfo.length > 0) || (released instanceof Date && !isNaN(released.getTime())) || (typeof duration === 'string' && duration.length > 0) ?
                        <div className={styles['duration-release-info-container']}>
                            {
                                typeof releaseInfo === 'string' && releaseInfo.length > 0 ?
                                    <div className={styles['release-info-label']}>{releaseInfo}</div>
                                    :
                                    released instanceof Date && !isNaN(released.getTime()) ?
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
                            onClick={toggleInLibrary}
                            {...(!compact ? { tabIndex: -1 } : null)}
                        />
                        :
                        null
                }
                {
                    typeof trailer === 'string' && trailer.length > 0 ?
                        <ActionButton
                            className={styles['action-button']}
                            icon={'ic_movies'}
                            label={'Trailer'}
                            href={`#/player?stream=${trailer}`}
                            {...(compact ? { tabIndex: -1 } : null)}
                        />
                        :
                        null
                }
                {
                    typeof imdbId === 'string' && imdbId.length > 0 ?
                        <ActionButton
                            className={styles['action-button']}
                            icon={'ic_imdb'}
                            label={typeof imdbRating === 'string' && imdbRating.length > 0 ? `${imdbRating} / 10` : null}
                            href={`https://imdb.com/title/${imdbId}`}
                            target={'_blank'}
                            {...(compact ? { tabIndex: -1 } : null)}
                        />
                        :
                        null
                }
                {
                    !compact && typeof share === 'string' && share.length > 0 ?
                        <React.Fragment>
                            <ActionButton
                                className={styles['action-button']}
                                icon={'ic_share'}
                                label={'Share'}
                                onClick={openShareModal}
                                {...(compact ? { tabIndex: -1 } : null)}
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

MetaPreview.Placeholder = MetaPreviewPlaceholder;

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
    imdbId: PropTypes.string,
    imdbRating: PropTypes.string,
    trailer: PropTypes.string,
    share: PropTypes.string,
    inLibrary: PropTypes.bool,
    toggleInLibrary: PropTypes.func
};

module.exports = MetaPreview;
