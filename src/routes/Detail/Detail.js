const React = require('react');
const { NavBar, MetaPreview } = require('stremio/common');
const useMetaItem = require('./useMetaItem');
const useInLibrary = require('./useInLibrary');
require('./styles');

const Detail = ({ urlParams }) => {
    const metaItem = useMetaItem(urlParams.type, urlParams.id, urlParams.videoId);
    const [inLibrary, addToLibrary, removeFromLibrary, toggleInLibrary] = useInLibrary(urlParams.id);
    return (
        <div className={'detail-container'}>
            <NavBar className={'nav-bar'} backButton={true} title={metaItem.name} />
            <div className={'detail-content'}>
                <MetaPreview
                    {...metaItem}
                    className={'meta-preview'}
                    background={null}
                    inLibrary={inLibrary}
                    toggleInLibrary={toggleInLibrary}
                />
            </div>
        </div>
    );
};

module.exports = Detail;
