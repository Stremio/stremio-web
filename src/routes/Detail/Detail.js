const React = require('react');
const { NavBar, MetaPreview } = require('stremio/common');
const VideosList = require('./VideosList');
const StreamsList = require('./StreamsList');
const useMetaDetails = require('./useMetaDetails');
const useInLibrary = require('./useInLibrary');
const styles = require('./styles');

const Detail = ({ urlParams }) => {
    const [meta, streams] = useMetaDetails(urlParams);
    const [inLibrary, addToLibrary, removeFromLibrary, toggleInLibrary] = useInLibrary(urlParams.id);
    return (
        <div className={styles['detail-container']}>
            <NavBar
                className={styles['nav-bar']}
                backButton={true}
                title={meta !== null && meta.content.type === 'Ready' ? meta.content.content.name : null}
            />
            <div className={styles['detail-content']}>
                {
                    meta !== null && meta.content.type === 'Ready' ?
                        <React.Fragment>
                            <div className={styles['background-image-layer']}>
                                <img className={styles['background-image']} src={meta.content.content.background} alt={' '} />
                            </div>
                            <MetaPreview
                                {...meta.content.content}
                                className={styles['meta-preview']}
                                background={null}
                                inLibrary={inLibrary}
                                toggleInLibrary={toggleInLibrary}
                            />
                        </React.Fragment>
                        :
                        <MetaPreview.Placeholder className={styles['meta-preview']} />
                }
                {
                    typeof urlParams.videoId === 'string' && urlParams.videoId.length > 0 ?
                        <StreamsList className={styles['streams-list']} streams={streams} />
                        :
                        <VideosList className={styles['videos-list']} meta={meta} />
                }
            </div>
        </div>
    );
};

module.exports = Detail;
