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
    const [metaPath, streamPath] = React.useMemo(() => {
        return metaDetails.selected !== null ?
            [metaDetails.selected.metaPath, metaDetails.selected.streamPath]
            :
            [null, null];
    }, [metaDetails.selected]);
    const video = React.useMemo(() => {
        return streamPath !== null && metaDetails.metaItem !== null && metaDetails.metaItem.content.type === 'Ready' ?
            metaDetails.metaItem.content.content.videos.reduce((result, video) => {
                if (video.id === streamPath.id) {
                    return video;
                }

                return result;
            }, null)
            :
            null;
    }, [metaDetails.metaItem, streamPath]);
    const addToLibrary = React.useCallback(() => {
        if (metaDetails.metaItem === null || metaDetails.metaItem.content.type !== 'Ready') {
            return;
        }

        core.transport.dispatch({
            action: 'Ctx',
            args: {
                action: 'AddToLibrary',
                args: metaDetails.metaItem.content.content
            }
        });
    }, [metaDetails]);
    const removeFromLibrary = React.useCallback(() => {
        if (metaDetails.metaItem === null || metaDetails.metaItem.content.type !== 'Ready') {
            return;
        }

        core.transport.dispatch({
            action: 'Ctx',
            args: {
                action: 'RemoveFromLibrary',
                args: metaDetails.metaItem.content.content.id
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
                title={metaDetails.title}
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
                            <Image className={styles['image']} src={require('/images/empty.png')} alt={' '} />
                            <div className={styles['message-label']}>No meta was selected!</div>
                        </div>
                        :
                        metaDetails.metaItem === null ?
                            <div className={styles['meta-message-container']}>
                                <Image className={styles['image']} src={require('/images/empty.png')} alt={' '} />
                                <div className={styles['message-label']}>No addons ware requested for this meta!</div>
                            </div>
                            :
                            metaDetails.metaItem.content.type === 'Err' ?
                                <div className={styles['meta-message-container']}>
                                    <Image className={styles['image']} src={require('/images/empty.png')} alt={' '} />
                                    <div className={styles['message-label']}>No metadata was found!</div>
                                </div>
                                :
                                metaDetails.metaItem.content.type === 'Loading' ?
                                    <MetaPreview.Placeholder className={styles['meta-preview']} />
                                    :
                                    <React.Fragment>
                                        {
                                            typeof metaDetails.metaItem.content.content.background === 'string' &&
                                                metaDetails.metaItem.content.content.background.length > 0 ?
                                                <div className={styles['background-image-layer']} style={{backgroundImage:'url('+metaDetails.metaItem.content.content.background+')'}}>
                                                </div>
                                                :
                                                null
                                        }
                                        <MetaPreview
                                            className={styles['meta-preview']}
                                            name={metaDetails.metaItem.content.content.name}
                                            logo={metaDetails.metaItem.content.content.logo}
                                            runtime={metaDetails.metaItem.content.content.runtime}
                                            releaseInfo={metaDetails.metaItem.content.content.releaseInfo}
                                            released={metaDetails.metaItem.content.content.released}
                                            description={
                                                video !== null && typeof video.overview === 'string' && video.overview.length > 0 ?
                                                    video.overview
                                                    :
                                                    metaDetails.metaItem.content.content.description
                                            }
                                            links={metaDetails.metaItem.content.content.links}
                                            trailerStreams={metaDetails.metaItem.content.content.trailerStreams}
                                            inLibrary={metaDetails.metaItem.content.content.inLibrary}
                                            toggleInLibrary={metaDetails.metaItem.content.content.inLibrary ? removeFromLibrary : addToLibrary}
                                        />
                                    </React.Fragment>
                }
                <div className={styles['spacing']} />
                {
                    streamPath !== null ?
                        <StreamsList
                            className={styles['streams-list']}
                            streams={metaDetails.streams}
                        />
                        :
                        metaPath !== null ?
                            <VideosList
                                className={styles['videos-list']}
                                metaItem={metaDetails.metaItem}
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
