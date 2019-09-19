const React = require('react');
const { NavBar, MetaPreview, MetaPreviewPlaceholder } = require('stremio/common');
const VideosList = require('./VideosList');
const StreamsList = require('./StreamsList');
const useMetaItem = require('./useMetaItem');
const useInLibrary = require('./useInLibrary');
const styles = require('./styles');

const Detail = ({ urlParams }) => {
    const metaItem = useMetaItem(urlParams.type, urlParams.id, urlParams.videoId);
    const [inLibrary, addToLibrary, removeFromLibrary, toggleInLibrary] = useInLibrary(urlParams.id);
    return (
        <div className={styles['detail-container']}>
            <NavBar
                className={styles['nav-bar']}
                backButton={true}
                title={metaItem !== null ? metaItem.name : null}
            />
            <div className={styles['detail-content']}>
                {
                    metaItem !== null ?
                        <React.Fragment>
                            <div className={styles['background-image-layer']}>
                                <img className={styles['background-image']} src={metaItem.background} alt={' '} />
                            </div>
                            <MetaPreview
                                {...metaItem}
                                className={styles['meta-preview']}
                                background={null}
                                inLibrary={inLibrary}
                                toggleInLibrary={toggleInLibrary}
                            />
                        </React.Fragment>
                        :
                        <MetaPreviewPlaceholder className={styles['meta-preview']} />
                }
                {
                    typeof urlParams.videoId === 'string' && urlParams.videoId.length > 0 ?
                        <StreamsList className={styles['streams-list']} metaItem={metaItem} />
                        :
                        <VideosList className={styles['videos-list']} metaItem={metaItem} />
                }
            </div>
        </div>
    );
};

module.exports = Detail;
