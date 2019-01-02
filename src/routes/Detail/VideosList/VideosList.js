import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import Icon from 'stremio-icons/dom';
import { Popup } from 'stremio-common';
import Video from './Video';
import styles from './styles';

class VideosList extends Component {
    constructor(props) {
        super(props);

        this.seasonsPopupRef = React.createRef();
        this.seasons = this.props.videos.map((video) => video.season)
            .filter((season, index, seasons) => seasons.indexOf(season) === index);

        this.state = {
            selectedSeason: this.seasons[0],
            selectedVideoId: 0
        }
    }

    changeSeason = (event) => {
        this.setState({ selectedSeason: parseInt(event.currentTarget.dataset.season) });
        this.seasonsPopupRef.current && this.seasonsPopupRef.current.close();
    }

    shouldComponentUpdate(nextProps, nextState) {
        return nextState.selectedSeason !== this.state.selectedSeason;
    }

    onPrevButtonClicked = () => {
        const prevSeasonIndex = Math.max(this.seasons.indexOf(this.state.selectedSeason) - 1, 0);
        this.setState({ selectedSeason: this.seasons[prevSeasonIndex] });
    }

    onNextButtonClicked = () => {
        const nextSeasonIndex = Math.min(this.seasons.indexOf(this.state.selectedSeason) + 1, this.seasons.length - 1);
        this.setState({ selectedSeason: this.seasons[nextSeasonIndex] });
    }

    onClick = (event) => {
        this.setState({ selectedVideoId: event.currentTarget.dataset.videoId });
        console.log(event.currentTarget.dataset.videoId);
    }

    render() {
        return (
            <div className={classnames(styles['videos-list-container'], this.props.className)}>
                <div className={styles['seasons-bar']}>
                    <div className={styles['button-container']} onClick={this.onPrevButtonClicked}>
                        <Icon className={styles['button-icon']} icon={'ic_arrow_left'} />
                    </div>
                    <Popup ref={this.seasonsPopupRef} className={styles['popup-container']} border={true}>
                        <Popup.Label>
                            <div className={styles['control-bar-button']}>
                                S {this.state.selectedSeason}
                                <Icon className={styles['icon']} icon={'ic_arrow_down'} />
                            </div>
                        </Popup.Label>
                        <Popup.Menu>
                            <div className={styles['popup-content']}>
                                {this.seasons.map((season) =>
                                    <div className={styles['season']} key={season} data-season={season} onClick={this.changeSeason}>
                                        S {season}
                                    </div>
                                )}
                            </div>
                        </Popup.Menu>
                    </Popup>
                    <div className={styles['button-container']} onClick={this.onNextButtonClicked} >
                        <Icon className={styles['button-icon']} icon={'ic_arrow_left'} />
                    </div>
                </div>
                <div className={styles['scroll-container']}>
                    {this.props.videos
                        .filter((video) => video.season === this.state.selectedSeason)
                        .map((video) =>
                            <Video key={video.id}
                                className={styles['video']}
                                id={video.id}
                                poster={video.poster}
                                episode={video.episode}
                                season={video.season}
                                title={video.name}
                                released={video.released}
                                isWatched={video.isWatched}
                                isUpcoming={video.isUpcoming}
                                progress={video.progress}
                                onClick={this.onClick}
                            />
                        )}
                </div>
            </div>
        );
    }
}

VideosList.propTypes = {
    className: PropTypes.string,
    videos: PropTypes.arrayOf(PropTypes.object).isRequired
};
VideosList.defaultProps = {
    videos: []
};

export default VideosList;
