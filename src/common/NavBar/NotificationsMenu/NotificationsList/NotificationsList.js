const React = require('react');
const PropTypes = require('prop-types');
const classnames = require('classnames');
const Icon = require('stremio-icons/dom');
const Notification = require('./Notification');
const useMetaItems = require('./useMetaItems');
const styles = require('./styles');

const NotificationsList = ({ className, metaItems }) => {
    const notifications = useMetaItems(metaItems);
    return (
        <div className={classnames(className, styles['notifications-list-scroll-container'])}>
            {
                notifications.length > 0 ?
                    notifications.map((notification) => (
                        notification.videos.length === 1 ?
                            <Notification
                                {...notification}
                                key={notification.id}
                                posterThumbnail={true}
                                poster={notification.videos[0].poster}
                                season={notification.videos[0].season}
                                episode={notification.videos[0].episode}
                                released={notification.videos[0].released}
                                className={styles['notification']}
                            />
                            :
                            <Notification
                                {...notification}
                                key={notification.id}
                                posterThumbnail={false}
                                name={notification.videos.length + ' new videos for ' + notification.name}
                                released={notification.videos[notification.videos.length - 1].released}
                                className={styles['notification']}
                            />
                    ))
                    :
                    <React.Fragment>
                        <div className={styles['no-notifications-container']}>
                            <Icon className={styles['icon']} icon={'ic_bell'} />
                            <div className={styles['label']}>
                                No new notifications
                            </div>
                        </div>
                    </React.Fragment>
            }
        </div>
    );
}

NotificationsList.propTypes = {
    className: PropTypes.string,
    metaItems: PropTypes.object
};

module.exports = NotificationsList;
