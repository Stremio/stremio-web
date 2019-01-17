import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import Icon from 'stremio-icons/dom';
import { Popup } from 'stremio-common';
import styles from './styles';

class UserNotifications extends PureComponent {
    render() {
        return (
            <Popup>
                <Popup.Label>
                    <button className={classnames(this.props.className, styles['popup-label-container'])}>
                        <Icon className={classnames(styles['notifications-icon'], styles['icon'])} icon={'ic_cloud'} />
                    </button>
                </Popup.Label>
                <Popup.Menu>
                    <div className={styles['popup-content']}>
                        {this.props.metaItems.map((metaItem) =>
                            <div className={styles['meta-item']} key={metaItem.metaItem.videos.map((video) => video.id)}>
                                <div className={styles['poster']} style={{ backgroundImage: `url(${metaItem.metaItem.poster})` }}></div>
                                <div className={styles['info-container']}>
                                    <div className={styles['name']}>{metaItem.metaItem.videos.map((video) => video.name)}</div>
                                    <div className={styles['released']}>{metaItem.metaItem.videos.map((video) => video.released.getDate() + '.' + video.released.getMonth() + '.' + video.released.getFullYear())}</div>
                                </div>
                                <div className={styles['video-poster']} style={{ backgroundImage: `url(${metaItem.metaItem.videos.map((video) => video.poster)})` }}></div>
                                <Icon className={styles['icon']} icon={'ic_more'} />
                            </div>
                        )}
                    </div>
                </Popup.Menu>
            </Popup>
        );
    }
}

UserNotifications.propTypes = {
    inLibrary: PropTypes.bool.isRequired,
    metaItems: PropTypes.arrayOf(PropTypes.object).isRequired
};
UserNotifications.defaultProps = {
    inLibrary: false,
    metaItems: [
        {
            metaItem: {
                poster: 'https://www.stremio.com/website/home-stremio.png',
                released: new Date(2019, 1, 9),
                name: 'Fantastic Beasts and Where to Find Them: The Original Screenplay',
                videos: [
                    { id: '1', poster: 'https://www.stremio.com/website/home-testimonials.jpg', episode: 1, name: 'Katy Perry - Cozy Little Christmas', released: new Date(2019, 1, 9), isUpcoming: true, isWatched: false, season: 1 }
                ]
            }
        },
        {
            metaItem: {
                poster: 'https://www.stremio.com/website/home-stremio.png',
                released: new Date(2019, 1, 7),
                name: 'Fantastic Beasts and Where to Find Them: The Original Screenplay',
                videos: [
                    { id: '2', poster: 'https://www.stremio.com/website/home-testimonials.jpg', episode: 1, name: 'Hefty Shades of Gray', description: 'dasdasda', released: new Date(2019, 1, 7), isUpcoming: true, isWatched: true, season: 1 }
                ]
            }
        },
        {
            metaItem: {
                poster: 'https://www.stremio.com/website/home-stremio.png',
                released: new Date(2019, 1, 13),
                name: 'Fantastic Beasts and Where to Find Them: The Original Screenplay',
                videos: [
                    { id: '3', poster: 'https://www.stremio.com/website/home-testimonials.jpg', episode: 1, name: 'Evolution', description: 'dasdasda', released: new Date(2019, 1, 12), isUpcoming: true, isWatched: true, season: 1 }
                ]
            }
        }
    ]
};

export default UserNotifications;
