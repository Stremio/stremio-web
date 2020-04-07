const React = require('react');
const PropTypes = require('prop-types');
const classnames = require('classnames');
const UrlUtils = require('url');
const Icon = require('stremio-icons/dom');
const Button = require('stremio/common/Button');
const Image = require('stremio/common/Image');
const ModalDialog = require('stremio/common/ModalDialog');
const SharePrompt = require('stremio/common/SharePrompt');
const CONSTANTS = require('stremio/common/CONSTANTS');
const deepLinking = require('stremio/common/deepLinking');
const routesRegexp = require('stremio/common/routesRegexp');
const useBinaryState = require('stremio/common/useBinaryState');
const ActionButton = require('./ActionButton');
const MetaLinks = require('./MetaLinks');
const MetaPreviewPlaceholder = require('./MetaPreviewPlaceholder');
const styles = require('./styles');

const ALLOWED_LINK_REDIRECTS = [
    routesRegexp.search.regexp,
    routesRegexp.discover.regexp,
    routesRegexp.metadetails.regexp
];

const MetaPreview = ({ className, compact, name, logo, background, runtime, releaseInfo, released, description, links, trailer, inLibrary, toggleInLibrary }) => {
    const [shareModalOpen, openShareModal, closeShareModal] = useBinaryState(false);
    const linksGroups = React.useMemo(() => {
        return Array.isArray(links) ?
            links
                .filter((link) => link && typeof link.category === 'string' && typeof link.url === 'string')
                .reduce((linksGroups, { category, name, url }) => {
                    if (category === CONSTANTS.IMDB_LINK_CATEGORY) {
                        linksGroups[category] = {
                            label: name,
                            href: `https://www.stremio.com/warning#${encodeURIComponent(`https://www.imdb.com/title/${encodeURIComponent(url)}`)}`
                        };
                    } else if (category === CONSTANTS.SHARE_LINK_CATEGORY) {
                        linksGroups[category] = {
                            label: name,
                            href: url
                        };
                    } else {
                        const { protocol, host, path, pathname } = UrlUtils.parse(url);
                        if (protocol === 'stremio:') {
                            if (ALLOWED_LINK_REDIRECTS.some((regexp) => pathname.match(regexp))) {
                                linksGroups[category] = linksGroups[category] || [];
                                linksGroups[category].push({
                                    label: name,
                                    href: `#${path}`
                                });
                            }
                        } else if (typeof host === 'string' && host.length > 0) {
                            linksGroups[category] = linksGroups[category] || [];
                            linksGroups[category].push({
                                label: name,
                                href: `https://www.stremio.com/warning#${encodeURIComponent(url)}`
                            });
                        }
                    }

                    return linksGroups;
                }, {})
            :
            [];
    }, [links]);
    const trailerHref = React.useMemo(() => {
        if (typeof trailer !== 'object' || trailer === null) {
            return null;
        }

        const deepLinks = deepLinking.withStream({ stream: trailer });
        return deepLinks.player;
    }, [trailer]);
    const renderLogoFallback = React.useMemo(() => () => (
        <Icon className={styles['logo-placeholder-icon']} icon={'ic_broken_link'} />
    ), []);
    return (
        <div className={classnames(className, styles['meta-preview-container'], { [styles['compact']]: compact })}>
            {
                typeof background === 'string' && background.length > 0 ?
                    <div className={styles['background-image-layer']}>
                        <Image className={styles['background-image']} src={background} alt={' '} />
                    </div>
                    :
                    null
            }
            <div className={styles['meta-info-container']}>
                {
                    typeof logo === 'string' && logo.length > 0 ?
                        <Image
                            className={styles['logo']}
                            src={logo}
                            alt={' '}
                            renderFallback={renderLogoFallback}
                        />
                        :
                        null
                }
                {
                    (typeof releaseInfo === 'string' && releaseInfo.length > 0) || (released instanceof Date && !isNaN(released.getTime())) || (typeof runtime === 'string' && runtime.length > 0) || typeof linksGroups[CONSTANTS.IMDB_LINK_CATEGORY] === 'object' ?
                        <div className={styles['runtime-release-info-container']}>
                            {
                                typeof runtime === 'string' && runtime.length > 0 ?
                                    <div className={styles['runtime-label']}>{runtime}</div>
                                    :
                                    null
                            }
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
                                typeof linksGroups[CONSTANTS.IMDB_LINK_CATEGORY] === 'object' ?
                                    <Button
                                        className={styles['imdb-button-container']}
                                        title={linksGroups[CONSTANTS.IMDB_LINK_CATEGORY].label}
                                        href={linksGroups[CONSTANTS.IMDB_LINK_CATEGORY].href}
                                        target={'_blank'}
                                        {...(compact ? { tabIndex: -1 } : null)}
                                    >
                                        <Icon className={styles['icon']} icon={'ic_imdbnoframe'} />
                                        <div className={styles['label']}>{linksGroups[CONSTANTS.IMDB_LINK_CATEGORY].label}</div>
                                    </Button>
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
                            {name}
                        </div>
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
                    Object.keys(linksGroups)
                        .filter((category) => {
                            return category !== CONSTANTS.IMDB_LINK_CATEGORY &&
                                category !== CONSTANTS.SHARE_LINK_CATEGORY;
                        })
                        .map((category, index) => (
                            <MetaLinks
                                key={index}
                                className={styles['meta-links']}
                                label={category}
                                links={linksGroups[category]}
                            />
                        ))
                }
            </div>
            <div className={styles['action-buttons-container']}>
                {
                    typeof toggleInLibrary === 'function' ?
                        <ActionButton
                            className={styles['action-button']}
                            icon={inLibrary ? 'ic_removelib' : 'ic_addlib'}
                            label={inLibrary ? 'Remove from Library' : 'Add to library'}
                            tabIndex={compact ? -1 : 0}
                            onClick={toggleInLibrary}
                        />
                        :
                        null
                }
                {
                    typeof trailerHref === 'string' ?
                        <ActionButton
                            className={styles['action-button']}
                            icon={'ic_movies'}
                            label={'Trailer'}
                            tabIndex={compact ? -1 : 0}
                            href={trailerHref}
                        />
                        :
                        null
                }
                {
                    typeof linksGroups[CONSTANTS.SHARE_LINK_CATEGORY] === 'object' ?
                        <React.Fragment>
                            <ActionButton
                                className={styles['action-button']}
                                icon={'ic_share'}
                                label={'Share'}
                                tabIndex={compact ? -1 : 0}
                                onClick={openShareModal}
                            />
                            {
                                shareModalOpen ?
                                    <ModalDialog title={'Share'} onCloseRequest={closeShareModal}>
                                        <SharePrompt
                                            className={styles['share-prompt']}
                                            url={linksGroups[CONSTANTS.SHARE_LINK_CATEGORY].href}
                                        />
                                    </ModalDialog>
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
    name: PropTypes.string,
    logo: PropTypes.string,
    background: PropTypes.string,
    runtime: PropTypes.string,
    releaseInfo: PropTypes.string,
    released: PropTypes.instanceOf(Date),
    description: PropTypes.string,
    links: PropTypes.arrayOf(PropTypes.shape({
        category: PropTypes.string,
        name: PropTypes.string,
        url: PropTypes.string
    })),
    trailer: PropTypes.object,
    inLibrary: PropTypes.bool,
    toggleInLibrary: PropTypes.func
};

module.exports = MetaPreview;
