import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Icon from 'stremio-icons/dom';
import Video from './Video';
import styles from './styles';

class VideosList extends Component {
    constructor(props) {
        super(props);

        this.seasons = this.props.videos.map((video) => video.season)
            .filter((season, index, seasons) => seasons.indexOf(season) === index);

        this.state = {
            selectedSeason: this.seasons[0]
        }
    }

    changeSeason = (event) => {
        this.setState({ selectedSeason: parseInt(event.target.value) });
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

    render() {
        return (
            <div className={styles['videos-list-container']}>
                <div className={styles['seasons-bar']}>
                    <div className={styles['button-container']} onClick={this.onPrevButtonClicked}>
                        <Icon className={styles['button-icon']} icon={'ic_arrow_left'} />
                    </div>
                    <select value={this.state.selectedSeason} onChange={this.changeSeason}>
                        {this.seasons.map((season) =>
                            <option key={season} value={season}>
                                {season}
                            </option>
                        )}
                    </select>
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
                                poster={video.poster}
                                episode={video.episode}
                                title={video.name}
                                released={video.released}
                                isWatched={video.isWatched}
                                isUpcoming={video.isUpcoming}
                                progress={video.progress}
                            />
                        )}
                </div>
            </div>
        );
    }
}

VideosList.propTypes = {
    videos: PropTypes.arrayOf(PropTypes.object).isRequired
};
VideosList.defaultProps = {
    videos: []
};

export default VideosList;
