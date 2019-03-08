import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import Icon from 'stremio-icons/dom';
import styles from './styles';

const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

class Calendar extends Component {
    constructor(props) {
        super(props);

        this.resetMonth(new Date());

        this.dateRef = React.createRef();
        this.futureEpisodesRef = React.createRef();

        this.state = {
            date: new Date(),
            episodeInfo: '',
            selectedDate: new Date()
        };
    }

    changeDate = (event) => {
        const date = new Date(parseInt(event.currentTarget.dataset.date));
        this.resetMonth(date);
        this.setState({ date });
    }

    showEpisodeInfo = (event) => {
        event.stopPropagation();
        this.setState({ episodeInfo: event.currentTarget.dataset.videoName, selectedDate: new Date(event.currentTarget.dataset.videoDate) });
    }

    changeSelectedDate = (event) => {
        const selectedDate = new Date(event.currentTarget.dataset.day);

        var firstEpisode = this.props.metaItems
            .map((metaitem) => metaitem.videos
                .filter((video) => video.released.getFullYear() === this.state.date.getFullYear() && video.released.getMonth() === this.state.date.getMonth() && video.released.getDate() === selectedDate.getDate())
                .map((video) => video.name))
            .filter((videos) => videos.length > 0)
            .join()
            .split(',')[0];

        if (firstEpisode.length > 0) {
            this.setState({ episodeInfo: firstEpisode, selectedDate });
        } else {
            this.setState({ selectedDate });
        }
    }

    scrollTo = () => {
        if (this.dateRef.current !== null) {
            var topPosition = this.dateRef.current.offsetTop;
            this.futureEpisodesRef.current.scrollTop = topPosition - this.futureEpisodesRef.current.offsetTop;
        } else {
            this.setState({ episodeInfo: '' });
        }
    }

    resetMonth(newDate) {
        this.monthDays = [];
        this.monthStart = new Date(newDate.getFullYear(), newDate.getMonth());
        this.monthEnd = new Date(this.monthStart.getFullYear(), this.monthStart.getMonth() + 1, 0);
        this.pads = [];
        var pad = (this.monthStart.getDay() + 6) % 7;

        for (var i = 0; i != pad; i++) {
            this.pads.push(i);
        }

        for (var i = 0; i != this.monthEnd.getDate(); i++) {
            this.monthDays.push(i);
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        return nextState.date !== this.state.date ||
            nextState.episodeInfo !== this.state.episodeInfo ||
            nextState.selectedDate !== this.state.selectedDate;
    }

    componentDidMount() {
        this.scrollTo();
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevState.selectedDate !== this.state.selectedDate) {
            this.scrollTo();
        }

        if (prevState.date.getMonth() !== this.state.date.getMonth()) {
            this.setState({ selectedDate: new Date(this.state.date.getFullYear(), this.state.date.getMonth(), 1) });
            const newDate = this.state.date;
            this.resetMonth(newDate);
        }
    }

    renderMonthButton(date) {
        return (
            <div className={styles['month']} data-date={date.getTime()} onClick={this.changeDate}>{months[date.getMonth()]}</div>
        );
    }

    render() {
        const videosDates = this.props.metaItems
            .map((metaitem) => metaitem.videos
                .filter((video) => video.released.getFullYear() === this.state.date.getFullYear() && video.released.getMonth() === this.state.date.getMonth()))
            .filter((videos) => videos.length > 0)
            .map((videos) => videos.map((video) => video.released.getDate()));

        return (
            <div className={styles['calendar-container']}>
                <div className={styles['calendar']}>
                    <div className={styles['months']}>
                        {this.renderMonthButton(new Date((new Date(this.state.date)).setMonth(this.state.date.getMonth() - 1)))}
                        {this.renderMonthButton(new Date(this.state.date))}
                        {this.renderMonthButton(new Date((new Date(this.state.date)).setMonth(this.state.date.getMonth() + 1)))}
                    </div>
                    <div className={styles['week-days']}>
                        {days.map((day) => <div key={day} className={styles['day']}>{day}</div>)}
                    </div>
                    <div className={styles['month-days']}>
                        {this.pads.map((pad) =>
                            <div key={pad} className={styles['pad']} />
                        )}
                        {this.monthDays.map((day) =>
                            <div key={day}
                                className={classnames(styles['day'], { [styles['selected']]: this.state.selectedDate.getDate() === day + 1 })}
                                data-day={new Date(this.state.date.getFullYear(), this.state.date.getMonth(), day + 1)}
                                onClick={this.changeSelectedDate}
                            >
                                <div className={styles['date-container']}>
                                    <div className={classnames(styles['date'], { [styles['selected']]: this.state.date.getFullYear() === new Date().getFullYear() && this.state.date.getMonth() === new Date().getMonth() && this.state.date.getDate() === day + 1 })}>{day + 1}</div>
                                </div>
                                <div className={styles['episodes']}>
                                    {this.props.metaItems
                                        .map((metaitem) => metaitem.videos
                                            .filter((video) => video.released.getFullYear() === this.state.date.getFullYear() && video.released.getMonth() === this.state.date.getMonth() && video.released.getDate() === day + 1)
                                            .map((video) =>
                                                //////indicator for >3 posters?
                                                //getTime()?
                                                <div key={video.id}
                                                    style={{ backgroundImage: `url('${metaitem.background}')` }}
                                                    className={classnames(styles['poster'], { [styles['past']]: video.released.getDate() < new Date().getDate() && video.released.getMonth() <= new Date().getMonth() })}
                                                    data-video-name={video.name}
                                                    data-video-date={video.released}
                                                    onClick={this.showEpisodeInfo}
                                                />
                                            )
                                        )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
                <div ref={this.futureEpisodesRef} className={styles['future-episodes']}>
                    {
                        videosDates.length > 0
                            ?
                            videosDates
                                .join()
                                .split(',')
                                .filter((date, index, dates) => dates.indexOf(date) === index)
                                .sort(function(a, b) {
                                    return a - b;
                                })
                                .map((videoDate) =>
                                    <div key={videoDate}
                                        ref={parseInt(videoDate) === this.state.selectedDate.getDate() ? this.dateRef : null}
                                        className={classnames(styles['episode-container'], { [styles['selected']]: parseInt(videoDate) === this.state.selectedDate.getDate() })}
                                        data-day={new Date(this.state.date.getFullYear(), this.state.date.getMonth(), parseInt(videoDate))}
                                        onClick={this.changeSelectedDate}
                                    >
                                        <div className={styles['date']}>
                                            {months[this.state.date.getMonth()].slice(0, 3)} {videoDate}
                                        </div>
                                        {this.props.metaItems
                                            .map((metaitem) => metaitem.videos
                                                .filter((video) => video.released.getFullYear() === this.state.date.getFullYear() && video.released.getMonth() === this.state.date.getMonth() && video.released.getDate() === parseInt(videoDate))
                                                .map((video) =>
                                                    <div key={video.name}
                                                        className={classnames(styles['episode'], { [styles['selected']]: this.state.episodeInfo === video.name }, { [styles['today']]: video.released.getFullYear() === new Date().getFullYear() && video.released.getMonth() === new Date().getMonth() && parseInt(videoDate) === new Date().getDate() && this.state.episodeInfo !== video.name })}
                                                        data-video-name={video.name}
                                                        data-video-date={video.released}
                                                        onClick={this.showEpisodeInfo}
                                                    >
                                                        <div className={styles['main-info']}>
                                                            <div className={styles['serie-name']}>
                                                                {metaitem.name}
                                                            </div>
                                                            <div className={styles['episode-number']}>
                                                                S{video.season} E{video.episode}
                                                            </div>
                                                        </div>
                                                        <div className={styles['name']}>
                                                            "{video.name}"
                                                            </div>
                                                        <div className={styles['description']}>
                                                            {video.description}
                                                        </div>
                                                        <a className={styles['watch-button-container']} href={'#/detail'}>
                                                            <div className={styles['watch-button']}>
                                                                <Icon className={styles['icon']} icon={'ic_play'} />
                                                                <div className={styles['label']}>WATCH NOW</div>
                                                            </div>
                                                        </a>
                                                    </div>
                                                )
                                            )}
                                    </div>
                                )
                            :
                            null
                    }
                </div>
            </div>
        );
    }
}

Calendar.propTypes = {
    metaItems: PropTypes.arrayOf(PropTypes.object).isRequired,
    toggleLibraryButton: PropTypes.func
};
Calendar.defaultProps = {
    metaItems: [
        {
            background: 'https://images.metahub.space/poster/medium/tt2306299/img',
            releaseInfo: '2018',
            released: new Date(2018, 4, 23),
            name: 'Vikings',
            videos: [
                { id: '1', poster: 'https://www.stremio.com/websiste/home-stremio.png', episode: 16, name: 'Homeland', description: 'Bjorn achieves one of Ragnars dreams. Back in Kattegat, Ivar hatches a new plan while preparing for a divine arrival. In Iceland, a settler returns in a terrible state. King Alfred faces his greatest threat yet.', released: new Date(2019, 2, 1), isUpcoming: true, isWatched: true, season: 5 },
                { id: '2', poster: 'https://www.stremio.com/websiste/home-stremio.png', episode: 17, name: 'The Buddha', description: 'Bjorn achieves one of Ragnars dreams. Back in Kattegat, Ivar hatches a new plan while preparing for a divine arrival. In Iceland, a settler returns in a terrible state. King Alfred faces his greatest threat yet.', released: new Date(2019, 2, 2), isUpcoming: true, isWatched: true, season: 5 },
                { id: '3', poster: 'https://www.stremio.com/websiste/home-stremio.png', episode: 18, name: 'Boneless', description: 'Bjorn achieves one of Ragnars dreams. Back in Kattegat, Ivar hatches a new plan while preparing for a divine arrival. In Iceland, a settler returns in a terrible state. King Alfred faces his greatest threat yet.', released: new Date(2019, 2, 3), isUpcoming: true, isWatched: true, season: 5 },
                { id: '4', poster: 'https://www.stremio.com/websiste/home-stremio.png', episode: 19, name: 'Revenge', description: 'Bjorn achieves one of Ragnars dreams. Back in Kattegat, Ivar hatches a new plan while preparing for a divine arrival. In Iceland, a settler returns in a terrible state. King Alfred faces his greatest threat yet.', released: new Date(2019, 2, 4), isUpcoming: true, isWatched: true, season: 5 },
                { id: '5', poster: 'https://www.stremio.com/websiste/home-stremio.png', episode: 20, name: 'Ragnarok', description: 'Bjorn achieves one of Ragnars dreams. Back in Kattegat, Ivar hatches a new plan while preparing for a divine arrival. In Iceland, a settler returns in a terrible state. King Alfred faces his greatest threat yet.', released: new Date(2019, 2, 5), isUpcoming: true, isWatched: true, season: 5 }
            ]
        },
        {
            background: 'https://images.metahub.space/poster/medium/tt1520211/img',
            releaseInfo: '2018',
            released: new Date(2018, 4, 23),
            name: 'The Walking Dead',
            videos: [
                { id: '1', poster: 'https://www.stremio.com/websiste/home-stremio.png', episode: 16, name: 'Sing me a song', description: 'Bjorn achieves one of Ragnars dreams. Back in Kattegat, Ivar hatches a new plan while preparing for a divine arrival. In Iceland, a settler returns in a terrible state. King Alfred faces his greatest threat yet.', released: new Date(2019, 2, 7), isUpcoming: true, isWatched: true, season: 5 },
                { id: '2', poster: 'https://www.stremio.com/websiste/home-stremio.png', episode: 17, name: 'Say yes', description: 'Bjorn achieves one of Ragnars dreams. Back in Kattegat, Ivar hatches a new plan while preparing for a divine arrival. In Iceland, a settler returns in a terrible state. King Alfred faces his greatest threat yet.', released: new Date(2019, 2, 12), isUpcoming: true, isWatched: true, season: 5 },
                { id: '3', poster: 'https://www.stremio.com/websiste/home-stremio.png', episode: 18, name: 'Bury me here', description: 'Bjorn achieves one of Ragnars dreams. Back in Kattegat, Ivar hatches a new plan while preparing for a divine arrival. In Iceland, a settler returns in a terrible state. King Alfred faces his greatest threat yet.', released: new Date(2019, 2, 19), isUpcoming: true, isWatched: true, season: 5 },
                { id: '4', poster: 'https://www.stremio.com/websiste/home-stremio.png', episode: 19, name: 'Honor', description: 'Bjorn achieves one of Ragnars dreams. Back in Kattegat, Ivar hatches a new plan while preparing for a divine arrival. In Iceland, a settler returns in a terrible state. King Alfred faces his greatest threat yet.', released: new Date(2019, 4, 3), isUpcoming: true, isWatched: true, season: 5 },
                { id: '5', poster: 'https://www.stremio.com/websiste/home-stremio.png', episode: 20, name: 'The Bridge', description: 'Bjorn achieves one of Ragnars dreams. Back in Kattegat, Ivar hatches a new plan while preparing for a divine arrival. In Iceland, a settler returns in a terrible state. King Alfred faces his greatest threat yet.', released: new Date(2019, 5, 10), isUpcoming: true, isWatched: true, season: 5 }
            ]
        },
        {
            background: 'https://images.metahub.space/poster/medium/tt0944947/img',
            releaseInfo: '2018',
            released: new Date(2018, 4, 23),
            name: 'Game of Thrones',
            videos: [
                { id: '1', poster: 'https://www.stremio.com/websiste/home-stremio.png', episode: 16, name: 'The North Remembers', description: 'Bjorn achieves one of Ragnars dreams. Back in Kattegat, Ivar hatches a new plan while preparing for a divine arrival. In Iceland, a settler returns in a terrible state. King Alfred faces his greatest threat yet.', released: new Date(2019, 2, 4), isUpcoming: true, isWatched: true, season: 5 },
                { id: '2', poster: 'https://www.stremio.com/websiste/home-stremio.png', episode: 17, name: 'Garden of Bones', description: 'Bjorn achieves one of Ragnars dreams. Back in Kattegat, Ivar hatches a new plan while preparing for a divine arrival. In Iceland, a settler returns in a terrible state. King Alfred faces his greatest threat yet.', released: new Date(2019, 2, 10), isUpcoming: true, isWatched: true, season: 5 },
                { id: '3', poster: 'https://www.stremio.com/websiste/home-stremio.png', episode: 18, name: 'Dragonstone', description: 'Bjorn achieves one of Ragnars dreams. Back in Kattegat, Ivar hatches a new plan while preparing for a divine arrival. In Iceland, a settler returns in a terrible state. King Alfred faces his greatest threat yet.', released: new Date(2019, 3, 17), isUpcoming: true, isWatched: true, season: 5 },
                { id: '4', poster: 'https://www.stremio.com/websiste/home-stremio.png', episode: 19, name: 'Stormborn', description: 'Bjorn achieves one of Ragnars dreams. Back in Kattegat, Ivar hatches a new plan while preparing for a divine arrival. In Iceland, a settler returns in a terrible state. King Alfred faces his greatest threat yet.', released: new Date(2019, 4, 3), isUpcoming: true, isWatched: true, season: 5 },
                { id: '5', poster: 'https://www.stremio.com/websiste/home-stremio.png', episode: 20, name: 'Eastwatch', description: 'Bjorn achieves one of Ragnars dreams. Back in Kattegat, Ivar hatches a new plan while preparing for a divine arrival. In Iceland, a settler returns in a terrible state. King Alfred faces his greatest threat yet.', released: new Date(2019, 5, 10), isUpcoming: true, isWatched: true, season: 5 }
            ]
        },
        {
            background: 'https://images.metahub.space/poster/medium/tt0411008/img',
            releaseInfo: '2018',
            released: new Date(2018, 4, 23),
            name: 'Lost',
            videos: [
                { id: '1', poster: 'https://www.stremio.com/websiste/home-stremio.png', episode: 16, name: 'The Lie', description: 'Bjorn achieves one of Ragnars dreams. Back in Kattegat, Ivar hatches a new plan while preparing for a divine arrival. In Iceland, a settler returns in a terrible state. King Alfred faces his greatest threat yet.', released: new Date(2019, 2, 4), isUpcoming: true, isWatched: true, season: 5 },
                { id: '2', poster: 'https://www.stremio.com/websiste/home-stremio.png', episode: 17, name: '316', description: 'Bjorn achieves one of Ragnars dreams. Back in Kattegat, Ivar hatches a new plan while preparing for a divine arrival. In Iceland, a settler returns in a terrible state. King Alfred faces his greatest threat yet.', released: new Date(2019, 2, 10), isUpcoming: true, isWatched: true, season: 5 },
                { id: '3', poster: 'https://www.stremio.com/websiste/home-stremio.png', episode: 18, name: 'Dead Is Dead', description: 'Bjorn achieves one of Ragnars dreams. Back in Kattegat, Ivar hatches a new plan while preparing for a divine arrival. In Iceland, a settler returns in a terrible state. King Alfred faces his greatest threat yet.', released: new Date(2019, 2, 17), isUpcoming: true, isWatched: true, season: 5 },
                { id: '4', poster: 'https://www.stremio.com/websiste/home-stremio.png', episode: 19, name: 'Racon', description: 'Bjorn achieves one of Ragnars dreams. Back in Kattegat, Ivar hatches a new plan while preparing for a divine arrival. In Iceland, a settler returns in a terrible state. King Alfred faces his greatest threat yet.', released: new Date(2019, 4, 3), isUpcoming: true, isWatched: true, season: 5 },
                { id: '5', poster: 'https://www.stremio.com/websiste/home-stremio.png', episode: 20, name: 'Sundown', description: 'Bjorn achieves one of Ragnars dreams. Back in Kattegat, Ivar hatches a new plan while preparing for a divine arrival. In Iceland, a settler returns in a terrible state. King Alfred faces his greatest threat yet.', released: new Date(2019, 2, 10), isUpcoming: true, isWatched: true, season: 5 }
            ]
        },
        {
            background: 'https://images.metahub.space/poster/medium/tt0813715/img',
            releaseInfo: '2018',
            released: new Date(2018, 4, 23),
            name: 'Heroes',
            videos: [
                { id: '1', poster: 'https://www.stremio.com/websiste/home-stremio.png', episode: 16, name: 'Genesis', description: 'Bjorn achieves one of Ragnars dreams. Back in Kattegat, Ivar hatches a new plan while preparing for a divine arrival. In Iceland, a settler returns in a terrible state. King Alfred faces his greatest threat yet.', released: new Date(2019, 3, 3), isUpcoming: true, isWatched: true, season: 5 },
                { id: '2', poster: 'https://www.stremio.com/websiste/home-stremio.png', episode: 17, name: 'Six Months Ago', description: 'Bjorn achieves one of Ragnars dreams. Back in Kattegat, Ivar hatches a new plan while preparing for a divine arrival. In Iceland, a settler returns in a terrible state. King Alfred faces his greatest threat yet.', released: new Date(2019, 3, 10), isUpcoming: true, isWatched: true, season: 5 },
                { id: '3', poster: 'https://www.stremio.com/websiste/home-stremio.png', episode: 18, name: 'Fallout', description: 'Bjorn achieves one of Ragnars dreams. Back in Kattegat, Ivar hatches a new plan while preparing for a divine arrival. In Iceland, a settler returns in a terrible state. King Alfred faces his greatest threat yet.', released: new Date(2019, 3, 17), isUpcoming: true, isWatched: true, season: 5 },
                { id: '4', poster: 'https://www.stremio.com/websiste/home-stremio.png', episode: 19, name: 'Parasite', description: 'Bjorn achieves one of Ragnars dreams. Back in Kattegat, Ivar hatches a new plan while preparing for a divine arrival. In Iceland, a settler returns in a terrible state. King Alfred faces his greatest threat yet.', released: new Date(2019, 3, 8), isUpcoming: true, isWatched: true, season: 5 },
                { id: '5', poster: 'https://www.stremio.com/websiste/home-stremio.png', episode: 20, name: 'The Wall', description: 'Bjorn achieves one of Ragnars dreams. Back in Kattegat, Ivar hatches a new plan while preparing for a divine arrival. In Iceland, a settler returns in a terrible state. King Alfred faces his greatest threat yet.', released: new Date(2019, 5, 10), isUpcoming: true, isWatched: true, season: 5 }
            ]
        }
    ]
};

export default Calendar;
