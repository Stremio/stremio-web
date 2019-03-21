import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { Input } from 'stremio-common';
import Icon from 'stremio-icons/dom';
import styles from './styles';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

class Calendar extends Component {
    constructor(props) {
        super(props);

        this.selectedDateVideosContainerRef = React.createRef();
        this.videosScrollContainerRef = React.createRef();

        this.state = {
            date: new Date(),
            videoId: ''
        };
    }

    componentDidMount() {
        this.scrollToSelectedVideo();
    }

    shouldComponentUpdate(nextProps, nextState) {
        return nextState.date !== this.state.date ||
            nextState.videoId !== this.state.videoId;
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevState.date !== this.state.date) {
            this.scrollToSelectedVideo();
        }
    }

    scrollToSelectedVideo = () => {
        if (this.selectedDateVideosContainerRef.current !== null) {
            var topPosition = this.selectedDateVideosContainerRef.current.offsetTop;
            this.videosScrollContainerRef.current.scrollTop = topPosition - this.videosScrollContainerRef.current.offsetTop;
        } else {
            this.setState({ videoId: '' });
        }
    }

    changeDate = (event) => {
        const date = new Date(parseInt(event.currentTarget.dataset.date));
        for (let metaItem of this.props.metaItems) {
            let video = metaItem.videos.find((video) => {
                return video.released.getFullYear() === date.getFullYear() && video.released.getMonth() === date.getMonth() && video.released.getDate() === date.getDate();
            });
            if (video) {
                this.setState({ date, videoId: video.id });
                return;
            }
        }

        this.setState({ date, videoId: '' });
    }

    showVideoInfo = (event) => {
        event.stopPropagation();
        for (let metaItem of this.props.metaItems) {
            let video = metaItem.videos.find((video) => video.id == event.currentTarget.dataset.videoId);
            if (video) {
                this.setState({ date: new Date(video.released), videoId: video.id });
                return;
            }
        }

        this.setState({ date: new Date(), videoId: '' });
    }

    getMonthInfo = (date) => {
        const monthDate = new Date(date);
        monthDate.setDate(1);
        var padsCount = (monthDate.getDay() + 6) % 7;
        monthDate.setMonth(monthDate.getMonth() + 1);
        monthDate.setDate(0);
        var daysCount = monthDate.getDate();
        var weeksCount = Math.ceil((padsCount + daysCount) / 7);

        return {
            padsCount,
            daysCount,
            weeksCount
        };
    }

    renderMonthButton(date) {
        return date.getMonth() === this.state.date.getMonth() ?
            <div className={styles['month']}>{MONTHS[date.getMonth()]}</div>
            :
            <Input className={styles['month']} type={'button'} data-date={date.getTime()} onClick={this.changeDate}>{MONTHS[date.getMonth()]}</Input>
    }

    renderCalendar = (videosForMonth) => {
        const { padsCount, daysCount, weeksCount } = this.getMonthInfo(this.state.date);
        const weeks = [];
        for (let weekNumber = 0; weekNumber < weeksCount; weekNumber++) {
            weeks.push(
                <div key={weekNumber} className={styles['week']}>
                    {this.renderMonthDays(weekNumber, padsCount, daysCount, weeksCount, videosForMonth)}
                </div>
            )
        }

        return (
            <div className={styles['month-days']}>
                {weeks}
            </div>
        );
    }

    renderMonthDays = (weekNumber, padsCount, daysCount, weeksCount, videosForMonth) => {
        const today = new Date();
        const days = [];
        for (let day = 0; day < 7; day++) {
            days.push(
                day < padsCount && weekNumber === 0
                    ?
                    <div key={day} className={styles['pad']} />
                    :
                    (weekNumber * 7) + (day - padsCount) < daysCount
                        ?
                        <Input key={day}
                            className={classnames(styles['day'], { [styles['selected']]: this.state.date.getDate() === (weekNumber * 7) + (day - padsCount + 1) })}
                            type={'button'}
                            data-date={new Date(this.state.date.getFullYear(), this.state.date.getMonth(), (weekNumber * 7) + (day - padsCount + 1)).getTime()}
                            onClick={this.changeDate}
                        >
                            <div className={classnames(styles['date'], { [styles['today']]: this.state.date.getFullYear() === today.getFullYear() && this.state.date.getMonth() === today.getMonth() && ((weekNumber * 7) + day - padsCount + 1) === today.getDate() })}>{(weekNumber * 7) + (day - padsCount + 1)}</div>
                            <div className={styles['posters-container']}>
                                {
                                    videosForMonth
                                        .filter((video) => video.released.getDate() === (weekNumber * 7) + (day - padsCount + 1))
                                        .map((video) =>
                                            <div key={video.id}
                                                style={{ backgroundImage: `url('${video.metaPoster}')` }}
                                                className={classnames(styles['poster'], { [styles['past']]: video.released.getTime() < today.getTime() })}
                                                data-video-id={video.id}
                                                onClick={this.showVideoInfo}
                                            />
                                        )
                                }
                            </div>
                        </Input>
                        :
                        null
            )
        }
        return days;
    }

    renderSideBar = (videoDates, videosForMonth) => {
        const today = new Date();

        return (
            <div ref={this.videosScrollContainerRef} className={styles['videos-scroll-container']}>
                {
                    videoDates.length > 0
                        ?
                        videoDates.map((videoDate) =>
                            <div key={videoDate.getDate()}
                                ref={videoDate.getDate() === this.state.date.getDate() ? this.selectedDateVideosContainerRef : null}
                                className={classnames(styles['videos-container'], { [styles['selected']]: videoDate.getDate() === this.state.date.getDate() })}
                                data-date={new Date(this.state.date.getFullYear(), this.state.date.getMonth(), videoDate.getDate()).getTime()}
                                onClick={this.changeDate}
                            >
                                <div className={styles['date']}>
                                    {MONTHS[this.state.date.getMonth()].slice(0, 3)} {videoDate.getDate()}
                                </div>
                                {
                                    videosForMonth
                                        .filter((video) => video.released.getDate() === videoDate.getDate())
                                        .map((video) =>
                                            <Input key={video.id}
                                                className={classnames(styles['video'], { [styles['selected']]: this.state.videoId === video.id }, { [styles['today']]: video.released.getFullYear() === today.getFullYear() && video.released.getMonth() === today.getMonth() && video.released.getDate() === today.getDate() && this.state.videoId !== video.id })}
                                                type={'button'}
                                                data-video-id={video.id}
                                                onClick={this.showVideoInfo}
                                            >
                                                <div className={styles['main-info']}>
                                                    <div className={styles['meta-item-name']}>
                                                        {video.metaName}
                                                    </div>
                                                    {
                                                        video.season || video.episode
                                                            ?
                                                            <div className={styles['video-number']}>
                                                                S{video.season} E{video.episode}
                                                            </div>
                                                            :
                                                            null
                                                    }
                                                </div>
                                                <div className={styles['name']}>
                                                    {video.name}
                                                </div>
                                                {
                                                    video.description
                                                        ?
                                                        <div className={styles['description']}>
                                                            {video.description}
                                                        </div>
                                                        :
                                                        null
                                                }
                                                <Input className={styles['watch-button-container']} type={'link'} href={video.released.getTime() < today.getTime() ? '#/player' : '#/detail'}>
                                                    <div className={styles['watch-button']}>
                                                        <Icon className={styles['icon']} icon={'ic_play'} />
                                                        <div className={styles['label']}>{video.released.getTime() < today.getTime() ? 'WATCH NOW' : 'SHOW'}</div>
                                                    </div>
                                                </Input>
                                            </Input>
                                        )
                                }
                            </div>
                        )
                        :
                        null
                }
            </div>
        );
    }

    render() {
        const videosForMonth = this.props.metaItems
            .map((mItem) => {
                return mItem.videos
                    .filter((video) => {
                        return video.released.getFullYear() === this.state.date.getFullYear() && video.released.getMonth() === this.state.date.getMonth();
                    })
                    .map((video) => ({
                        ...video,
                        metaPoster: mItem.poster,
                        metaName: mItem.name
                    }));
            })
            .filter((videos) => videos.length > 0)
            .reduce((result, videos) => {
                result = result.concat(videos);
                return result;
            }, []);

        const videoDates = videosForMonth
            .map((video) => video.released)
            .filter((date, index, dates) => {
                for (var i = 0; i < dates.length; i++) {
                    if (dates[i].getTime() === date.getTime()) {
                        return i === index;
                    }
                }

                return false;
            })
            .sort(function(a, b) {
                return a - b;
            });

        return (
            <div className={styles['calendar-container']}>
                <div className={styles['calendar']}>
                    <div className={styles['months']}>
                        {this.renderMonthButton(new Date(this.state.date.getFullYear(), this.state.date.getMonth() - 1), 1)}
                        {this.renderMonthButton(this.state.date)}
                        {this.renderMonthButton(new Date(this.state.date.getFullYear(), this.state.date.getMonth() + 1), 1)}
                    </div>
                    <div className={styles['week-days']}>
                        {DAYS.map((day) => <div key={day} className={styles['day']}>{day}</div>)}
                    </div>
                    {this.renderCalendar(videosForMonth)}
                </div>
                {this.renderSideBar(videoDates, videosForMonth)}
            </div>
        );
    }
}

Calendar.propTypes = {
    metaItems: PropTypes.arrayOf(PropTypes.shape({
        poster: PropTypes.string,
        name: PropTypes.string.isRequired,
        videos: PropTypes.arrayOf(PropTypes.shape({
            id: PropTypes.string.isRequired,
            name: PropTypes.string.isRequired,
            description: PropTypes.string,
            released: PropTypes.PropTypes.instanceOf(Date),
            season: PropTypes.number,
            episode: PropTypes.number
        }))
    }))
};
Calendar.defaultProps = {
    metaItems: [
        {
            poster: 'https://images.metahub.space/poster/medium/tt2306299/img',
            name: 'Vikings',
            videos: [
                { id: '1', episode: 16, name: 'Homeland', description: 'Bjorn achieves one of Ragnars dreams. Back in Kattegat, Ivar hatches a new plan while preparing for a divine arrival. In Iceland, a settler returns in a terrible state. King Alfred faces his greatest threat yet.', released: new Date(2019, 2, 1), season: 5 },
                { id: '2', episode: 17, name: 'The Buddha', description: 'Bjorn achieves one of Ragnars dreams. Back in Kattegat, Ivar hatches a new plan while preparing for a divine arrival. In Iceland, a settler returns in a terrible state. King Alfred faces his greatest threat yet.', released: new Date(2019, 2, 2), season: 5 },
                { id: '3', episode: 18, name: 'Boneless', description: 'Bjorn achieves one of Ragnars dreams. Back in Kattegat, Ivar hatches a new plan while preparing for a divine arrival. In Iceland, a settler returns in a terrible state. King Alfred faces his greatest threat yet.', released: new Date(2019, 2, 3), season: 5 },
                { id: '4', episode: 19, name: 'Revenge', description: 'Bjorn achieves one of Ragnars dreams. Back in Kattegat, Ivar hatches a new plan while preparing for a divine arrival. In Iceland, a settler returns in a terrible state. King Alfred faces his greatest threat yet.', released: new Date(2019, 2, 4), season: 5 },
                { id: '5', episode: 20, name: 'Ragnarok', description: 'Bjorn achieves one of Ragnars dreams. Back in Kattegat, Ivar hatches a new plan while preparing for a divine arrival. In Iceland, a settler returns in a terrible state. King Alfred faces his greatest threat yet.', released: new Date(2019, 2, 5), season: 5 }
            ]
        },
        {
            poster: 'https://images.metahub.space/poster/medium/tt1520211/img',
            name: 'The Walking Dead',
            videos: [
                { id: '6', episode: 16, name: 'Sing me a song', description: 'Bjorn achieves one of Ragnars dreams. Back in Kattegat, Ivar hatches a new plan while preparing for a divine arrival. In Iceland, a settler returns in a terrible state. King Alfred faces his greatest threat yet.', released: new Date(2019, 2, 7), season: 5 },
                { id: '7', episode: 17, name: 'Say yes', description: 'Bjorn achieves one of Ragnars dreams. Back in Kattegat, Ivar hatches a new plan while preparing for a divine arrival. In Iceland, a settler returns in a terrible state. King Alfred faces his greatest threat yet.', released: new Date(2019, 2, 12), season: 5 },
                { id: '8', episode: 18, name: 'Bury me here', description: 'Bjorn achieves one of Ragnars dreams. Back in Kattegat, Ivar hatches a new plan while preparing for a divine arrival. In Iceland, a settler returns in a terrible state. King Alfred faces his greatest threat yet.', released: new Date(2019, 2, 19), season: 5 },
                { id: '9', episode: 19, name: 'Honor', description: 'Bjorn achieves one of Ragnars dreams. Back in Kattegat, Ivar hatches a new plan while preparing for a divine arrival. In Iceland, a settler returns in a terrible state. King Alfred faces his greatest threat yet.', released: new Date(2019, 4, 3), season: 5 },
                { id: '10', episode: 20, name: 'The Bridge', description: 'Bjorn achieves one of Ragnars dreams. Back in Kattegat, Ivar hatches a new plan while preparing for a divine arrival. In Iceland, a settler returns in a terrible state. King Alfred faces his greatest threat yet.', released: new Date(2019, 5, 10), season: 5 }
            ]
        },
        {
            poster: 'https://images.metahub.space/poster/medium/tt0944947/img',
            name: 'Game of Thrones',
            videos: [
                { id: '11', episode: 16, name: 'The North Remembers', description: 'Bjorn achieves one of Ragnars dreams. Back in Kattegat, Ivar hatches a new plan while preparing for a divine arrival. In Iceland, a settler returns in a terrible state. King Alfred faces his greatest threat yet.', released: new Date(2019, 2, 4), season: 5 },
                { id: '12', episode: 17, name: 'Garden of Bones', description: 'Bjorn achieves one of Ragnars dreams. Back in Kattegat, Ivar hatches a new plan while preparing for a divine arrival. In Iceland, a settler returns in a terrible state. King Alfred faces his greatest threat yet.', released: new Date(2019, 2, 10), season: 5 },
                { id: '13', episode: 18, name: 'Dragonstone', description: 'Bjorn achieves one of Ragnars dreams. Back in Kattegat, Ivar hatches a new plan while preparing for a divine arrival. In Iceland, a settler returns in a terrible state. King Alfred faces his greatest threat yet.', released: new Date(2019, 3, 17), season: 5 },
                { id: '14', episode: 19, name: 'Stormborn', description: 'Bjorn achieves one of Ragnars dreams. Back in Kattegat, Ivar hatches a new plan while preparing for a divine arrival. In Iceland, a settler returns in a terrible state. King Alfred faces his greatest threat yet.', released: new Date(2019, 4, 3), season: 5 },
                { id: '15', episode: 20, name: 'Eastwatch', description: 'Bjorn achieves one of Ragnars dreams. Back in Kattegat, Ivar hatches a new plan while preparing for a divine arrival. In Iceland, a settler returns in a terrible state. King Alfred faces his greatest threat yet.', released: new Date(2019, 5, 10), season: 5 }
            ]
        },
        {
            poster: 'https://images.metahub.space/poster/medium/tt0411008/img',
            name: 'Lost',
            videos: [
                { id: '16', episode: 16, name: 'The Lie', description: 'Bjorn achieves one of Ragnars dreams. Back in Kattegat, Ivar hatches a new plan while preparing for a divine arrival. In Iceland, a settler returns in a terrible state. King Alfred faces his greatest threat yet.', released: new Date(2019, 2, 4), season: 5 },
                { id: '17', episode: 17, name: '316', description: 'Bjorn achieves one of Ragnars dreams. Back in Kattegat, Ivar hatches a new plan while preparing for a divine arrival. In Iceland, a settler returns in a terrible state. King Alfred faces his greatest threat yet.', released: new Date(2019, 2, 10), season: 5 },
                { id: '18', episode: 18, name: 'Dead Is Dead', description: 'Bjorn achieves one of Ragnars dreams. Back in Kattegat, Ivar hatches a new plan while preparing for a divine arrival. In Iceland, a settler returns in a terrible state. King Alfred faces his greatest threat yet.', released: new Date(2019, 2, 17), season: 5 },
                { id: '19', episode: 19, name: 'Racon', description: 'Bjorn achieves one of Ragnars dreams. Back in Kattegat, Ivar hatches a new plan while preparing for a divine arrival. In Iceland, a settler returns in a terrible state. King Alfred faces his greatest threat yet.', released: new Date(2019, 4, 3), season: 5 },
                { id: '20', episode: 20, name: 'Sundown', description: 'Bjorn achieves one of Ragnars dreams. Back in Kattegat, Ivar hatches a new plan while preparing for a divine arrival. In Iceland, a settler returns in a terrible state. King Alfred faces his greatest threat yet.', released: new Date(2019, 2, 10), season: 5 }
            ]
        },
        {
            poster: 'https://images.metahub.space/poster/medium/tt0813715/img',
            name: 'Heroes',
            videos: [
                { id: '21', episode: 16, name: 'Genesis', description: 'Bjorn achieves one of Ragnars dreams. Back in Kattegat, Ivar hatches a new plan while preparing for a divine arrival. In Iceland, a settler returns in a terrible state. King Alfred faces his greatest threat yet.', released: new Date(2019, 3, 3), season: 5 },
                { id: '22', episode: 17, name: 'Six Months Ago', description: 'Bjorn achieves one of Ragnars dreams. Back in Kattegat, Ivar hatches a new plan while preparing for a divine arrival. In Iceland, a settler returns in a terrible state. King Alfred faces his greatest threat yet.', released: new Date(2019, 3, 10), season: 5 },
                { id: '23', episode: 18, name: 'Fallout', description: 'Bjorn achieves one of Ragnars dreams. Back in Kattegat, Ivar hatches a new plan while preparing for a divine arrival. In Iceland, a settler returns in a terrible state. King Alfred faces his greatest threat yet.', released: new Date(2019, 3, 17), season: 5 },
                { id: '24', episode: 19, name: 'Parasite', description: 'Bjorn achieves one of Ragnars dreams. Back in Kattegat, Ivar hatches a new plan while preparing for a divine arrival. In Iceland, a settler returns in a terrible state. King Alfred faces his greatest threat yet.', released: new Date(2019, 3, 8), season: 5 },
                { id: '25', episode: 20, name: 'The Wall', description: 'Bjorn achieves one of Ragnars dreams. Back in Kattegat, Ivar hatches a new plan while preparing for a divine arrival. In Iceland, a settler returns in a terrible state. King Alfred faces his greatest threat yet.', released: new Date(2019, 5, 10), season: 5 }
            ]
        }
    ]
};

export default Calendar;
