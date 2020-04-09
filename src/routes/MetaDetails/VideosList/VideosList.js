// Copyright (C) 2017-2020 Smart code 203358507

const React = require('react');
const PropTypes = require('prop-types');
const classnames = require('classnames');
const Image = require('stremio/common/Image');
const SearchBar = require('stremio/common/SearchBar');
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
                        <SearchBar.Placeholder className={styles['search-bar']} title={'Search videos'} />
                        <div className={styles['videos-scroll-container']}>
                            <Video.Placeholder />
                            <Video.Placeholder />
                            <Video.Placeholder />
                            <Video.Placeholder />
                            <Video.Placeholder />
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
                            <SearchBar
                                className={styles['search-bar']}
                                title={'Search videos'}
                                value={search}
                                onChange={searchInputOnChange}
                            />
                            <div className={styles['videos-container']}>
                                {
                                    videosForSeason
                                        .filter((video) => {
                                            return search.length === 0 ||
                                                (
                                                    (typeof video.title === 'string' && video.title.toLowerCase().includes(search.toLowerCase())) ||
                                                    (video.released.toLocaleString(undefined, { year: '2-digit', month: 'short', day: 'numeric' }).toLowerCase().includes(search.toLowerCase()))
                                                );
                                        })
                                        .map((video, index) => (
                                            <Video {...video} key={index} />
                                        ))
                                }
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
