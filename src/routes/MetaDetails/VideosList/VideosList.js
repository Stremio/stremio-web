const React = require('react');
const PropTypes = require('prop-types');
const classnames = require('classnames');
const Icon = require('stremio-icons/dom');
const Image = require('stremio/common/Image');
const TextInput = require('stremio/common/TextInput');
const SeasonsBar = require('./SeasonsBar');
const Video = require('./Video');
const useSelectableSeasons = require('./useSelectableSeasons');
const styles = require('./styles');

const VideosList = ({ className, metaResource }) => {
    const videos = React.useMemo(() => {
        return metaResource && metaResource.content.type === 'Ready' ?
            metaResource.content.content.videos
            :
            [];
    }, [metaResource]);
    const [seasons, selectedSeason, videosForSeason, selectSeason] = useSelectableSeasons(videos);
    const seasonOnSelect = React.useCallback((event) => {
        selectSeason(event.value);
    }, []);
    const [search, setSearch] = React.useState('');
    const searchInputOnChange = React.useCallback((event) => {
        setSearch(event.currentTarget.value);
    }, []);
    return (
        <div className={classnames(className, styles['videos-list-container'])}>
            {
                !metaResource || metaResource.content.type === 'Loading' ?
                    <React.Fragment>
                        <SeasonsBar.Placeholder className={styles['seasons-bar']} />
                        <div className={styles['videos-scroll-container']}>
                            <Video.Placeholder className={styles['video']} />
                            <Video.Placeholder className={styles['video']} />
                            <Video.Placeholder className={styles['video']} />
                            <Video.Placeholder className={styles['video']} />
                            <Video.Placeholder className={styles['video']} />
                        </div>
                    </React.Fragment>
                    :
                    metaResource.content.type === 'Err' || videosForSeason.length === 0 ?
                        <div className={styles['message-container']}>
                            <Image className={styles['image']} src={'/images/empty.png'} alt={' '} />
                            <div className={styles['label']}>No videos found for this meta!</div>
                        </div>
                        :
                        <React.Fragment>
                            {
                                seasons.length > 1 ?
                                    <SeasonsBar
                                        className={styles['seasons-bar']}
                                        season={selectedSeason}
                                        seasons={seasons}
                                        onSelect={seasonOnSelect}
                                    />
                                    :
                                    null
                            }
                            <div className={styles['search-container']}>
                                <label className={styles['search-bar-container']}>
                                    <TextInput
                                        className={styles['search-input']}
                                        type={'text'}
                                        placeholder={'Search videos'}
                                        value={search}
                                        onChange={searchInputOnChange}
                                    />
                                    <Icon className={styles['icon']} icon={'ic_search'} />
                                </label>
                            </div>
                            <div className={styles['videos-scroll-container']}>
                                {videosForSeason
                                    .filter((video) => {
                                        return search.length === 0 ||
                                            (
                                                (typeof video.title === 'string' && video.title.toLowerCase().includes(search.toLowerCase())) ||
                                                (video.released.toLocaleString(undefined, { year: '2-digit', month: 'short', day: 'numeric' }).toLowerCase().includes(search.toLowerCase()))
                                            );
                                    })
                                    .map((video, index) => (
                                        <Video
                                            {...video}
                                            key={index}
                                            className={styles['video']}
                                        />
                                    ))}
                            </div>
                        </React.Fragment>
            }
        </div>
    );
};

VideosList.propTypes = {
    className: PropTypes.string,
    metaResource: PropTypes.object
};

module.exports = VideosList;
