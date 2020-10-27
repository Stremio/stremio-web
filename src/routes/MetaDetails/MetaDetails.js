// Copyright (C) 2017-2020 Smart code 203358507

const React = require('react');
const PropTypes = require('prop-types');
const { useServices } = require('stremio/services');
const { VerticalNavBar, HorizontalNavBar, MetaPreview, ModalDialog, Image } = require('stremio/common');
const StreamsList = require('./StreamsList');
const VideosList = require('./VideosList');
const useMetaDetails = require('./useMetaDetails');
const useSeason = require('./useSeason');
const useMetaExtensionTabs = require('./useMetaExtensionTabs');
const styles = require('./styles');

const MetaDetails = ({ urlParams, queryParams }) => {
    const { core } = useServices();
    const metaDetails = useMetaDetails(urlParams);
    const [season, setSeason] = useSeason(urlParams, queryParams);
    const [tabs, metaExtension, clearMetaExtension] = useMetaExtensionTabs(metaDetails.metaExtensions);
    const [metaPath, streamsPath] = React.useMemo(() => {
        return metaDetails.selected !== null ?
            [metaDetails.selected.metaPath, metaDetails.selected.streamsPath]
            :
            [null, null];
    }, [metaDetails.selected]);
    const video = React.useMemo(() => {
        return streamsPath !== null && metaDetails.metaCatalog !== null && metaDetails.metaCatalog.content.type === 'Ready' ?
            metaDetails.metaCatalog.content.content.videos.reduce((result, video) => {
                if (video.id === streamsPath.id) {
                    return video;
                }

                return result;
            }, null)
            :
            null;
    }, [metaDetails.metaCatalog, streamsPath]);
    const addToLibrary = React.useCallback(() => {
        if (metaDetails.metaCatalog === null || metaDetails.metaCatalog.content.type !== 'Ready') {
            return;
        }

        core.transport.dispatch({
            action: 'Ctx',
            args: {
                action: 'AddToLibrary',
                args: metaDetails.metaCatalog.content.content
            }
        });
    }, [metaDetails]);
    const removeFromLibrary = React.useCallback(() => {
        if (metaDetails.metaCatalog === null || metaDetails.metaCatalog.content.type !== 'Ready') {
            return;
        }

        core.transport.dispatch({
            action: 'Ctx',
            args: {
                action: 'RemoveFromLibrary',
                args: metaDetails.metaCatalog.content.content.id
            }
        });
    }, [metaDetails]);
    const seasonOnSelect = React.useCallback((event) => {
        setSeason(event.value);
    }, [setSeason]);
    return (
        <div className={styles['metadetails-container']}>
            <HorizontalNavBar
                className={styles['nav-bar']}
                backButton={true}
                title={metaDetails.metaCatalog !== null && metaDetails.metaCatalog.content.type === 'Ready' ? metaDetails.metaCatalog.content.content.name : null}
            />
            <div className={styles['metadetails-content']}>
                {
                    tabs.length > 0 ?
                        <VerticalNavBar
                            className={styles['vertical-nav-bar']}
                            tabs={tabs}
                            selected={metaExtension !== null ? metaExtension.url : null}
                        />
                        :
                        null
                }
                {
                    metaPath === null ?
                        <div className={styles['meta-message-container']}>
                            <Image className={styles['image']} src={'/images/empty.png'} alt={' '} />
                            <div className={styles['message-label']}>No meta was selected!</div>
                        </div>
                        :
                        metaDetails.metaCatalog === null ?
                            <div className={styles['meta-message-container']}>
                                <Image className={styles['image']} src={'/images/empty.png'} alt={' '} />
                                <div className={styles['message-label']}>No addons ware requested for this meta!</div>
                            </div>
                            :
                            metaDetails.metaCatalog.content.type === 'Err' ?
                                <div className={styles['meta-message-container']}>
                                    <Image className={styles['image']} src={'/images/empty.png'} alt={' '} />
                                    <div className={styles['message-label']}>No metadata was found!</div>
                                </div>
                                :
                                metaDetails.metaCatalog.content.type === 'Loading' ?
                                    <MetaPreview.Placeholder className={styles['meta-preview']} />
                                    :
                                    <React.Fragment>
                                        {
                                            typeof metaDetails.metaCatalog.content.content.background === 'string' &&
                                                metaDetails.metaCatalog.content.content.background.length > 0 ?
                                                <div className={styles['background-image-layer']}>
                                                    <Image
                                                        className={styles['background-image']}
                                                        src={metaDetails.metaCatalog.content.content.background}
                                                        alt={' '}
                                                    />
                                                </div>
                                                :
                                                null
                                        }
                                        <MetaPreview
                                            className={styles['meta-preview']}
                                            name={metaDetails.metaCatalog.content.content.name + (video !== null && typeof video.title === 'string' && video.title.length > 0 ? ` - ${video.title}` : '')}
                                            logo={metaDetails.metaCatalog.content.content.logo}
                                            runtime={metaDetails.metaCatalog.content.content.runtime}
                                            releaseInfo={metaDetails.metaCatalog.content.content.releaseInfo}
                                            released={metaDetails.metaCatalog.content.content.released}
                                            description={
                                                video !== null && typeof video.overview === 'string' && video.overview.length > 0 ?
                                                    video.overview
                                                    :
                                                    metaDetails.metaCatalog.content.content.description
                                            }
                                            links={metaDetails.metaCatalog.content.content.links}
                                            trailerStreams={metaDetails.metaCatalog.content.content.trailerStreams}
                                            inLibrary={metaDetails.metaCatalog.content.content.inLibrary}
                                            toggleInLibrary={metaDetails.metaCatalog.content.content.inLibrary ? removeFromLibrary : addToLibrary}
                                        />
                                    </React.Fragment>
                }
                <div className={styles['spacing']} />
                {
                    streamsPath !== null ?
                        <StreamsList
                            className={styles['streams-list']}
                            streamsCatalogs={metaDetails.streamsCatalogs}
                        />
                        :
                        metaPath !== null ?
                            <VideosList
                                className={styles['videos-list']}
                                metaCatalog={metaDetails.metaCatalog}
                                season={season}
                                seasonOnSelect={seasonOnSelect}
                            />
                            :
                            null
                }
            </div>
            {
                metaExtension !== null ?
                    <ModalDialog
                        className={styles['meta-extension-modal-container']}
                        title={metaExtension.name}
                        onCloseRequest={clearMetaExtension}>
                        <iframe
                            className={styles['meta-extension-modal-iframe']}
                            sandbox={'allow-forms allow-scripts allow-same-origin'}
                            src={metaExtension.url}
                        />
                    </ModalDialog>
                    :
                    null
            }
        </div>
    );
};

MetaDetails.propTypes = {
    urlParams: PropTypes.shape({
        type: PropTypes.string,
        id: PropTypes.string,
        videoId: PropTypes.string
    }),
    queryParams: PropTypes.instanceOf(URLSearchParams)
};

module.exports = MetaDetails;
