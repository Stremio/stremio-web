const React = require('react');
const PropTypes = require('prop-types');
const classnames = require('classnames');
const Icon = require('stremio-icons/dom');
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
                                            thumbnail: 'https://www.stremio.com/website/home-testimonials.jpg',
                                            season: 1,
                                            episode: 1,
                                            released: new Date()
                                        }];

                                        return (
                                            notification.videos.length === 1 ?
                                                <Notification
                                                    {...notification}
                                                    key={`${index}${req.base}${content.type}${notification.id}`}
                                                    className={styles['notification']}
                                                    thumbnail={notification.videos[0].thumbnail}
                                                    season={notification.videos[0].season}
                                                    episode={notification.videos[0].episode}
                                                    released={notification.videos[0].released}
                                                />
                                                :
                                                <Notification
                                                    {...notification}
                                                    key={`${index}${req.base}${content.type}${notification.id}`}
                                                    className={styles['notification']}
                                                    name={notification.videos.length + ' new videos for ' + notification.name}
                                                    thumbnail={null}
                                                    released={notification.videos[notification.videos.length - 1].released}
                                                />
                                        );
                                    })
                                    :
                                    <React.Fragment>
                                        <div className={styles['no-notifications-container']}>
                                            <Icon className={styles['icon']} icon={'ic_bell'} />
                                            <div className={styles['label']}>No new notifications</div>
                                        </div>
                                    </React.Fragment>
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
}

NotificationsList.propTypes = {
    className: PropTypes.string,
    metaItems: PropTypes.arrayOf(PropTypes.object)
};

module.exports = NotificationsList;
