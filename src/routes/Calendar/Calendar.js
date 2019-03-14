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

        this.videosContainerRef = React.createRef();
        this.videosScrollContainerRef = React.createRef();

        this.state = {
            date: new Date(),
            videoId: '',
            selectedDate: new Date()
        };
    }

    componentDidMount() {
        this.scrollToSelectedVideo();
    }

    shouldComponentUpdate(nextProps, nextState) {
        return nextState.date !== this.state.date ||
            nextState.videoId !== this.state.videoId ||
            nextState.selectedDate !== this.state.selectedDate;
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevState.selectedDate !== this.state.selectedDate) {
            this.scrollToSelectedVideo();
        }

        if (prevState.date.getMonth() !== this.state.date.getMonth()) {
            this.setState({ selectedDate: new Date(this.state.date.getFullYear(), this.state.date.getMonth(), 1) });
        }
    }

    scrollToSelectedVideo = () => {
        if (this.videosContainerRef.current !== null) {
            var topPosition = this.videosContainerRef.current.offsetTop;
            this.videosScrollContainerRef.current.scrollTop = topPosition - this.videosScrollContainerRef.current.offsetTop;
        } else {
            this.setState({ videoId: '' });
        }
    }

    changeDate = (event) => {
        this.setState({ date: new Date(parseInt(event.currentTarget.dataset.date)) });
    }

    showVideoInfo = (event) => {
        event.stopPropagation();

        var selectedVideoDate = this.props.metaItems
            .map((metaitem) => metaitem.videos
                .filter((video) => video.id == event.currentTarget.dataset.videoId))
            .reduce((result, videoDates) => {
                result = result.concat(videoDates);
                return result;
            }, [])[0].released;

        this.setState({ videoId: event.currentTarget.dataset.videoId, selectedDate: new Date(selectedVideoDate) });
    }

    changeSelectedDate = (event) => {
        const selectedDate = new Date(event.currentTarget.dataset.day);

        var videosIds = this.props.metaItems
            .map((metaitem) => metaitem.videos
                .filter((video) => video.released.getFullYear() === this.state.date.getFullYear() && video.released.getMonth() === this.state.date.getMonth() && video.released.getDate() === selectedDate.getDate())
                .map((video) => video.id))
            .filter((videos) => videos.length > 0);

        if (videosIds.length > 0) {
            this.setState({ videoId: videosIds[0][0], selectedDate });
        } else {
            this.setState({ selectedDate });
        }
    }

    getMonthInfo = (date) => {
        const monthDate = new Date(date);
        monthDate.setDate(1);
        var padsCount = (monthDate.getDay() + 6) % 7;
        monthDate.setMonth(monthDate.getMonth() + 1);
        monthDate.setDate(0);
        var daysCount = monthDate.getDate();
        var rowsCount = Math.ceil((padsCount + daysCount) / 7);

        return {
            padsCount,
            daysCount,
            rowsCount
        };
    }

    renderMonthButton(date) {
        return (
            <div className={styles['month']} data-date={date.getTime()} onClick={this.changeDate}>{months[date.getMonth()]}</div>
        );
    }

    render() {
        const { padsCount, daysCount, rowsCount } = this.getMonthInfo(this.state.date);

        const videosDates = this.props.metaItems
            .map((metaitem) => metaitem.videos
                .filter((video) => video.released.getFullYear() === this.state.date.getFullYear() && video.released.getMonth() === this.state.date.getMonth()))
            .filter((videos) => videos.length > 0)
            .map((videos) => videos.map((video) => video.released.getDate()))
            .reduce((result, videoDates) => {
                result = result.concat(videoDates);
                return result;
            }, []);

        return (
            <div className={styles['calendar-container']}>
                <div className={styles['calendar']}>
                    <div className={styles['months']}>
                        {this.renderMonthButton(new Date((new Date(this.state.date)).setMonth(this.state.date.getMonth() - 1)))}
                        {this.renderMonthButton(new Date(this.state.date))}
                        {this.renderMonthButton(new Date((new Date(this.state.date)).setMonth(this.state.date.getMonth() + 1)))}
                    </div>
                    <table className={styles['month-days']}>
                        <tbody>
                            <tr className={styles['week-days']}>
                                {days.map((day) => <td key={day} className={styles['day']}>{day}</td>)}
                            </tr>
                            {Array.apply(null, { length: rowsCount }).map((_, row) => (
                                <tr key={row} className={styles['row']}>
                                    {Array.apply(null, { length: 7 }).map((_, day) => (
                                        day < padsCount && row === 0
                                            ?
                                            <td key={day} />
                                            :
                                            (row * 7) + (day - padsCount) < daysCount
                                                ?
                                                <td key={day}
                                                    className={classnames(styles['day'], { [styles['selected']]: this.state.selectedDate.getDate() === (row * 7) + (day - padsCount + 1) })}
                                                    data-day={new Date(this.state.date.getFullYear(), this.state.date.getMonth(), (row * 7) + (day - padsCount + 1))}
                                                    onClick={this.changeSelectedDate}
                                                >
                                                    <div className={styles['date-container']}>
                                                        <div className={classnames(styles['date'], { [styles['today']]: this.state.date.getFullYear() === new Date().getFullYear() && this.state.date.getMonth() === new Date().getMonth() && this.state.date.getDate() === (row * 7) + (day - padsCount + 1) })}>{(row * 7) + (day - padsCount + 1)}</div>
                                                    </div>
                                                    <div className={classnames(styles['videos'], { [styles['small']]: rowsCount === 6 }, { [styles['big']]: rowsCount === 4 })}>
                                                        {this.props.metaItems
                                                            .map((metaitem) => metaitem.videos
                                                                .filter((video) => video.released.getFullYear() === this.state.date.getFullYear() && video.released.getMonth() === this.state.date.getMonth() && video.released.getDate() === (row * 7) + (day - padsCount + 1))
                                                                .map((video) =>
                                                                    <div key={video.id}
                                                                        style={{ backgroundImage: `url('${metaitem.background}')` }}
                                                                        className={classnames(styles['poster'], { [styles['past']]: video.released.getTime() < new Date().getTime() })}
                                                                        data-video-id={video.id}
                                                                        onClick={this.showVideoInfo}
                                                                    />
                                                                )
                                                            )}
                                                    </div>
                                                </td>
                                                :
                                                null
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div ref={this.videosScrollContainerRef} className={styles['videos-scroll-container']}>
                    {
                        videosDates.length > 0
                            ?
                            videosDates
                                .filter((date, index, dates) => dates.indexOf(date) === index)
                                .sort(function(a, b) {
                                    return a - b;
                                })
                                .map((videoDate) =>
                                    <div key={videoDate}
                                        ref={videoDate === this.state.selectedDate.getDate() ? this.videosContainerRef : null}
                                        className={classnames(styles['videos-container'], { [styles['selected']]: parseInt(videoDate) === this.state.selectedDate.getDate() })}
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
                                                    <div key={video.id}
                                                        className={classnames(styles['video'], { [styles['selected']]: this.state.videoId === video.id }, { [styles['today']]: video.released.getFullYear() === new Date().getFullYear() && video.released.getMonth() === new Date().getMonth() && parseInt(videoDate) === new Date().getDate() && this.state.videoId !== video.id })}
                                                        data-video-id={video.id}
                                                        onClick={this.showVideoInfo}
                                                    >
                                                        <div className={styles['main-info']}>
                                                            <div className={styles['meta-item-name']}>
                                                                {metaitem.name}
                                                            </div>
                                                            <div className={styles['video-number']}>
                                                                S{video.season} E{video.episode}
                                                            </div>
                                                        </div>
                                                        <div className={styles['name']}>
                                                            {video.name}
                                                        </div>
                                                        <div className={styles['description']}>
                                                            {video.description}
                                                        </div>
                                                        <a className={styles['watch-button-container']} href={video.released.getDate() < new Date().getDate() && video.released.getMonth() <= new Date().getMonth() && video.released.getFullYear() <= new Date().getFullYear() ? '#/player' : '#/detail'}>
                                                            <div className={styles['watch-button']}>
                                                                <Icon className={styles['icon']} icon={'ic_play'} />
                                                                <div className={styles['label']}>{video.released.getDate() < new Date().getDate() && video.released.getMonth() <= new Date().getMonth() && video.released.getFullYear() <= new Date().getFullYear() ? 'WATCH NOW' : 'SHOW'}</div>
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
    metaItems: PropTypes.arrayOf(PropTypes.object).isRequired
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
                { id: '6', poster: 'https://www.stremio.com/websiste/home-stremio.png', episode: 16, name: 'Sing me a song', description: 'Bjorn achieves one of Ragnars dreams. Back in Kattegat, Ivar hatches a new plan while preparing for a divine arrival. In Iceland, a settler returns in a terrible state. King Alfred faces his greatest threat yet.', released: new Date(2019, 2, 7), isUpcoming: true, isWatched: true, season: 5 },
                { id: '7', poster: 'https://www.stremio.com/websiste/home-stremio.png', episode: 17, name: 'Say yes', description: 'Bjorn achieves one of Ragnars dreams. Back in Kattegat, Ivar hatches a new plan while preparing for a divine arrival. In Iceland, a settler returns in a terrible state. King Alfred faces his greatest threat yet.', released: new Date(2019, 2, 12), isUpcoming: true, isWatched: true, season: 5 },
                { id: '8', poster: 'https://www.stremio.com/websiste/home-stremio.png', episode: 18, name: 'Bury me here', description: 'Bjorn achieves one of Ragnars dreams. Back in Kattegat, Ivar hatches a new plan while preparing for a divine arrival. In Iceland, a settler returns in a terrible state. King Alfred faces his greatest threat yet.', released: new Date(2019, 2, 19), isUpcoming: true, isWatched: true, season: 5 },
                { id: '9', poster: 'https://www.stremio.com/websiste/home-stremio.png', episode: 19, name: 'Honor', description: 'Bjorn achieves one of Ragnars dreams. Back in Kattegat, Ivar hatches a new plan while preparing for a divine arrival. In Iceland, a settler returns in a terrible state. King Alfred faces his greatest threat yet.', released: new Date(2019, 4, 3), isUpcoming: true, isWatched: true, season: 5 },
                { id: '10', poster: 'https://www.stremio.com/websiste/home-stremio.png', episode: 20, name: 'The Bridge', description: 'Bjorn achieves one of Ragnars dreams. Back in Kattegat, Ivar hatches a new plan while preparing for a divine arrival. In Iceland, a settler returns in a terrible state. King Alfred faces his greatest threat yet.', released: new Date(2019, 5, 10), isUpcoming: true, isWatched: true, season: 5 }
            ]
        },
        {
            background: 'https://images.metahub.space/poster/medium/tt0944947/img',
            releaseInfo: '2018',
            released: new Date(2018, 4, 23),
            name: 'Game of Thrones',
            videos: [
                { id: '11', poster: 'https://www.stremio.com/websiste/home-stremio.png', episode: 16, name: 'The North Remembers', description: 'Bjorn achieves one of Ragnars dreams. Back in Kattegat, Ivar hatches a new plan while preparing for a divine arrival. In Iceland, a settler returns in a terrible state. King Alfred faces his greatest threat yet.', released: new Date(2019, 2, 4), isUpcoming: true, isWatched: true, season: 5 },
                { id: '12', poster: 'https://www.stremio.com/websiste/home-stremio.png', episode: 17, name: 'Garden of Bones', description: 'Bjorn achieves one of Ragnars dreams. Back in Kattegat, Ivar hatches a new plan while preparing for a divine arrival. In Iceland, a settler returns in a terrible state. King Alfred faces his greatest threat yet.', released: new Date(2019, 2, 10), isUpcoming: true, isWatched: true, season: 5 },
                { id: '13', poster: 'https://www.stremio.com/websiste/home-stremio.png', episode: 18, name: 'Dragonstone', description: 'Bjorn achieves one of Ragnars dreams. Back in Kattegat, Ivar hatches a new plan while preparing for a divine arrival. In Iceland, a settler returns in a terrible state. King Alfred faces his greatest threat yet.', released: new Date(2019, 3, 17), isUpcoming: true, isWatched: true, season: 5 },
                { id: '14', poster: 'https://www.stremio.com/websiste/home-stremio.png', episode: 19, name: 'Stormborn', description: 'Bjorn achieves one of Ragnars dreams. Back in Kattegat, Ivar hatches a new plan while preparing for a divine arrival. In Iceland, a settler returns in a terrible state. King Alfred faces his greatest threat yet.', released: new Date(2019, 4, 3), isUpcoming: true, isWatched: true, season: 5 },
                { id: '15', poster: 'https://www.stremio.com/websiste/home-stremio.png', episode: 20, name: 'Eastwatch', description: 'Bjorn achieves one of Ragnars dreams. Back in Kattegat, Ivar hatches a new plan while preparing for a divine arrival. In Iceland, a settler returns in a terrible state. King Alfred faces his greatest threat yet.', released: new Date(2019, 5, 10), isUpcoming: true, isWatched: true, season: 5 }
            ]
        },
        {
            background: 'https://images.metahub.space/poster/medium/tt0411008/img',
            releaseInfo: '2018',
            released: new Date(2018, 4, 23),
            name: 'Lost',
            videos: [
                { id: '16', poster: 'https://www.stremio.com/websiste/home-stremio.png', episode: 16, name: 'The Lie', description: 'Bjorn achieves one of Ragnars dreams. Back in Kattegat, Ivar hatches a new plan while preparing for a divine arrival. In Iceland, a settler returns in a terrible state. King Alfred faces his greatest threat yet.', released: new Date(2019, 2, 4), isUpcoming: true, isWatched: true, season: 5 },
                { id: '17', poster: 'https://www.stremio.com/websiste/home-stremio.png', episode: 17, name: '316', description: 'Bjorn achieves one of Ragnars dreams. Back in Kattegat, Ivar hatches a new plan while preparing for a divine arrival. In Iceland, a settler returns in a terrible state. King Alfred faces his greatest threat yet.', released: new Date(2019, 2, 10), isUpcoming: true, isWatched: true, season: 5 },
                { id: '18', poster: 'https://www.stremio.com/websiste/home-stremio.png', episode: 18, name: 'Dead Is Dead', description: 'Bjorn achieves one of Ragnars dreams. Back in Kattegat, Ivar hatches a new plan while preparing for a divine arrival. In Iceland, a settler returns in a terrible state. King Alfred faces his greatest threat yet.', released: new Date(2019, 2, 17), isUpcoming: true, isWatched: true, season: 5 },
                { id: '19', poster: 'https://www.stremio.com/websiste/home-stremio.png', episode: 19, name: 'Racon', description: 'Bjorn achieves one of Ragnars dreams. Back in Kattegat, Ivar hatches a new plan while preparing for a divine arrival. In Iceland, a settler returns in a terrible state. King Alfred faces his greatest threat yet.', released: new Date(2019, 4, 3), isUpcoming: true, isWatched: true, season: 5 },
                { id: '20', poster: 'https://www.stremio.com/websiste/home-stremio.png', episode: 20, name: 'Sundown', description: 'Bjorn achieves one of Ragnars dreams. Back in Kattegat, Ivar hatches a new plan while preparing for a divine arrival. In Iceland, a settler returns in a terrible state. King Alfred faces his greatest threat yet.', released: new Date(2019, 2, 10), isUpcoming: true, isWatched: true, season: 5 }
            ]
        },
        {
            background: 'https://images.metahub.space/poster/medium/tt0813715/img',
            releaseInfo: '2018',
            released: new Date(2018, 4, 23),
            name: 'Heroes',
            videos: [
                { id: '21', poster: 'https://www.stremio.com/websiste/home-stremio.png', episode: 16, name: 'Genesis', description: 'Bjorn achieves one of Ragnars dreams. Back in Kattegat, Ivar hatches a new plan while preparing for a divine arrival. In Iceland, a settler returns in a terrible state. King Alfred faces his greatest threat yet.', released: new Date(2019, 3, 3), isUpcoming: true, isWatched: true, season: 5 },
                { id: '22', poster: 'https://www.stremio.com/websiste/home-stremio.png', episode: 17, name: 'Six Months Ago', description: 'Bjorn achieves one of Ragnars dreams. Back in Kattegat, Ivar hatches a new plan while preparing for a divine arrival. In Iceland, a settler returns in a terrible state. King Alfred faces his greatest threat yet.', released: new Date(2019, 3, 10), isUpcoming: true, isWatched: true, season: 5 },
                { id: '23', poster: 'https://www.stremio.com/websiste/home-stremio.png', episode: 18, name: 'Fallout', description: 'Bjorn achieves one of Ragnars dreams. Back in Kattegat, Ivar hatches a new plan while preparing for a divine arrival. In Iceland, a settler returns in a terrible state. King Alfred faces his greatest threat yet.', released: new Date(2019, 3, 17), isUpcoming: true, isWatched: true, season: 5 },
                { id: '24', poster: 'https://www.stremio.com/websiste/home-stremio.png', episode: 19, name: 'Parasite', description: 'Bjorn achieves one of Ragnars dreams. Back in Kattegat, Ivar hatches a new plan while preparing for a divine arrival. In Iceland, a settler returns in a terrible state. King Alfred faces his greatest threat yet.', released: new Date(2019, 3, 8), isUpcoming: true, isWatched: true, season: 5 },
                { id: '25', poster: 'https://www.stremio.com/websiste/home-stremio.png', episode: 20, name: 'The Wall', description: 'Bjorn achieves one of Ragnars dreams. Back in Kattegat, Ivar hatches a new plan while preparing for a divine arrival. In Iceland, a settler returns in a terrible state. King Alfred faces his greatest threat yet.', released: new Date(2019, 5, 10), isUpcoming: true, isWatched: true, season: 5 }
            ]
        }
    ]
};

export default Calendar;
