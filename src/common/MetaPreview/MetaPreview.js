const React = require('react');
const PropTypes = require('prop-types');
const classnames = require('classnames');
const Icon = require('stremio-icons/dom');
const { Modal } = require('stremio-router');
const Button = require('../Button');
const useBinaryState = require('../useBinaryState');
const styles = require('./styles');

const MetaLinks = ({ label, links, href }) => {
    return (
        <React.Fragment>
            <div className={styles['links-label']}>{label}</div>
            <div className={styles['links-container']}>
                {links.map((link, index) => (
                    <Button key={`${link}-${index}`} className={styles['link']} title={link} tabIndex={-1} href={href(link)}>
                        {link}
                        {index < links.length - 1 ? ',' : null}
                    </Button>
                ))}
            </div>
        </React.Fragment>
    );
};

const ActionButton = ({ icon, label, ...props }) => {
    return (
        <Button className={styles['action-button']} title={label} tabIndex={-1} {...props}>
            <Icon className={styles['icon']} icon={icon} />
            {
                typeof label === 'string' && label.length > 0 ?
                    <div className={styles['label-container']}>
                        <div className={styles['label']}>{label}</div>
                    </div>
                    :
                    null
            }
        </Button>
    );
};

const MetaPreview = ({ className, compact, id, type, name, logo, background, duration, releaseInfo, released, description, genres, writers, directors, cast, imdbId, imdbRating, inLibrary, trailer, share, toggleIsInLibrary }) => {
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
    const hrefForGenre = React.useCallback((genre) => {
        return `#/discover/${type}//${genre}`;
    }, [type]);
    const hrefForCrew = React.useCallback((name) => {
        return `#/search?q=${name}`;
    }, []);
    return (
        <div className={classnames(className, styles['meta-preview-container'], { [styles['compact']]: compact })} style={{ backgroundImage: `url(${background})` }}>
            <div className={styles['meta-preview-content']} tabIndex={-1}>
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
                        <div className={styles['name-container']}>
                            <div className={styles['name']}>{name}</div>
                        </div>
                        :
                        null
                }
                {
                    typeof description === 'string' && description.length > 0 ?
                        <div className={styles['description-container']}>
                            <div className={styles['description']}>{description}</div>
                        </div>
                        :
                        null
                }
                {
                    Array.isArray(genres) && genres.length > 0 ?
                        <MetaLinks label={'Genres:'} links={genres} href={hrefForGenre} />
                        :
                        null
                }
                {
                    Array.isArray(cast) && cast.length > 0 ?
                        <MetaLinks label={'Cast:'} links={cast} href={hrefForCrew} />
                        :
                        null
                }
                {
                    Array.isArray(writers) && writers.length > 0 && !compact ?
                        <MetaLinks label={'Writers:'} links={writers} href={hrefForCrew} />
                        :
                        null
                }
                {
                    Array.isArray(directors) && directors.length > 0 && !compact ?
                        <MetaLinks label={'Directors:'} links={directors} href={hrefForCrew} />
                        :
                        null
                }
            </div>
            <div className={styles['action-buttons-container']}>
                {
                    typeof toggleIsInLibrary === 'function' ?
                        <ActionButton
                            icon={inLibrary ? 'ic_removelib' : 'ic_addlib'}
                            label={inLibrary ? 'Remove from Library' : 'Add to library'}
                            data-meta-item-id={id}
                            onClick={toggleIsInLibrary}
                        />
                        :
                        null
                }
                {
                    typeof trailer === 'string' && trailer.length > 0 ?
                        <ActionButton
                            icon={'ic_movies'}
                            label={'Trailer'}
                            href={`#/player?stream=${trailer}`}
                        />
                        :
                        null
                }
                {
                    typeof imdbId === 'string' && imdbId.length > 0 ?
                        <ActionButton
                            icon={'ic_imdb'}
                            label={typeof imdbRating === 'string' && imdbRating.length > 0 ? `${imdbRating} / 10` : null}
                            href={`https://imdb.com/title/${imdbId}`}
                            target={'_blank'}
                        />
                        :
                        null
                }
                {
                    typeof share === 'string' && share.length > 0 && !compact ?
                        <React.Fragment>
                            <ActionButton
                                icon={'ic_share'}
                                label={'Share'}
                                onClick={openShareModal}
                            />
                            {
                                shareModalOpen ?
                                    <Modal>
                                        <div
                                            onClick={(event) => {
                                                event.stopPropagation();
                                                closeShareModal();
                                            }}
                                            style={{
                                                width: '100%',
                                                height: '100%',
                                                backgroundColor: 'var(--color-surfacedarker40)'
                                            }}
                                        />
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
    released: PropTypes.string,
    description: PropTypes.string,
    genres: PropTypes.arrayOf(PropTypes.string),
    writers: PropTypes.arrayOf(PropTypes.string),
    directors: PropTypes.arrayOf(PropTypes.string),
    cast: PropTypes.arrayOf(PropTypes.string),
    imdbId: PropTypes.string,
    imdbRating: PropTypes.string,
    inLibrary: PropTypes.bool,
    trailer: PropTypes.string,
    share: PropTypes.string,
    toggleIsInLibrary: PropTypes.func
};

module.exports = MetaPreview;
