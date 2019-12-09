const React = require('react');
const { NavBar, MetaPreview, useInLibrary } = require('stremio/common');
const VideosList = require('./VideosList');
const StreamsList = require('./StreamsList');
const useMetaDetails = require('./useMetaDetails');
const useSelectableResource = require('./useSelectableResource');
const styles = require('./styles');

const MetaDetails = ({ urlParams }) => {
    const metaDetails = useMetaDetails(urlParams);
    const [metaResourceRef, metaResources, selectedMetaResource] = useSelectableResource(metaDetails.selected.meta_resource_ref, metaDetails.meta_resources);
    const streamsResourceRef = metaDetails.selected.streams_resource_ref;
    const streamsResources = metaDetails.streams_resources;
    const [inLibrary, , , toggleInLibrary] = useInLibrary(metaResourceRef !== null ? metaResourceRef.id : null);
    return (
        <div className={styles['metadetails-container']}>
            <NavBar
                className={styles['nav-bar']}
                backButton={true}
                title={selectedMetaResource !== null ? selectedMetaResource.content.content.name : null}
            />
            <div className={styles['metadetails-content']}>
                {
                    metaResourceRef === null ?
                        <MetaPreview
                            className={styles['meta-preview']}
                            name={'No meta was selected'}
                        />
                        :
                        metaResources.length === 0 ?
                            <MetaPreview
                                className={styles['meta-preview']}
                                name={'No addons ware requested for this meta'}
                                inLibrary={inLibrary}
                                toggleInLibrary={toggleInLibrary}
                            />
                            :
                            metaResources.every((metaResource) => metaResource.content.type === 'Err') ?
                                <MetaPreview
                                    className={styles['meta-preview']}
                                    name={'No metadata was found'}
                                    inLibrary={inLibrary}
                                    toggleInLibrary={toggleInLibrary}
                                />
                                :
                                selectedMetaResource !== null ?
                                    <React.Fragment>
                                        {
                                            typeof selectedMetaResource.content.content.background === 'string' &&
                                                selectedMetaResource.content.content.background.length > 0 ?
                                                <div className={styles['background-image-layer']}>
                                                    <img
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

module.exports = MetaDetails;
