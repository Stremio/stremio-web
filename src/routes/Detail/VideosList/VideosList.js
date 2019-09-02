const React = require('react');
const PropTypes = require('prop-types');
const classnames = require('classnames');
const Icon = require('stremio-icons/dom');
const { Button, Popup, useBinaryState } = require('stremio/common');
const Video = require('./Video');
const VideoPlaceholder = require('./VideoPlaceholder');
const useSeasons = require('./useSeasons');
require('./styles');

const VideosList = ({ className, metaItem }) => {
    const [season, seasons, setSeason, setPrevSeason, setNextSeason] = useSeasons(metaItem);
    const [menuOpen, openMenu, closeMenu, toggleMenu] = useBinaryState(false);
    const seasonOnClick = React.useCallback((event) => {
        closeMenu();
        const season = parseInt(event.currentTarget.dataset.season);
        if (!isNaN(season)) {
            setSeason(season);
        }
    }, []);
    return (
        <div className={classnames(className, 'videos-list-container')}>
            {
                metaItem !== null ?
                    <React.Fragment>
                        {
                            seasons.length > 1 ?
                                <div className={'seasons-bar'}>
                                    <Button className={'prev-season-button'} onClick={setPrevSeason}>
                                        <Icon className={'icon'} icon={'ic_arrow_left'} />
                                    </Button>
                                    <Popup
                                        open={menuOpen}
                                        menuMatchLabelWidth={true}
                                        onCloseRequest={closeMenu}
                                        renderLabel={(ref) => (
                                            <Button ref={ref} className={classnames('seasons-popup-label-container', { 'active': menuOpen })} onClick={toggleMenu}>
                                                <div className={'season-label'}>Season</div>
                                                <div className={'number-label'}>{season}</div>
                                            </Button>
                                        )}
                                        renderMenu={() => (
                                            <div className={'seasons-menu-container'}>
                                                {seasons.map((season) => (
                                                    <Button key={season} className={'season-option-container'} data-season={season} onClick={seasonOnClick}>
                                                        <div className={'season-label'}>Season</div>
                                                        <div className={'number-label'}>{season}</div>
                                                    </Button>
                                                ))}
                                            </div>
                                        )}
                                    />
                                    <Button className={'next-season-button'} onClick={setNextSeason}>
                                        <Icon className={'icon'} icon={'ic_arrow_right'} />
                                    </Button>
                                </div>
                                :
                                null
                        }
                        <div className={'videos-container'}>
                            {
                                metaItem.videos
                                    .filter((video) => isNaN(season) || video.season === season)
                                    .map((video) => (
                                        <Video
                                            {...video}
                                            key={video.id}
                                            className={'video'}
                                        />
                                    ))
                            }
                        </div>
                    </React.Fragment>
                    :
                    <React.Fragment>
                        <div className={'videos-container'}>
                            <VideoPlaceholder className={'video'} />
                            <VideoPlaceholder className={'video'} />
                            <VideoPlaceholder className={'video'} />
                            <VideoPlaceholder className={'video'} />
                            <VideoPlaceholder className={'video'} />
                            <VideoPlaceholder className={'video'} />
                        </div>
                    </React.Fragment>
            }
        </div>
    );
};

VideosList.propTypes = {
    className: PropTypes.string,
    metaItem: PropTypes.object
};

module.exports = VideosList;
