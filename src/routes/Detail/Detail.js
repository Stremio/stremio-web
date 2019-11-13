const React = require('react');
const { NavBar, MetaPreview } = require('stremio/common');
const VideosList = require('./VideosList');
const StreamsList = require('./StreamsList');
const useMetaDetails = require('./useMetaDetails');
const styles = require('./styles');

const metaStateReducer = (state, action) => {
    switch (action.type) {
        case 'groups-changed': {
            if (state.selectedGroup !== null) {
                const selectedGroupIncluded = action.groups.some((group) => {
                    return group.req.base === state.selectedGroup.req.base &&
                        group.content.type === 'Ready';
                });
                if (selectedGroupIncluded) {
                    return {
                        ...state,
                        resourceRef: action.resourceRef,
                        groups: action.groups
                    };
                }
            }

            const readyGroup = action.groups.find((group) => group.content.type === 'Ready');
            const selectedGroup = readyGroup ? readyGroup : null;
            return {
                ...state,
                resourceRef: action.resourceRef,
                groups: action.groups,
                selectedGroup
            };
        }
        case 'group-selected': {
            const selectedGroup = state.groups.find((group) => {
                return group.req.base === action.base &&
                    group.content.type === 'Ready';
            });
            if (selectedGroup) {
                return {
                    ...state,
                    selectedGroup
                };
            }

            return state;
        }
        default: {
            return state;
        }
    }
};

const Detail = ({ urlParams }) => {
    const [metaGroups, streamsGroups, [metaResourceRef, streamsResourceRef]] = useMetaDetails(urlParams);
    const [metaState, metaStateDispatch] = React.useReducer(
        metaStateReducer,
        [metaResourceRef, metaGroups],
        ([resourceRef, groups]) => {
            const readyGroup = groups.find((group) => group.content.type === 'Ready');
            const selectedGroup = readyGroup ? readyGroup : null;
            return {
                resourceRef,
                groups,
                selectedGroup
            };
        }
    );
    React.useEffect(() => {
        metaStateDispatch({
            type: 'groups-changed',
            resourceRef: metaResourceRef,
            groups: metaGroups
        });
    }, [metaGroups]);
    return (
        <div className={styles['detail-container']}>
            <NavBar
                className={styles['nav-bar']}
                backButton={true}
                title={metaState.selectedGroup !== null ? metaState.selectedGroup.content.content.name : null}
            />
            <div className={styles['detail-content']}>
                {
                    metaState.resourceRef !== null ?
                        metaState.selectedGroup !== null ?
                            <React.Fragment>
                                <div className={styles['background-image-layer']}>
                                    <img
                                        className={styles['background-image']}
                                        src={metaState.selectedGroup.content.content.background}
                                        alt={' '}
                                    />
                                </div>
                                <MetaPreview
                                    {...metaState.selectedGroup.content.content}
                                    className={styles['meta-preview']}
                                    background={null}
                                />
                            </React.Fragment>
                            :
                            metaState.groups.length === 0 ?
                                <MetaPreview
                                    className={styles['meta-preview']}
                                    name={'No addons ware requested for this meta'}
                                />
                                :
                                metaState.groups.every((group) => group.content.type === 'Err') ?
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
                        metaState.resourceRef !== null ?
                            <VideosList
                                className={styles['videos-list']}
                                metaGroup={metaState.selectedGroup}
                            />
                            :
                            null
                }
            </div>
        </div>
    );
};

module.exports = Detail;
