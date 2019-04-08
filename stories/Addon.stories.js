import React from 'react';
import { storiesOf } from '@storybook/react';
import Addon from '../src/routes/Addons/Addon';
import appStyles from '../src/App/styles';
import styles from './styles';

const storyStyle = {
    padding: '10px',
    overflow: 'auto',
    minHeight: 'initial'
};

storiesOf('Addon', module)
    .add('not-installed', () => (
        <div style={storyStyle} className={appStyles['app']}>
            <Addon
                className={styles['addon']}
                logo={'ic_series'}
                name={'Watch Hub'}
                version={'1.3.0'}
                isInstalled={false}
                types={['Movies', 'Series']}
                hostname={'piratebay-stremio-addon.herokuapp'}
                description={'Find where to stream your favourite movies and shows amongst iTunes, Hulu, Amazon and other UK/US services.'}
                shareAddon={function() { alert('shared') }}
                onToggleClicked={function() { alert('installed') }}
            />
        </div>
    ))
    .add('installed', () => (
        <div style={storyStyle} className={appStyles['app']}>
            <Addon
                className={styles['addon']}
                name={'Cinemeta'}
                version={'2.4.0'}
                isInstalled={true}
                types={['Movies', 'Series']}
                hostname={'pct.best4stremio.space'}
                description={'Watch your favourite YouTube channels ad-free and get notified when they upload new videos.'}
                shareAddon={function() { alert('shared') }}
                onToggleClicked={function() { alert('uninstalled') }}
            />
        </div>
    ))
    .add('long-text', () => (
        <div style={storyStyle} className={appStyles['app']}>
            <Addon
                className={styles['addon']}
                logo={'ic_youtube_small'}
                name={'YouTubeYouTube YouTubeYouTube'}
                version={'1.3.0.1.3.0.1.3.0.1.3.0'}
                isInstalled={false}
                types={['Channels', 'Videos', 'Movies', 'Channels', 'Movies', 'Videos', 'Movies', 'Videos', 'Channels']}
                hostname={'piratebay-stremio-addon.herokuappstremio-addon.herokuappstremio-addon.herokuappstremio-addon.herokuappstremio-addon.herokuappstremio-addon.herokuappstremio-addon.herokuappstremio-addon.herokuapp.com'}
                description={'Watch your favourite YouTube channels ad-free and get notiour favourite YouTube channels ad-free and get notiour favourite YouTube channels ad-free and get notiour favourite YouTube channels ad-free and get notiour favourite YouTube channels ad-free and get notiourfavourite YouTube channels ad-free and get notiour favourite YouTube channels ad-free and get notiourfavourite YouTube channels ad-free and get notiour favourite YouTube channels ad-free and get notiour favourite YouTube channels ad-free and get notified when they upload new videos.'}
                shareAddon={function() { alert('shared') }}
                onToggleClicked={function() { alert('installed') }}
            />
        </div>
    ));
    