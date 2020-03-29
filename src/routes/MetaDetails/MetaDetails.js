const React = require('react');
const PropTypes = require('prop-types');
const { HorizontalNavBar, MetaPreview, Image, useInLibrary } = require('stremio/common');
const StreamsList = require('./StreamsList');
const VideosList = require('./VideosList');
const useMetaDetails = require('./useMetaDetails');
const useSelectableResource = require('./useSelectableResource');
const styles = require('./styles');

const MetaDetails = ({ urlParams }) => {
    const metaDetails = useMetaDetails(urlParams);
    const [metaResourceRef, metaResources, selectedMetaResource] = useSelectableResource(
        metaDetails.selected !== null ? metaDetails.selected.meta_resource_ref : null,
        metaDetails.meta_resources
    );
    const streamsResourceRef = metaDetails.selected !== null ? metaDetails.selected.streams_resource_ref : null;
    const streamsResources = metaDetails.streams_resources;
    const [inLibrary, toggleInLibrary] = useInLibrary(
        selectedMetaResource !== null ? selectedMetaResource.content.content : null
    );
    return (
        <div className={styles['metadetails-container']}>
            <HorizontalNavBar
                className={styles['nav-bar']}
                backButton={true}
                title={selectedMetaResource !== null ? selectedMetaResource.content.content.name : null}
            />
            <div className={styles['metadetails-content']}>
                {
                    metaResourceRef === null ?
                        <div className={styles['meta-message-container']}>
                            <Image className={styles['image']} src={'/images/empty.png'} alt={' '} />
                            <div className={styles['message-label']}>No meta was selected!</div>
                        </div>
                        :
                        metaResources.length === 0 ?
                            <div className={styles['meta-message-container']}>
                                <Image className={styles['image']} src={'/images/empty.png'} alt={' '} />
                                <div className={styles['message-label']}>No addons ware requested for this meta!</div>
                            </div>
                            :
                            metaResources.every((metaResource) => metaResource.content.type === 'Err') ?
                                <div className={styles['meta-message-container']}>
                                    <Image className={styles['image']} src={'/images/empty.png'} alt={' '} />
                                    <div className={styles['message-label']}>No metadata was found!</div>
                                </div>
                                :
                                selectedMetaResource !== null ?
                                    <React.Fragment>
                                        {
                                            typeof selectedMetaResource.content.content.background === 'string' &&
                                                selectedMetaResource.content.content.background.length > 0 ?
                                                <div className={styles['background-image-layer']}>
                                                    <Image
                                                        className={styles['background-image']}
                                                        src={selectedMetaResource.content.content.background}
                                                        alt={' '}
                                                    />
                                                </div>
                                                :
                                                null
                                        }
                                        <MetaPreview
                                            className={styles['meta-preview']}
                                            name={selectedMetaResource.content.content.name}
                                            logo={selectedMetaResource.content.content.logo}
                                            background={null}
                                            runtime={selectedMetaResource.content.content.runtime}
                                            releaseInfo={selectedMetaResource.content.content.releaseInfo}
                                            released={selectedMetaResource.content.content.released}
                                            description={selectedMetaResource.content.content.description}
                                            links={selectedMetaResource.content.content.links}
                                            trailer={selectedMetaResource.content.content.trailer}
                                            inLibrary={inLibrary}
                                            toggleInLibrary={toggleInLibrary}
                                        />
                                    </React.Fragment>
                                    :
                                    <MetaPreview.Placeholder
                                        className={styles['meta-preview']}
                                    />
                }
                {
                    streamsResourceRef !== null ?
                        <StreamsList
                            className={styles['streams-list']}
                            streamsResources={streamsResources}
                        />
                        :
                        metaResourceRef !== null ?
                            <VideosList
                                className={styles['videos-list']}
                                metaResource={selectedMetaResource}
                            />
                            :
                            null
                }
            </div>
        </div>
    );
};

MetaDetails.propTypes = {
    urlParams: PropTypes.shape({
        type: PropTypes.string,
        id: PropTypes.string,
        videoId: PropTypes.string
    })
};

module.exports = MetaDetails;
