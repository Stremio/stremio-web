// Copyright (C) 2017-2020 Smart code 203358507

const React = require('react');
const PropTypes = require('prop-types');
const classnames = require('classnames');
const Icon = require('@stremio/stremio-icons/dom');
const Notification = require('./Notification');
const NotificationPlaceholder = require('./NotificationPlaceholder');
const styles = require('./styles');

const NotificationsList = ({ className, metaItems }) => {
    return (
        <div className={classnames(className, styles['notifications-list-scroll-container'])}>
            {
                metaItems.map(({ req, content }, index) => {
                    switch (content.type) {
                        case 'Ready':
                            return (
                                content.content.length > 0 ?
                                    content.content.map((notification) => {
                                        //notifications videos are not available in useCatalogs, but in useNotifications hook
                                        notification.videos = notification.videos || [{
                                            title: 'Demo title',
                                            thumbnail: 'https://www.stremio.com/website/home-testimonials.jpg',
                                            season: 1,
                                            episode: 1,
                                            released: new Date()
                                        }];

                                        return (
                                            <Notification
                                                {...notification}
                                                key={`${index}${req.base}${content.type}${notification.id}`}
                                                className={styles['notification']}
                                                name={notification.videos.length === 1 ? notification.videos[0].title : notification.videos.length + ' new videos for ' + notification.name}
                                                thumbnail={notification.videos.length === 1 ? notification.videos[0].thumbnail : null}
                                                season={notification.videos.length === 1 ? notification.videos[0].season : null}
                                                episode={notification.videos.length === 1 ? notification.videos[0].episode : null}
                                                released={notification.videos.length === 1 ? notification.videos[0].released : notification.videos[notification.videos.length - 1].released}

                                            />
                                        );
                                    })
                                    :
                                    <div className={styles['no-notifications-container']}>
                                        <Icon className={styles['icon']} icon={'ic_bell'} />
                                        <div className={styles['label']}>No new notifications</div>
                                    </div>
                            );
                        case 'Loading':
                            return (
                                <NotificationPlaceholder
                                    key={`${index}${req.base}${content.type}`}
                                    className={styles['notification']}
                                />
                            );
                    }
                })
            }
        </div>
    );
};

NotificationsList.propTypes = {
    className: PropTypes.string,
    metaItems: PropTypes.arrayOf(PropTypes.object)
};

module.exports = NotificationsList;
