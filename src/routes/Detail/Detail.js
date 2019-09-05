const React = require('react');
const classnames = require('classnames');
const { NavBar, MetaPreview, MetaPreviewPlaceholder, placeholderStyles } = require('stremio/common');
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
                <div className={'background-image-layer'}>
                    <img
                        className={'background-image'}
                        src={metaItem !== null ? metaItem.background : null}
                        alt={' '}
                    />
                </div>
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
                        <MetaPreviewPlaceholder
                            className={classnames('meta-preview', placeholderStyles['placeholder-container'])}
                        />
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
