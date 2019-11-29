const React = require('react');
const { NavBar, MetaPreview, useInLibrary } = require('stremio/common');
const VideosList = require('./VideosList');
const StreamsList = require('./StreamsList');
const useMetaDetails = require('./useMetaDetails');
const useSelectableGroups = require('./useSelectableGroups');
const styles = require('./styles');

const MetaDetails = ({ urlParams }) => {
    const metaDetails = useMetaDetails(urlParams);
    const [metaResourceRef, metaGroups, selectedMetaGroup] = useSelectableGroups(metaDetails.selected.meta_resource_ref, metaDetails.meta_groups);
    const streamsResourceRef = metaDetails.selected.streams_resource_ref;
    const streamsGroups = metaDetails.streams_groups;
    const [inLibrary, , , toggleInLibrary] = useInLibrary(metaResourceRef ? metaResourceRef.id : null);
    return (
        <div className={styles['metadetails-container']}>
            <NavBar
                className={styles['nav-bar']}
                backButton={true}
                title={selectedMetaGroup !== null ? selectedMetaGroup.content.content.name : null}
            />
            <div className={styles['metadetails-content']}>
                {
                    metaResourceRef !== null ?
                        selectedMetaGroup !== null ?
                            <React.Fragment>
                                {
                                    typeof selectedMetaGroup.content.content.background === 'string' &&
                                        selectedMetaGroup.content.content.background.length > 0 ?
                                        <div className={styles['background-image-layer']}>
                                            <img
                                                className={styles['background-image']}
                                                src={selectedMetaGroup.content.content.background}
                                                alt={' '}
                                            />
                                        </div>
                                        :
                                        null
                                }
                                <MetaPreview
                                    {...selectedMetaGroup.content.content}
                                    className={styles['meta-preview']}
                                    background={null}
                                    inLibrary={inLibrary}
                                    toggleInLibrary={toggleInLibrary}
                                />
                            </React.Fragment>
                            :
                            metaGroups.length === 0 ?
                                <MetaPreview
                                    className={styles['meta-preview']}
                                    name={'No addons ware requested for this meta'}
                                    inLibrary={inLibrary}
                                    toggleInLibrary={toggleInLibrary}
                                />
                                :
                                metaGroups.every((group) => group.content.type === 'Err') ?
                                    <MetaPreview
                                        className={styles['meta-preview']}
                                        name={'No metadata was found'}
                                        inLibrary={inLibrary}
                                        toggleInLibrary={toggleInLibrary}
                                    />
                                    :
                                    <MetaPreview.Placeholder
                                        className={styles['meta-preview']}
                                    />
                        :
                        null
                }
                {
                    streamsResourceRef !== null ?
                        <StreamsList
                            className={styles['streams-list']}
                            streamsGroups={streamsGroups}
                        />
                        :
                        metaResourceRef !== null ?
                            <VideosList
                                className={styles['videos-list']}
                                metaGroup={selectedMetaGroup}
                            />
                            :
                            null
                }
            </div>
        </div>
    );
};

module.exports = MetaDetails;
