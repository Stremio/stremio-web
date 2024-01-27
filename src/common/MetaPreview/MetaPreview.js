// Copyright (C) 2017-2023 Smart code 203358507

const React = require('react');
const PropTypes = require('prop-types');
const classnames = require('classnames');
const UrlUtils = require('url');
const { useTranslation } = require('react-i18next');
const { default: Icon } = require('@stremio/stremio-icons/react');
const Button = require('stremio/common/Button');
const Image = require('stremio/common/Image');
const ModalDialog = require('stremio/common/ModalDialog');
const SharePrompt = require('stremio/common/SharePrompt');
const CONSTANTS = require('stremio/common/CONSTANTS');
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

const MetaPreview = ({ className, compact, name, logo, background, runtime, releaseInfo, released, description, deepLinks, links, trailerStreams, inLibrary, toggleInLibrary }) => {
    const { t } = useTranslation();
    const [shareModalOpen, openShareModal, closeShareModal] = useBinaryState(false);
    const linksGroups = React.useMemo(() => {
        return Array.isArray(links) ?
            links
                .filter((link) => link && typeof link.category === 'string' && typeof link.url === 'string')
                .reduce((linksGroups, { category, name, url }) => {
                    const { protocol, path, pathname, hostname } = UrlUtils.parse(url);
                    if (category === CONSTANTS.IMDB_LINK_CATEGORY) {
                        if (hostname === 'imdb.com') {
                            linksGroups.set(category, {
                                label: name,
                                href: `https://www.stremio.com/warning#${encodeURIComponent(url)}`
                            });
                        }
                    } else if (category === CONSTANTS.SHARE_LINK_CATEGORY) {
                        linksGroups.set(category, {
                            label: name,
                            href: url
                        });
                    } else {
                        if (protocol === 'stremio:') {
                            if (pathname !== null && ALLOWED_LINK_REDIRECTS.some((regexp) => pathname.match(regexp))) {
                                if (!linksGroups.has(category)) {
                                    linksGroups.set(category, []);
                                }
                                linksGroups.get(category).push({
                                    label: name,
                                    href: `#${path}`
                                });
                            }
                        } else if (typeof hostname === 'string' && hostname.length > 0) {
                            if (!linksGroups.has(category)) {
                                linksGroups.set(category, []);
                            }
                            linksGroups.get(category).push({
                                label: name,
                                href: `https://www.stremio.com/warning#${encodeURIComponent(url)}`
                            });
                        }
                    }

                    return linksGroups;
                }, new Map())
            :
            new Map();
    }, [links]);
    const showHref = React.useMemo(() => {
        return deepLinks ?
            typeof deepLinks.player === 'string' ?
                deepLinks.player
                :
                typeof deepLinks.metaDetailsStreams === 'string' ?
                    deepLinks.metaDetailsStreams
                    :
                    typeof deepLinks.metaDetailsVideos === 'string' ?
                        deepLinks.metaDetailsVideos
                        :
                        null
            :
            null;
    }, [deepLinks]);
    const trailerHref = React.useMemo(() => {
        if (!Array.isArray(trailerStreams) || trailerStreams.length === 0) {
            return null;
        }

        return trailerStreams[0].deepLinks.player;
    }, [trailerStreams]);
    const renderLogoFallback = React.useCallback(() => (
        <div className={styles['logo-placeholder']}>{name}</div>
    ), [name]);
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
                            title={name}
                            renderFallback={renderLogoFallback}
                        />
                        :
                        renderLogoFallback()
                }
                {
                    (typeof releaseInfo === 'string' && releaseInfo.length > 0) || (released instanceof Date && !isNaN(released.getTime())) || (typeof runtime === 'string' && runtime.length > 0) || linksGroups.has(CONSTANTS.IMDB_LINK_CATEGORY) ?
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
                                linksGroups.has(CONSTANTS.IMDB_LINK_CATEGORY) ?
                                    <Button
                                        className={styles['imdb-button-container']}
                                        title={linksGroups.get(CONSTANTS.IMDB_LINK_CATEGORY).label}
                                        href={linksGroups.get(CONSTANTS.IMDB_LINK_CATEGORY).href}
                                        target={'_blank'}
                                        {...(compact ? { tabIndex: -1 } : null)}
                                    >
                                        <div className={styles['label']}>{linksGroups.get(CONSTANTS.IMDB_LINK_CATEGORY).label}</div>
                                        <Icon className={styles['icon']} name={'imdb'} />
                                    </Button>
                                    :
                                    null
                            }
                        </div>
                        :
                        null
                }
                {
                    compact && typeof description === 'string' && description.length > 0 ?
                        <div className={styles['description-container']}>
                            {description}
                        </div>
                        :
                        null
                }
                {
                    Array.from(linksGroups.keys())
                        .filter((category) => {
                            return category !== CONSTANTS.IMDB_LINK_CATEGORY &&
                                category !== CONSTANTS.SHARE_LINK_CATEGORY &&
                                category !== CONSTANTS.WRITERS_LINK_CATEGORY;
                        })
                        .map((category, index) => (
                            <MetaLinks
                                key={index}
                                className={styles['meta-links']}
                                label={category}
                                links={linksGroups.get(category)}
                            />
                        ))
                }
                {
                    !compact && typeof description === 'string' && description.length > 0 ?
                        <div className={styles['description-container']}>
                            <div className={styles['label-container']}>
                                {t('SUMMARY')}
                            </div>
                            {description}
                        </div>
                        :
                        null
                }
            </div>
            <div className={styles['action-buttons-container']}>
                {
                    typeof toggleInLibrary === 'function' ?
                        <ActionButton
                            className={styles['action-button']}
                            icon={inLibrary ? 'remove-from-library' : 'add-to-library'}
                            label={inLibrary ? t('REMOVE_FROM_LIB') : t('ADD_TO_LIB')}
                            tooltip={compact}
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
                            icon={'trailer'}
                            label={t('TRAILER')}
                            tabIndex={compact ? -1 : 0}
                            href={trailerHref}
                            tooltip={compact}
                        />
                        :
                        null
                }
                {
                    typeof showHref === 'string' && compact ?
                        <ActionButton
                            className={classnames(styles['action-button'], styles['show-button'])}
                            icon={'play'}
                            label={t('SHOW')}
                            tabIndex={compact ? -1 : 0}
                            href={showHref}
                        />
                        :
                        null
                }
                {
                    linksGroups.has(CONSTANTS.SHARE_LINK_CATEGORY) && !compact ?
                        <React.Fragment>
                            <ActionButton
                                className={styles['action-button']}
                                icon={'share'}
                                label={t('CTX_SHARE')}
                                tooltip={true}
                                tabIndex={compact ? -1 : 0}
                                onClick={openShareModal}
                            />
                            {
                                shareModalOpen ?
                                    <ModalDialog title={t('CTX_SHARE')} onCloseRequest={closeShareModal}>
                                        <SharePrompt
                                            className={styles['share-prompt']}
                                            url={linksGroups.get(CONSTANTS.SHARE_LINK_CATEGORY).href}
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
    deepLinks: PropTypes.shape({
        metaDetailsVideos: PropTypes.string,
        metaDetailsStreams: PropTypes.string,
        player: PropTypes.string
    }),
    links: PropTypes.arrayOf(PropTypes.shape({
        category: PropTypes.string,
        name: PropTypes.string,
        url: PropTypes.string
    })),
    trailerStreams: PropTypes.array,
    inLibrary: PropTypes.bool,
    toggleInLibrary: PropTypes.func
};

module.exports = MetaPreview;
