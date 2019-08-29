const React = require('react');
const { NavBar, MetaPreview } = require('stremio/common');
const VideosList = require('./VideosList');
const StreamsList = require('./StreamsList');
const useMetaItem = require('./useMetaItem');
const useInLibrary = require('./useInLibrary');
require('./styles');

const Detail = ({ urlParams }) => {
    const metaItem = useMetaItem(urlParams.type, urlParams.id, urlParams.videoId);
    const [inLibrary, addToLibrary, removeFromLibrary, toggleInLibrary] = useInLibrary(urlParams.id);
    return (
        <div className={'detail-container'}>
            <NavBar
                className={'nav-bar'}
                backButton={true}
                title={metaItem !== null ? metaItem.name : null}
            />
            <div className={'detail-content'}>
                {
                    metaItem !== null ?
                        <MetaPreview
                            {...metaItem}
                            className={'meta-preview'}
                            background={null}
                            inLibrary={inLibrary}
                            toggleInLibrary={toggleInLibrary}
                        />
                        :
                        null
                }
                {
                    typeof urlParams.videoId === 'string' && urlParams.videoId.length > 0 ?
                        <StreamsList
                            className={'streams-list'}
                            metaItem={metaItem}
                        />
                        :
                        <VideosList
                            className={'videos-list'}
                            metaItem={metaItem}
                        />
                }
            </div>
        </div>
    );
};

module.exports = Detail;
