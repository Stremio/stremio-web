const React = require('react');
const { NavBar, MetaPreview } = require('stremio/common');
const VideosList = require('./VideosList');
const StreamsList = require('./StreamsList');
const useMetaDetails = require('./useMetaDetails');
const useSelectableGroups = require('./useSelectableGroups');
const styles = require('./styles');

const Detail = ({ urlParams }) => {
    const [meta, streams] = useMetaDetails(urlParams);
    const [metaResourceRef, metaGroups, selectedMetaGroup] = useSelectableGroups(meta.resourceRef, meta.groups);
    const { resourceRef: streamsResourceRef, groups: streamsGroups } = streams;
    return (
        <div className={styles['detail-container']}>
            <NavBar
                className={styles['nav-bar']}
                backButton={true}
                title={selectedMetaGroup !== null ? selectedMetaGroup.content.content.name : null}
            />
            <div className={styles['detail-content']}>
                {
                    metaResourceRef !== null ?
                        selectedMetaGroup !== null ?
                            <React.Fragment>
                                <div className={styles['background-image-layer']}>
                                    <img
                                        className={styles['background-image']}
                                        src={selectedMetaGroup.content.content.background}
                                        alt={' '}
                                    />
                                </div>
                                <MetaPreview
                                    {...selectedMetaGroup.content.content}
                                    className={styles['meta-preview']}
                                    background={null}
                                />
                            </React.Fragment>
                            :
                            metaGroups.length === 0 ?
                                <MetaPreview
                                    className={styles['meta-preview']}
                                    name={'No addons ware requested for this meta'}
                                />
                                :
                                metaGroups.every((group) => group.content.type === 'Err') ?
                                    <MetaPreview
                                        className={styles['meta-preview']}
                                        name={'No metadata was found'}
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

module.exports = Detail;
