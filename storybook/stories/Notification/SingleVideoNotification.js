// Copyright (C) 2017-2020 Smart code 203358507

const React = require('react');
const { storiesOf } = require('@storybook/react');
const { action } = require('@storybook/addon-actions');
const Notification = require('stremio/common/NavBar/NotificationsMenu/NotificationsList/Notification');
const styles = require('./styles');

storiesOf('Notification', module).add('SingleVideo', () => (
    <Notification
        className={styles['single-video-notification-container']}
        id={'notification-id'}
        type={'series'}
        name={'Demo name'}
        poster={'/images/intro_background.jpg'}
        thumbnail={'/images/intro_background.jpg'}
        season={1}
        episode={1}
        released={new Date()}
        onClick={action('Demo item clicked')}
    />
));
