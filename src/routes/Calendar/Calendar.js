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

        // this.episodesNames = this.props.metaItems
        //     .map((metaitem) => metaitem.metaItem.videos
        //         .filter((video) => video.released.getMonth() === new Date().getMonth() && video.released.getDate() === this.state.selectedDate.getDate())
        //         .map((video) => video.name)
        //         .join())
        //     .filter((element) => element.length > 0)

        // console.log(this.episodesNames);
    }

    changeDate = (event) => {
        const date = new Date(parseInt(event.currentTarget.dataset.date));
        this.resetMonth(date);
        this.setState({ date });
    }

    showEpisodeInfo = (event) => {
        this.setState({ episodeInfo: event.currentTarget.dataset.videoName });
    }

    changeSelectedDate = (event) => {
        this.setState({ selectedDate: new Date(event.currentTarget.dataset.day) });
    }

    scrollTo = () => {
        if (this.dateRef.current !== null) {
            var topPosition = this.dateRef.current.offsetTop;
            this.futureEpisodesRef.current.scrollTop = topPosition - 16;
            // this.futureEpisodesRef.current.animate({ scrollTop: this.dateRef.current.offsetTop }, 300);
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
        return (
            <div className={styles['calendar-container']}>
                <div className={styles['calendar']}>
                    <div className={styles['months']}>
                        {this.renderMonthButton(new Date((new Date(this.state.date)).setMonth(this.state.date.getMonth() - 1)))}
                        {this.renderMonthButton(new Date(this.state.date))}
                        {this.renderMonthButton(new Date((new Date(this.state.date)).setMonth(this.state.date.getMonth() + 1)))}
                    </div>
                    <div className={styles['week-days']}>
                        {days.map((day) => <div className={styles['day']} key={day}>{day}</div>)}
                    </div>
                    <div className={styles['month-days']}>
                        {this.pads.map((pad) =>
                            <div className={styles['pad']} key={pad} />
                        )}
                        {this.monthDays.map((day) =>
                            <div className={classnames(styles['day'], { [styles['selected']]: this.state.selectedDate.getDate() === day + 1 })} key={day} data-day={new Date(new Date().getFullYear(), this.state.date.getMonth(), day + 1)} onClick={this.changeSelectedDate}>
                                <div className={styles['date-container']}>
                                    <div className={classnames(styles['date'], { [styles['selected']]: this.state.date.getMonth() === new Date().getMonth() && this.state.date.getDate() === day + 1 })}>{day + 1}</div>
                                </div>
                                <div className={styles['episodes']}>
                                    {this.props.metaItems
                                        .map((metaitem) => metaitem.metaItem.videos
                                            .filter((video) => video.released.getMonth() === this.state.date.getMonth() && video.released.getDate() === day + 1)
                                            .map((video) =>
                                                //////indicator for >3 posters?
                                                //getTime()?
                                                <div style={{ backgroundImage: `url('${metaitem.metaItem.background}')` }} className={classnames(styles['poster'], { [styles['past']]: video.released.getDate() < new Date().getDate() && video.released.getMonth() <= new Date().getMonth() })} key={video.id} data-video-name={video.name} onClick={this.showEpisodeInfo} />
                                            )
                                        )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
                <div ref={this.futureEpisodesRef} className={styles['future-episodes']}>
                    {this.props.metaItems
                        .map((metaitem) => metaitem.metaItem.videos
                            .filter((video) => video.released.getMonth() === this.state.date.getMonth()))
                        .map((videos) => videos.map((video) => video.released.getDate()))
                        .join()
                        .split(',')
                        .filter((date, index, dates) => dates.indexOf(date) === index)
                        .sort(function(a, b) {
                            return a - b;
                        })
                        .map((videoDate) =>
                            <div ref={parseInt(videoDate) === this.state.selectedDate.getDate() ? this.dateRef : null} className={classnames(styles['episode-container'], { [styles['selected']]: parseInt(videoDate) === this.state.selectedDate.getDate() })} key={videoDate} data-day={new Date(new Date().getFullYear(), new Date().getMonth(), parseInt(videoDate))} onClick={this.changeSelectedDate}>
                                <div className={styles['date']}>
                                    {months[this.state.date.getMonth()].slice(0, 3)} {videoDate}
                                </div>
                                {this.props.metaItems
                                    .map((metaitem) => metaitem.metaItem.videos
                                        .filter((video) => video.released.getMonth() === this.state.date.getMonth() && video.released.getDate() === parseInt(videoDate))
                                        .map((video) =>
                                            <div className={classnames(styles['episode'], { [styles['selected']]: this.state.episodeInfo === video.name }, { [styles['today']]: parseInt(videoDate) === new Date().getDate() })} key={video.name} data-video-name={video.name} onClick={this.showEpisodeInfo}>
                                                <div className={classnames(styles['info'])} >
                                                    <div className={styles['main-info']}>
                                                        <div className={styles['serie-name']}>
                                                            {metaitem.metaItem.name}
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
                                            </div>
                                        )
                                    )}
                            </div>
                        )}
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
            metaItem: {
                background: 'https://images.metahub.space/poster/medium/tt2306299/img',
                releaseInfo: '2018',
                released: new Date(2018, 4, 23),
                name: 'Vikings',
                videos: [
                    { id: '1', poster: 'https://www.stremio.com/websiste/home-stremio.png', episode: 16, name: 'Homeland', description: 'Bjorn achieves one of Ragnars dreams. Back in Kattegat, Ivar hatches a new plan while preparing for a divine arrival. In Iceland, a settler returns in a terrible state. King Alfred faces his greatest threat yet.', released: new Date(2019, 1, 6), isUpcoming: true, isWatched: true, season: 5 },
                    { id: '2', poster: 'https://www.stremio.com/websiste/home-stremio.png', episode: 17, name: 'The Buddha', description: 'Bjorn achieves one of Ragnars dreams. Back in Kattegat, Ivar hatches a new plan while preparing for a divine arrival. In Iceland, a settler returns in a terrible state. King Alfred faces his greatest threat yet.', released: new Date(2019, 1, 12), isUpcoming: true, isWatched: true, season: 5 },
                    { id: '3', poster: 'https://www.stremio.com/websiste/home-stremio.png', episode: 18, name: 'Boneless', description: 'Bjorn achieves one of Ragnars dreams. Back in Kattegat, Ivar hatches a new plan while preparing for a divine arrival. In Iceland, a settler returns in a terrible state. King Alfred faces his greatest threat yet.', released: new Date(2019, 1, 18), isUpcoming: true, isWatched: true, season: 5 },
                    { id: '4', poster: 'https://www.stremio.com/websiste/home-stremio.png', episode: 19, name: 'Revenge', description: 'Bjorn achieves one of Ragnars dreams. Back in Kattegat, Ivar hatches a new plan while preparing for a divine arrival. In Iceland, a settler returns in a terrible state. King Alfred faces his greatest threat yet.', released: new Date(2019, 4, 3), isUpcoming: true, isWatched: true, season: 5 },
                    { id: '5', poster: 'https://www.stremio.com/websiste/home-stremio.png', episode: 20, name: 'Ragnarok', description: 'Bjorn achieves one of Ragnars dreams. Back in Kattegat, Ivar hatches a new plan while preparing for a divine arrival. In Iceland, a settler returns in a terrible state. King Alfred faces his greatest threat yet.', released: new Date(2019, 5, 10), isUpcoming: true, isWatched: true, season: 5 }
                ]
            }
        },
        {
            metaItem: {
                background: 'https://images.metahub.space/poster/medium/tt1520211/img',
                releaseInfo: '2018',
                released: new Date(2018, 4, 23),
                name: 'The Walking Dead',
                videos: [
                    { id: '1', poster: 'https://www.stremio.com/websiste/home-stremio.png', episode: 16, name: 'Sing me a song', description: 'Bjorn achieves one of Ragnars dreams. Back in Kattegat, Ivar hatches a new plan while preparing for a divine arrival. In Iceland, a settler returns in a terrible state. King Alfred faces his greatest threat yet.', released: new Date(2019, 1, 6), isUpcoming: true, isWatched: true, season: 5 },
                    { id: '2', poster: 'https://www.stremio.com/websiste/home-stremio.png', episode: 17, name: 'Say yes', description: 'Bjorn achieves one of Ragnars dreams. Back in Kattegat, Ivar hatches a new plan while preparing for a divine arrival. In Iceland, a settler returns in a terrible state. King Alfred faces his greatest threat yet.', released: new Date(2019, 1, 12), isUpcoming: true, isWatched: true, season: 5 },
                    { id: '3', poster: 'https://www.stremio.com/websiste/home-stremio.png', episode: 18, name: 'Bury me here', description: 'Bjorn achieves one of Ragnars dreams. Back in Kattegat, Ivar hatches a new plan while preparing for a divine arrival. In Iceland, a settler returns in a terrible state. King Alfred faces his greatest threat yet.', released: new Date(2019, 1, 19), isUpcoming: true, isWatched: true, season: 5 },
                    { id: '4', poster: 'https://www.stremio.com/websiste/home-stremio.png', episode: 19, name: 'Honor', description: 'Bjorn achieves one of Ragnars dreams. Back in Kattegat, Ivar hatches a new plan while preparing for a divine arrival. In Iceland, a settler returns in a terrible state. King Alfred faces his greatest threat yet.', released: new Date(2019, 4, 3), isUpcoming: true, isWatched: true, season: 5 },
                    { id: '5', poster: 'https://www.stremio.com/websiste/home-stremio.png', episode: 20, name: 'The Bridge', description: 'Bjorn achieves one of Ragnars dreams. Back in Kattegat, Ivar hatches a new plan while preparing for a divine arrival. In Iceland, a settler returns in a terrible state. King Alfred faces his greatest threat yet.', released: new Date(2019, 5, 10), isUpcoming: true, isWatched: true, season: 5 }
                ]
            }
        },
        {
            metaItem: {
                background: 'https://images.metahub.space/poster/medium/tt0944947/img',
                releaseInfo: '2018',
                released: new Date(2018, 4, 23),
                name: 'Game of Thrones',
                videos: [
                    { id: '1', poster: 'https://www.stremio.com/websiste/home-stremio.png', episode: 16, name: 'The North Remembers', description: 'Bjorn achieves one of Ragnars dreams. Back in Kattegat, Ivar hatches a new plan while preparing for a divine arrival. In Iceland, a settler returns in a terrible state. King Alfred faces his greatest threat yet.', released: new Date(2019, 1, 4), isUpcoming: true, isWatched: true, season: 5 },
                    { id: '2', poster: 'https://www.stremio.com/websiste/home-stremio.png', episode: 17, name: 'Garden of Bones', description: 'Bjorn achieves one of Ragnars dreams. Back in Kattegat, Ivar hatches a new plan while preparing for a divine arrival. In Iceland, a settler returns in a terrible state. King Alfred faces his greatest threat yet.', released: new Date(2019, 2, 10), isUpcoming: true, isWatched: true, season: 5 },
                    { id: '3', poster: 'https://www.stremio.com/websiste/home-stremio.png', episode: 18, name: 'Dragonstone', description: 'Bjorn achieves one of Ragnars dreams. Back in Kattegat, Ivar hatches a new plan while preparing for a divine arrival. In Iceland, a settler returns in a terrible state. King Alfred faces his greatest threat yet.', released: new Date(2019, 3, 17), isUpcoming: true, isWatched: true, season: 5 },
                    { id: '4', poster: 'https://www.stremio.com/websiste/home-stremio.png', episode: 19, name: 'Stormborn', description: 'Bjorn achieves one of Ragnars dreams. Back in Kattegat, Ivar hatches a new plan while preparing for a divine arrival. In Iceland, a settler returns in a terrible state. King Alfred faces his greatest threat yet.', released: new Date(2019, 4, 3), isUpcoming: true, isWatched: true, season: 5 },
                    { id: '5', poster: 'https://www.stremio.com/websiste/home-stremio.png', episode: 20, name: 'Eastwatch', description: 'Bjorn achieves one of Ragnars dreams. Back in Kattegat, Ivar hatches a new plan while preparing for a divine arrival. In Iceland, a settler returns in a terrible state. King Alfred faces his greatest threat yet.', released: new Date(2019, 5, 10), isUpcoming: true, isWatched: true, season: 5 }
                ]
            }
        },
        {
            metaItem: {
                background: 'https://images.metahub.space/poster/medium/tt0411008/img',
                releaseInfo: '2018',
                released: new Date(2018, 4, 23),
                name: 'Lost',
                videos: [
                    { id: '1', poster: 'https://www.stremio.com/websiste/home-stremio.png', episode: 16, name: 'The Lie', description: 'Bjorn achieves one of Ragnars dreams. Back in Kattegat, Ivar hatches a new plan while preparing for a divine arrival. In Iceland, a settler returns in a terrible state. King Alfred faces his greatest threat yet.', released: new Date(2019, 1, 4), isUpcoming: true, isWatched: true, season: 5 },
                    { id: '2', poster: 'https://www.stremio.com/websiste/home-stremio.png', episode: 17, name: '316', description: 'Bjorn achieves one of Ragnars dreams. Back in Kattegat, Ivar hatches a new plan while preparing for a divine arrival. In Iceland, a settler returns in a terrible state. King Alfred faces his greatest threat yet.', released: new Date(2019, 2, 10), isUpcoming: true, isWatched: true, season: 5 },
                    { id: '3', poster: 'https://www.stremio.com/websiste/home-stremio.png', episode: 18, name: 'Dead Is Dead', description: 'Bjorn achieves one of Ragnars dreams. Back in Kattegat, Ivar hatches a new plan while preparing for a divine arrival. In Iceland, a settler returns in a terrible state. King Alfred faces his greatest threat yet.', released: new Date(2019, 1, 17), isUpcoming: true, isWatched: true, season: 5 },
                    { id: '4', poster: 'https://www.stremio.com/websiste/home-stremio.png', episode: 19, name: 'Racon', description: 'Bjorn achieves one of Ragnars dreams. Back in Kattegat, Ivar hatches a new plan while preparing for a divine arrival. In Iceland, a settler returns in a terrible state. King Alfred faces his greatest threat yet.', released: new Date(2019, 4, 3), isUpcoming: true, isWatched: true, season: 5 },
                    { id: '5', poster: 'https://www.stremio.com/websiste/home-stremio.png', episode: 20, name: 'Sundown', description: 'Bjorn achieves one of Ragnars dreams. Back in Kattegat, Ivar hatches a new plan while preparing for a divine arrival. In Iceland, a settler returns in a terrible state. King Alfred faces his greatest threat yet.', released: new Date(2019, 1, 10), isUpcoming: true, isWatched: true, season: 5 }
                ]
            }
        },
        {
            metaItem: {
                background: 'https://images.metahub.space/poster/medium/tt0813715/img',
                releaseInfo: '2018',
                released: new Date(2018, 4, 23),
                name: 'Heroes',
                videos: [
                    { id: '1', poster: 'https://www.stremio.com/websiste/home-stremio.png', episode: 16, name: 'Genesis', description: 'Bjorn achieves one of Ragnars dreams. Back in Kattegat, Ivar hatches a new plan while preparing for a divine arrival. In Iceland, a settler returns in a terrible state. King Alfred faces his greatest threat yet.', released: new Date(2019, 1, 3), isUpcoming: true, isWatched: true, season: 5 },
                    { id: '2', poster: 'https://www.stremio.com/websiste/home-stremio.png', episode: 17, name: 'Six Months Ago', description: 'Bjorn achieves one of Ragnars dreams. Back in Kattegat, Ivar hatches a new plan while preparing for a divine arrival. In Iceland, a settler returns in a terrible state. King Alfred faces his greatest threat yet.', released: new Date(2019, 2, 10), isUpcoming: true, isWatched: true, season: 5 },
                    { id: '3', poster: 'https://www.stremio.com/websiste/home-stremio.png', episode: 18, name: 'Fallout', description: 'Bjorn achieves one of Ragnars dreams. Back in Kattegat, Ivar hatches a new plan while preparing for a divine arrival. In Iceland, a settler returns in a terrible state. King Alfred faces his greatest threat yet.', released: new Date(2019, 3, 17), isUpcoming: true, isWatched: true, season: 5 },
                    { id: '4', poster: 'https://www.stremio.com/websiste/home-stremio.png', episode: 19, name: 'Parasite', description: 'Bjorn achieves one of Ragnars dreams. Back in Kattegat, Ivar hatches a new plan while preparing for a divine arrival. In Iceland, a settler returns in a terrible state. King Alfred faces his greatest threat yet.', released: new Date(2019, 1, 8), isUpcoming: true, isWatched: true, season: 5 },
                    { id: '5', poster: 'https://www.stremio.com/websiste/home-stremio.png', episode: 20, name: 'The Wall', description: 'Bjorn achieves one of Ragnars dreams. Back in Kattegat, Ivar hatches a new plan while preparing for a divine arrival. In Iceland, a settler returns in a terrible state. King Alfred faces his greatest threat yet.', released: new Date(2019, 5, 10), isUpcoming: true, isWatched: true, season: 5 }
                ]
            }
        }
    ]
};

export default Calendar;
