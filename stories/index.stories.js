import React from 'react';
import { storiesOf } from '@storybook/react';
import { Checkbox, MetaItem, ShareAddon, UserPanel, FocusableProvider } from 'stremio-common';
import Addon from '../src/routes/Addons/Addon';
import Video from '../src/routes/Detail/VideosList/Video';
import VideosList from '../src/routes/Detail/VideosList';
import Stream from '../src/routes/Detail/StreamsList/Stream';
import StreamsList from '../src/routes/Detail/StreamsList';
import ModalsContainerProvider from '../src/common/Router/Route/ModalsContainerProvider';
import colors from 'stremio-colors';
import appStyles from '../src/App/styles';
import styles from './styles';

const storyStyle = {
    padding: '10px',
    overflow: 'auto',
    minHeight: 'initial'
};

const streamsListStyle = {
    position: 'absolute',
    height: '100%',
    padding: '10px',
    minHeight: 'initial',
    background: colors.backgroundlighter
}

const CONTINUE_WATCHING_MENU = [
    {
        label: 'Play',
        type: 'play'
    },
    {
        label: 'Dismiss',
        type: 'dismiss'
    }
];

const onModalsContainerDomTreeChange = ({ modalsContainerElement }) => {
    return modalsContainerElement.childElementCount === 0;
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
                onToggleClicked={function() { alert('1') }}
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
            />
        </div>
    ));

storiesOf('Checkbox', module)
    .add('checked-disabled', () => (
        <div style={storyStyle} className={appStyles['app']}>
            <Checkbox className={styles['checkbox-size']} checked={true} disabled={true}>
                <div />
            </Checkbox>
        </div>
    ))
    .add('not-checked-disabled', () => (
        <div style={storyStyle} className={appStyles['app']}>
            <Checkbox className={styles['checkbox-size']} checked={false} disabled={true}>
                <div />
            </Checkbox>
        </div>
    ))
    .add('not-checked', () => (
        <div style={storyStyle} className={appStyles['app']}>
            <Checkbox className={styles['checkbox-size']} checked={false} disabled={false}>
                <div />
            </Checkbox>
        </div>
    ))
    .add('checked', () => (
        <div style={storyStyle} className={appStyles['app']}>
            <Checkbox className={styles['checkbox-size']} checked={true} disabled={false}>
                <div />
            </Checkbox>
        </div>
    ));

storiesOf('MetaItem', module)
    .add('continue-watching-poster', () => (
        <ModalsContainerProvider>
            <FocusableProvider onModalsContainerDomTreeChange={onModalsContainerDomTreeChange}>
                <div style={storyStyle} className={appStyles['app']}>
                    <MetaItem
                        className={styles['meta-item-continue-watching']}
                        id={'0'}
                        type={'movie'}
                        posterShape={'poster'}
                        poster={'https://blog.stremio.com/wp-content/uploads/2018/11/product-post-360x240.jpg'}
                        title={'Movie title'}
                        progress={0.7}
                        menuOptions={CONTINUE_WATCHING_MENU}
                    />
                </div>
            </FocusableProvider>
        </ModalsContainerProvider>
    ))
    .add('continue-watching-square', () => (
        <ModalsContainerProvider>
            <FocusableProvider onModalsContainerDomTreeChange={onModalsContainerDomTreeChange}>
                <div style={storyStyle} className={appStyles['app']}>
                    <MetaItem
                        className={styles['meta-item-continue-watching']}
                        id={'1'}
                        type={'movie'}
                        posterShape={'square'}
                        title={'Movie title'}
                        progress={0.2}
                        menuOptions={CONTINUE_WATCHING_MENU}
                    />
                </div>
            </FocusableProvider>
        </ModalsContainerProvider>
    ))
    .add('addon-catalog-poster-movie', () => (
        <div style={storyStyle} className={appStyles['app']}>
            <MetaItem
                id={'0'}
                type={'movie'}
                posterShape={'poster'}
                poster={'qwe'}
                title={'Movie title'}
                progress={0.7}
            />
        </div>
    ))
    .add('addon-catalog-square-channel', () => (
        <div style={storyStyle} className={appStyles['app']}>
            <MetaItem
                id={'120'}
                type={'channel'}
                posterShape={'square'}
                poster={'qwe'}
                title={'Channel title'}
                progress={0.7}
            />
        </div>
    ))
    .add('addon-catalog-landscape-series', () => (
        <div style={storyStyle} className={appStyles['app']}>
            <MetaItem
                id={'1200'}
                type={'series'}
                posterShape={'landscape'}
                poster={'qwe'}
                title={'Series title'}
                progress={0.7}
            />
        </div>
    ));

storiesOf('ShareAddon', module)
    .add('share addon', () => (
        <div style={storyStyle} className={appStyles['app']}>
            <ShareAddon url={'....'} />
        </div>
    ));

storiesOf('UserPanel', module)
    .add('anonymous', () => (
        <div style={storyStyle} className={appStyles['app']}>
            <UserPanel
                resizeWindow={function() { alert('asdas') }}
            />
        </div>
    ))
    .add('without avatar', () => (
        <div style={storyStyle} className={appStyles['app']}>
            <UserPanel
                resizeWindow={function() { alert('asdas') }}
                email={'animals@mail.com'}
            />
        </div>
    ))
    .add('with avatar', () => (
        <div style={storyStyle} className={appStyles['app']}>
            <UserPanel
                resizeWindow={function() { alert('asdas') }}
                avatar={'https://www.stremio.com/website/home-stremio.png'}
                email={'animals@mail.com'}
            />
        </div>
    ));

storiesOf('Video', module)
    .add('poster-upcoming-watched-long-title', () => (
        <div style={storyStyle} className={appStyles['app']}>
            <Video
                className={styles['video']}
                id={'1'}
                poster={'https://www.stremio.com/website/home-stremio.png'}
                episode={2}
                title={'The Bing BranHypothesiingBranHypothesiingBranHypothesiingBranHypothesiingBranHypothesiingBran Hypothesiing Bran Hypothesiing Bran Hypothesiing Bran Hypothesiing Bran Hypothesis'}
                released={new Date(2018, 4, 23)}
                isUpcoming={true}
                isWatched={true}
                season={2}
                onClick={function() { alert(8) }}
            />
        </div>
    ))
    .add('empty-poster-progress', () => (
        <div style={storyStyle} className={appStyles['app']}>
            <Video
                className={styles['video']}
                id={'2'}
                poster={''}
                episode={2}
                title={'The Bing Bran Hypothesis'}
                progress={20}
                season={2}
                onClick={function() { alert(8) }}
            />
        </div>
    ))
    .add('no-poster-upcoming', () => (
        <div style={storyStyle} className={appStyles['app']}>
            <Video
                className={styles['video']}
                id={'3'}
                episode={4}
                title={'The Luminous Fish Effect'}
                isUpcoming={true}
                season={2}
            />
        </div>
    ))
    .add('no-poster-upcoming-watched', () => (
        <div style={storyStyle} className={appStyles['app']}>
            <Video
                className={styles['video']}
                id={'4'}
                poster={'5'}
                episode={5}
                title={'The Dumpling Paradox'}
                isUpcoming={true}
                isWatched={true}
                season={2}
            />
        </div>
    ))
    .add('no-poster-long-title-progress', () => (
        <div style={storyStyle} className={appStyles['app']}>
            <Video
                className={styles['video']}
                id={'5'}
                episode={8}
                title={'The Bing BranHypothesiingBranHypothesiingBranHypothesiingBranHypothesiingBranHypothesiingBran Hypothesiing Bran Hypothesiing Bran Hypothesiing Bran Hypothesiing Bran Hypothesis'}
                released={new Date(2018, 4, 23)}
                isUpcoming={true}
                progress={50}
                season={2}
            />
        </div>
    ));

storiesOf('VideosList', module)
    .add('list of videos', () => (
        <ModalsContainerProvider>
            <FocusableProvider onModalsContainerDomTreeChange={onModalsContainerDomTreeChange}>
                <div className={appStyles['app']}>
                    <VideosList
                        className={styles['videos-list']}
                        videos={[
                            { id: '1', poster: 'https://www.stremio.com/websiste/home-stremio.png', episode: 1, name: 'The Bing BranHypothesiingBranHypothesiingBranHypothesiingBranHypothesiingBranHypothesiingBran Hypothesiing Bran Hypothesiing Bran Hypothesiing Bran Hypothesiing Bran Hypothesis', description: 'dasdasda', released: new Date(2018, 4, 23), isUpcoming: true, isWatched: true, season: 1 },
                            { id: '2', poster: 'https://www.stremio.com/website/home-stremio.png', episode: 2, name: 'The Bing Bran Hypothesis', description: 'dasdasda', released: new Date(2018, 4, 23), isWatched: true, season: 3 },
                            { id: '3', episode: 4, name: 'The Luminous Fish Effect', description: 'dasdasda', released: new Date(2018, 4, 23), progress: 50, season: 5 },
                            { id: '4', poster: 'https://www.stremiocom/website/home-stremio.png', episode: 5, name: 'The Dumpling Paradox', description: 'dasdasda', released: new Date(2018, 4, 23), progress: 50, season: 4 },
                            { id: '5', episode: 8, name: 'The Loobendfeld Decay', description: 'dasdasda', released: new Date(2018, 4, 23), isUpcoming: true, season: 5 },
                            { id: '6', poster: 'https://www.stremio.com/website/home-stremio.png', episode: 1, name: 'The Bing BranHypothesiingBranHypothesiingBranHypothesiingBranHypothesiingBranHypothesiingBran Hypothesiing Bran Hypothesiing Bran Hypothesiing Bran Hypothesiing Bran Hypothesis', description: 'dasdasda', released: new Date(2018, 4, 23), isUpcoming: true, isWatched: true, season: 1 },
                            { id: '7', poster: 'https://www.stremio.com/website/home-stremio.png', episode: 2, name: 'The Bing Bran Hypothesis', description: 'dasdasda', released: new Date(2018, 4, 23), isWatched: true, season: 1 },
                            { id: '8', episode: 4, name: 'The Luminous Fish Effect', description: 'dasdasda', released: new Date(2018, 4, 23), progress: 50, season: 3 },
                            { id: '9', poster: 'https://www.stremiocom/website/home-stremio.png', episode: 5, name: 'The Dumpling Paradox', description: 'dasdasda', released: new Date(2018, 4, 23), progress: 50, season: 2 },
                            { id: '10', episode: 8, name: 'The Loobendfeld Decay', description: 'dasdasda', released: new Date(2018, 4, 23), isUpcoming: true, season: 5 },
                            { id: '11', episode: 8, name: 'The Loobendfeld Decay', description: 'dasdasda', released: new Date(2018, 4, 23), isUpcoming: true, season: 1 },
                            { id: '12', poster: 'https://www.stremio.com/website/home-stremio.png', episode: 1, name: 'The Bing BranHypothesiingBranHypothesiingBranHypothesiingBranHypothesiingBranHypothesiingBran Hypothesiing Bran Hypothesiing Bran Hypothesiing Bran Hypothesiing Bran Hypothesis', description: 'dasdasda', released: new Date(2018, 4, 23), isUpcoming: true, isWatched: true, season: 1 },
                            { id: '13', poster: 'https://www.stremio.com/website/home-stremio.png', episode: 2, name: 'The Bing Bran Hypothesis', description: 'dasdasda', released: new Date(2018, 4, 23), isWatched: true, season: 1 },
                            { id: '14', episode: 4, name: 'The Luminous Fish Effect', description: 'dasdasda', released: new Date(2018, 4, 23), progress: 50, season: 3 },
                            { id: '15', poster: 'https://www.stremiocom/website/home-stremio.png', episode: 5, name: 'The Dumpling Paradox', description: 'dasdasda', released: new Date(2018, 4, 23), progress: 50, season: 2 },
                            { id: '16', episode: 8, name: 'The Loobendfeld Decay', description: 'dasdasda', released: new Date(2018, 4, 23), isUpcoming: true, season: 5 },
                            { id: '17', episode: 8, name: 'The Loobendfeld Decay', description: 'dasdasda', released: new Date(2018, 4, 23), isUpcoming: true, season: 1 },
                            { id: '18', poster: 'https://www.stremio.com/website/home-stremio.png', episode: 1, name: 'The Bing BranHypothesiingBranHypothesiingBranHypothesiingBranHypothesiingBranHypothesiingBran Hypothesiing Bran Hypothesiing Bran Hypothesiing Bran Hypothesiing Bran Hypothesis', description: 'dasdasda', released: new Date(2018, 4, 23), isUpcoming: true, isWatched: true, season: 1 },
                            { id: '19', poster: 'https://www.stremio.com/website/home-stremio.png', episode: 2, name: 'The Bing Bran Hypothesis', description: 'dasdasda', released: new Date(2018, 4, 23), isWatched: true, season: 1 },
                            { id: '20', episode: 4, name: 'The Luminous Fish Effect', description: 'dasdasda', released: new Date(2018, 4, 23), progress: 50, season: 3 },
                            { id: '21', poster: 'https://www.stremiocom/wsebsite/home-stremio.png', episode: 5, name: 'The Dumpling Paradox', description: 'dasdasda', released: new Date(2018, 4, 23), progress: 50, season: 2 },
                            { id: '22', episode: 8, name: 'The Loobendfeld Decay', description: 'dasdasda', released: new Date(2018, 4, 23), isUpcoming: true, season: 5 },
                            { id: '23', episode: 8, name: 'The Loobendfeld Decay', description: 'dasdasda', released: new Date(2018, 4, 23), isUpcoming: true, season: 1 },
                            { id: '24', poster: 'https://www.stremio.com/website/home-stremio.png', episode: 1, name: 'The Bing BranHypothesiingBranHypothesiingBranHypothesiingBranHypothesiingBranHypothesiingBran Hypothesiing Bran Hypothesiing Bran Hypothesiing Bran Hypothesiing Bran Hypothesis', description: 'dasdasda', released: new Date(2018, 4, 23), isUpcoming: true, isWatched: true, season: 1 },
                            { id: '25', poster: 'https://www.stremio.com/website/home-stremio.png', episode: 2, name: 'The Bing Bran Hypothesis', description: 'dasdasda', released: new Date(2018, 4, 23), isWatched: true, season: 1 },
                            { id: '26', episode: 4, name: 'The Luminous Fish Effect', description: 'dasdasda', released: new Date(2018, 4, 23), progress: 50, season: 3 },
                            { id: '27', poster: 'https://www.stremiocom/website/home-stremio.png', episode: 5, name: 'The Dumpling Paradox', description: 'dasdasda', released: new Date(2018, 4, 23), progress: 50, season: 2 },
                            { id: '28', episode: 8, name: 'The Loobendfeld Decay', description: 'dasdasda', released: new Date(2018, 4, 23), isUpcoming: true, season: 5 },
                            { id: '29', episode: 8, name: 'The Loobendfeld Decay', description: 'dasdasda', released: new Date(2018, 4, 23), isUpcoming: true, season: 1 },
                            { id: '30', poster: 'https://www.stremio.com/website/home-stremio.png', episode: 1, name: 'The Bing BranHypothesiingBranHypothesiingBranHypothesiingBranHypothesiingBranHypothesiingBran Hypothesiing Bran Hypothesiing Bran Hypothesiing Bran Hypothesiing Bran Hypothesis', description: 'dasdasda', released: new Date(2018, 4, 23), isUpcoming: true, isWatched: true, season: 1 },
                            { id: '31', poster: 'https://www.stremio.com/website/home-stremio.png', episode: 2, name: 'The Bing Bran Hypothesis', description: 'dasdasda', released: new Date(2018, 4, 23), isWatched: true, season: 1 },
                            { id: '32', episode: 4, name: 'The Luminous Fish Effect', description: 'dasdasda', released: new Date(2018, 4, 23), progress: 50, season: 1 },
                            { id: '33', poster: 'https://www.stremiocom/website/home-stremio.png', episode: 5, name: 'The Dumpling Paradox', description: 'dasdasda', released: new Date(2018, 4, 23), progress: 50, season: 2 },
                            { id: '34', episode: 8, name: 'The Loobendfeld Decay', description: 'dasdasda', released: new Date(2018, 4, 23), isUpcoming: true, season: 1 },
                            { id: '35', episode: 8, name: 'The Loobendfeld Decay', description: 'dasdasda', released: new Date(2018, 4, 23), isUpcoming: true, season: 1 },
                            { id: '36', poster: 'https://www.stremio.com/website/home-stremio.png', episode: 1, name: 'The Bing BranHypothesiingBranHypothesiingBranHypothesiingBranHypothesiingBranHypothesiingBran Hypothesiing Bran Hypothesiing Bran Hypothesiing Bran Hypothesiing Bran Hypothesis', description: 'dasdasda', released: new Date(2018, 4, 23), isUpcoming: true, isWatched: true, season: 1 },
                            { id: '37', poster: 'https://www.stremio.com/website/home-stremio.png', episode: 2, name: 'The Bing Bran Hypothesis', description: 'dasdasda', released: new Date(2018, 4, 23), isWatched: true, season: 1 },
                            { id: '38', episode: 4, name: 'The Luminous Fish Effect', description: 'dasdasda', released: new Date(2018, 4, 23), progress: 50, season: 1 },
                            { id: '39', poster: 'https://www.stremiocom/website/home-stremio.png', episode: 5, name: 'The Dumpling Paradox', description: 'dasdasda', released: new Date(2018, 4, 23), progress: 50, season: 2 },
                            { id: '40', episode: 8, name: 'The Loobendfeld Decay', description: 'dasdasda', released: new Date(2018, 4, 23), isUpcoming: true, season: 1 },
                            { id: '41', episode: 8, name: 'The Loobendfeld Decay', description: 'dasdasda', released: new Date(2018, 4, 23), isUpcoming: true, season: 1 },
                            { id: '42', poster: 'https://www.stremio.com/website/home-stremio.png', episode: 1, name: 'The Bing BranHypothesiingBranHypothesiingBranHypothesiingBranHypothesiingBranHypothesiingBran Hypothesiing Bran Hypothesiing Bran Hypothesiing Bran Hypothesiing Bran Hypothesis', description: 'dasdasda', released: new Date(2018, 4, 23), isUpcoming: true, isWatched: true, season: 1 },
                            { id: '43', poster: 'https://www.stremio.com/website/home-stremio.png', episode: 2, name: 'The Bing Bran Hypothesis', description: 'dasdasda', released: new Date(2018, 4, 23), isWatched: true, season: 1 },
                            { id: '44', episode: 4, name: 'The Luminous Fish Effect', description: 'dasdasda', released: new Date(2018, 4, 23), progress: 50, season: 1 },
                            { id: '45', poster: 'https://www.stremiocom/website/home-stremio.png', episode: 5, name: 'The Dumpling Paradox', description: 'dasdasda', released: new Date(2018, 4, 23), progress: 50, season: 2 },
                            { id: '46', episode: 8, name: 'The Loobendfeld Decay', description: 'dasdasda', released: new Date(2018, 4, 23), isUpcoming: true, season: 1 }
                        ]}
                    />
                </div>
            </FocusableProvider>
        </ModalsContainerProvider>
    ));

storiesOf('Stream', module)
    .add('no-logo-title', () => (
        <div style={storyStyle} className={appStyles['app']}>
            <Stream
                className={styles['stream']}
                sourceName={'Amazon'}
                title={'Vikings S01E09 HDTV XviD-AFG[ettv], 👤 1'}
            />
        </div>
    ))
    .add('no-logo-subtitle', () => (
        <div style={storyStyle} className={appStyles['app']}>
            <Stream
                className={styles['stream']}
                sourceName={'iTunes'}
                subtitle={'Aasdasd dsasa sad.'}
            />
        </div>
    ))
    .add('logo-progress', () => (
        <div style={storyStyle} className={appStyles['app']}>
            <Stream
                className={styles['stream']}
                onClick={function() { alert(122) }}
                progress={40}
                logo={'ic_itunes'}
                title={'$1.99 purchase SD,$2.99 purchase HD'}
            />
        </div>
    ))
    .add('long-source-name', () => (
        <div style={storyStyle} className={appStyles['app']}>
            <Stream
                className={styles['stream']}
                sourceName={'Amazon amazonamazon amazonamazonamazon amazonamazonamazonamazon amazonamazonamazon amazonamazon amazon'}
                title={'SD'}
            />
        </div>
    ))
    .add('long-title-subtitle', () => (
        <div style={storyStyle} className={appStyles['app']}>
            <Stream
                className={styles['stream']}
                sourceName={'iTunes'}
                title={'This is title is title is title is title is title is title is title is title is title is title is title is title is title is title is title is title is title is title is title istitle is title is title is title is title is title is title is title is title is title is title is title is title is title is title is title is title is title is title is title is title is title is title is title is title is title is title is title is title is title is title is title is title is title is title is title is title is title'}
                subtitle={'This is subtitle is subtitle is subtitle is subtitle is subtitle is subtitle is subtitle is subtitle is subtitle is subtitle issubtitle is subtitle is subtitle is subtitle is subtitle is subtitle is subtitle is subtitle is subtitle is subtitle is subtitle is subtitle is subtitle is subtitle is subtitle is subtitle is subtitle is subtitle is subtitle is subtitle is subtitle is subtitle is subtitle is subtitle is subtitle is subtitle is subtitle is subtitle is subtitle is subtitle is subtitle is subtitle'}
            />
        </div>
    ));

storiesOf('StreamsList', module)
    .add('short list of streams', () => (
        <div style={streamsListStyle} className={appStyles['app']}>
            <StreamsList
                streams={[
                    { id: '1', logo: 'ic_itunes', sourceName: 'iTunes', title: 'Vikings S01E09 HDTV XviD-AFG[ettv], 👤 1', subtitle: 'HDTV', progress: 50 },
                    { id: '2', logo: '', sourceName: 'Amazon', title: '$1.99 purchase SD,$2.99 purchase HD', subtitle: '', progress: 50 },
                    { id: '3', logo: '', sourceName: 'Juan Carlos 2', title: 'Vikings S01E09 HDTV XviD-AFG[ettv], 👤 1', subtitle: 'HDTV', progress: 50 },
                    { id: '4', logo: 'ic_amazon', sourceName: 'Amazon', title: 'Vikings S01E09 HDTV XviD-AFG[ettv], 👤 1', subtitle: '', progress: 0 }
                ]}
                onMoreAddonsClicked={function() { alert(123) }}
            />
        </div>
    ))
    .add('long list of streams', () => (
        <div style={streamsListStyle} className={appStyles['app']}>
            <StreamsList
                streams={[
                    { id: '1', logo: 'ic_itunes', sourceName: 'iTunes', title: 'Vikings S01E09 HDTV XviD-AFG[ettv], 👤 1', subtitle: 'HDTV', progress: 50 },
                    { id: '2', logo: '', sourceName: 'Amazon', title: '$1.99 purchase SD,$2.99 purchase HD', subtitle: '', progress: 50 },
                    { id: '3', logo: '', sourceName: 'Juan Carlos 2', title: 'Vikings S01E09 HDTV XviD-AFG[ettv], 👤 1', subtitle: 'HDTV', progress: 50 },
                    { id: '4', logo: 'ic_amazon', sourceName: 'Amazon', title: 'Vikings S01E09 HDTV XviD-AFG[ettv], 👤 1', subtitle: '', progress: 0 },
                    { id: '5', logo: 'ic_amazon', sourceName: 'Amazon', title: '$1.99 purchase SD,$2.99 purchase HD', subtitle: '', progress: 0 },
                    { id: '6', logo: 'ic_netflix', sourceName: 'Netflix', title: '$1.99 purchase SD,$2.99 purchase HD', subtitle: 'HDTV', progress: 50 },
                    { id: '7', logo: '', sourceName: 'IBERIAN', title: '', subtitle: '', progress: 0 },
                    { id: '8', logo: 'ic_netflix', sourceName: 'Netflix', title: 'SD', subtitle: '', progress: 50 },
                    { id: '9', logo: 'ic_itunes', sourceName: 'Netflix', title: 'SD', subtitle: 'HDTV', progress: 50 },
                    { id: '10', logo: 'ic_amazon', sourceName: 'Amazon', title: '', subtitle: 'HDTV', progress: 0 }
                ]}
            />
        </div>
    ));