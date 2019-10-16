const React = require('react');
const { storiesOf } = require('@storybook/react');
const { action } = require('@storybook/addon-actions');
const Notification = require('stremio/common/NavBar/NotificationsMenu/NotificationsList/Notification');
const styles = require('./styles');

storiesOf('Notification', module).add('MultipleVideos', () => (
    <Notification
        className={styles['multiple-videos-notification-container']}
        id={'notification-id'}
        type={'series'}
        name={'Demo name'}
        poster={'/images/intro_background.jpg'}
        thumbnail={null}
        released={new Date()}
        onClick={action('Demo item clicked')}
    />
));
