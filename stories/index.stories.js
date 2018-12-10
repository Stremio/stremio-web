import React from 'react';
import { storiesOf } from '@storybook/react';
import { Addon, Checkbox, LibraryItemList, MetaItem, ShareAddon, UserPanel } from 'stremio-common';
import Stream from '../src/routes/Detail/StreamsList/Stream';
import Video from '../src/routes/Detail/VideosList/Video';
import VideosList from '../src/routes/Detail/VideosList';
import StreamsList from '../src/routes/Detail/StreamsList';
import colors from 'stremio-colors';
import appStyles from '../src/app/styles';
import styles from './styles';

const storyStyle = {
    padding: '10px',
    overflow: 'auto',
    minHeight: 'initial'
};

const videosListStyle = {
    position: 'absolute',
    height: '100%',
    padding: '10px',
    minHeight: 'initial',
    background: colors.backgroundlighter
}

const streamsListStyle = {
    position: 'absolute',
    height: '100%',
    padding: '10px',
    minHeight: 'initial',
    background: colors.backgroundlighter
}

storiesOf('Addon', module)
    .add('not-installed', () => (
        <div style={storyStyle} className={appStyles['app']}>
            <Addon
                onToggleClicked={function() { alert('1') }}
                logo={'ic_series'}
                name={'Watch Hub'}
                version={'1.3.0'}
                isInstalled={false}
                types={['Movies', 'Series']}
                description={'Find where to stream your favourite movies and shows amongst iTunes, Hulu, Amazon and other UK/US services.'}
                urls={['http://nfxaddon.strem.io/stremioget', 'http://127.0.0.1:11470/addons/com.stremio.subtitles/stremioget', 'http://127.0.0.1:11470/addons/com.stremio.localfiles/stremioget']}
            />
        </div>
    ))
    .add('installed', () => (
        <div style={storyStyle} className={appStyles['app']}>
            <Addon
                name={'Cinemeta'}
                version={'2.4.0'}
                isInstalled={true}
                types={['Movies', 'Series']}
                description={'Watch your favourite YouTube channels ad-free and get notified when they upload new videos.'}
                urls={['https://channels.strem.io/stremioget/stremio/v1', 'https://channels.strem.io/stremioget/stremio/v1']}
            />
        </div>
    ))
    .add('long-description', () => (
        <div style={storyStyle} className={appStyles['app']}>
            <Addon
                logo={'ic_youtube_small'}
                name={'YouTube'}
                version={'1.3.0'}
                isInstalled={true}
                types={['Channels', 'Videos']}
                description={'Watch your favourite YouTube channels ad-free and get notiour favourite YouTube channels ad-free and get notiour favourite YouTube channels ad-free and get notiour favourite YouTube channels ad-free and get notiour favourite YouTube channels ad-free and get notiourfavourite YouTube channels ad-free and get notiour favourite YouTube channels ad-free and get notiourfavourite YouTube channels ad-free and get notiour favourite YouTube channels ad-free and get notiour favourite YouTube channels ad-free and get notified when they upload new videos.'}
                urls={['https://channels.strem.io/stremioget/stremio/v1', 'https://channels.strem.io/stremioget/stremio/v1']}
            />
        </div>
    ))
    .add('long-urls', () => (
        <div style={storyStyle} className={appStyles['app']}>
            <Addon
                name={'OpenSubtitles'}
                version={'1.3.0'}
                isInstalled={false}
                types={['Movies', 'Series']}
                description={'Watch your favourite YouTube channels ad-free and get notified when they upload new videos.'}
                urls={['https://channels.strem.io/stremioget/stremio/v1channels.strem.io/stremioget/stremio/v1channels.strem.io/stremioget/stremio/v1', 'https://channels.strem.io/stremioget/stremio/v1', 'http://127.0.0.1:11470/addons/com.stremio.subtitles/stremioget', 'https://channels.strem.io/stremioget/stremio/v1']}
            />
        </div>
    ));

storiesOf('Checkbox', module)
    .add('checked-disabled', () => (
        <div style={storyStyle} className={appStyles['app']}>
            <Checkbox
                className={styles['checkbox-size']}
                checked={true}
                enabled={false}
            />
        </div>
    ))
    .add('not-checked-disabled', () => (
        <div style={storyStyle} className={appStyles['app']}>
            <Checkbox
                className={styles['checkbox-size']}
                checked={false}
                enabled={false}
            />
        </div>
    ))
    .add('not-checked', () => (
        <div style={storyStyle} className={appStyles['app']}>
            <Checkbox
                className={styles['checkbox-size']}
                checked={false}
                enabled={true}
            />
        </div>
    ))
    .add('checked', () => (
        <div style={storyStyle} className={appStyles['app']}>
            <Checkbox
                className={styles['checkbox-size']}
                checked={true}
                enabled={true}
            />
        </div>
    ))

storiesOf('LibraryItemList', module)
    .add('library item list', () => (
        <div style={storyStyle} className={appStyles['app']}>
            <LibraryItemList
                poster={'http://t3.gstatic.com/images?q=tbn:ANd9GcST1uigGrukMvSAVUefFNuQ0NMZAR-FjfFIwSZFCR5ZkyMSgCyj'}
                title={'Thor Ragnarok'}
                type={'Movies'}
                releaseInfo={new Date(2018)}
                released={new Date(2018, 4, 23)}
                views={12}
                hours={1245}
                lastViewed={new Date(2018, 4, 23)}
            />
        </div>
    ));

storiesOf('MetaItem', module)
    .add('poster', () => (
        <div style={storyStyle} className={appStyles['app']}>
            <MetaItem
                poster={'https://m.media-amazon.com/images/M/MV5BODQ0NDhjYWItYTMxZi00NTk2LWIzNDEtOWZiYWYxZjc2MTgxXkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_.jpg'}
            />
        </div>
    ))
    .add('with-title', () => (
        <div style={storyStyle} className={appStyles['app']}>
            <MetaItem
                title={'Red Sparrow'}
                poster={'https://m.media-amazon.com/images/M/MV5BMTk2Mjc2NzYxNl5BMl5BanBnXkFtZTgwMTA2OTA1NDM@._V1_.jpg'}
            />
        </div>
    ))
    .add('with-progress', () => (
        <div style={storyStyle} className={appStyles['app']}>
            <MetaItem
                play={function() { alert('32423') }}
                showInfo={function() { alert('222') }}
                progress={50}
                poster={'https://m.media-amazon.com/images/M/MV5BMTA3MDkxOTc4NDdeQTJeQWpwZ15BbWU4MDAxNzgyNTQz._V1_.jpg'}
            />
        </div>
    ))
    .add('landscape-shape', () => (
        <div style={storyStyle} className={appStyles['app']}>
            <MetaItem
                posterShape={'landscape'}
                poster={'https://m.media-amazon.com/images/M/MV5BYWVhZjZkYTItOGIwYS00NmRkLWJlYjctMWM0ZjFmMDU4ZjEzXkEyXkFqcGdeQXVyMTMxODk2OTU@._V1_UX182_CR0,0,182,268_AL_.jpg'}
            />
        </div>
    ));


storiesOf('ShareAddon', module)
    .add('share addon', () => (
        <div style={storyStyle} className={appStyles['app']}>
            <ShareAddon url={'....'} />
        </div>
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
                poster={'https://www.stremio.com/website/home-stremio.png'}
                episode={2}
                title={'The Bing BranHypothesiingBranHypothesiingBranHypothesiingBranHypothesiingBranHypothesiingBran Hypothesiing Bran Hypothesiing Bran Hypothesiing Bran Hypothesiing Bran Hypothesis'}
                released={new Date(2018, 4, 23)}
                isUpcoming={true}
                isWatched={true}
                onVideoClicked={function() { alert(8) }}
            />
        </div>
    ))
    .add('poster-watched', () => (
        <div style={storyStyle} className={appStyles['app']}>
            <Video
                className={styles['video']}
                poster={'https://www.stremio.com/website/home-stremio.png'}
                episode={2}
                title={'The Bing Bran Hypothesis'}
                isWatched={true}
                onVideoClicked={function() { alert(8) }}
            />
        </div>
    ))
    .add('no-poster-progress', () => (
        <div style={storyStyle} className={appStyles['app']}>
            <Video
                className={styles['video']}
                episode={4}
                title={'The Luminous Fish Effect'}
                progress={50}
            />
        </div>
    ))
    .add('poster-progress', () => (
        <div style={storyStyle} className={appStyles['app']}>
            <Video
                className={styles['video']}
                poster={'5'}
                episode={5}
                title={'The Dumpling Paradox'}
                progress={50}
            />
        </div>
    ))
    .add('no-poster-upcoming', () => (
        <div style={storyStyle} className={appStyles['app']}>
            <Video
                className={styles['video']}
                episode={8}
                title={'The Loobendfeld Decay'}
                released={new Date(2018, 4, 23)}
                isUpcoming={true}
            />
        </div>
    ));

storiesOf('VideosList', module)
    .add('list of videos', () => (
        <div style={videosListStyle} className={appStyles['app']}>
            <VideosList videos={[
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
            ]}></VideosList>
        </div>
    ));

storiesOf('StreamsList', module)
    .add('list of streams', () => (
        <div style={streamsListStyle} className={appStyles['app']}>
            <StreamsList streams={[
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
            ]}></StreamsList>
        </div>
    ));