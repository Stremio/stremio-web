import React from 'react';
import { storiesOf } from '@storybook/react';
import { Addon, Checkbox, LibraryItemList, MetaItem, ShareAddon, Stream, UserPanel, Video } from 'stremio-common';
import appStyles from '../src/app/styles';
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
                description={'Watch your favourite YouTube channels ad-free and get notiour favourite YouTube channels ad-free and get notiour favourite YouTube channels ad-free and get notiour favourite YouTube channels ad-free and get notiour favourite YouTube channels ad-free and get notified when they upload new videos.'}
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
    .add('user panel', () => (
        <div style={storyStyle} className={appStyles['app']}>
            <UserPanel
                resizeWindow={function() { alert('asdas') }}
                photo={'https://image.freepik.com/free-vector/wild-animals-cartoon_1196-361.jpg'}
                email={'animals@mail.com'}
            />
        </div>
    ));

storiesOf('Video', module)
    .add('poster-upcoming-watched-long-title', () => (
        <div style={storyStyle} className={appStyles['app']}>
            <Video
                className={styles['video']}
                poster={'https://www.nationalgeographic.com/content/dam/photography/rights-exempt/pod-archive-grid-wide.adapt.945.1.jpg'}
                number={2}
                title={'The Bing Bran Hypothesiing Bran Hypothesiing Bran Hypothesiing Bran Hypothesiing Bran Hypothesiing Bran Hypothesiing Bran Hypothesiing Bran Hypothesiing Bran Hypothesiing Bran Hypothesis'}
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
                poster={'https://www.nationalgeographic.com/content/dam/photography/rights-exempt/pod-archive-grid-wide.adapt.945.1.jpg'}
                number={2}
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
                number={4}
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
                number={5}
                title={'The Dumpling Paradox'}
                progress={50}
            />
        </div>
    ))
    .add('no-poster-upcoming', () => (
        <div style={storyStyle} className={appStyles['app']}>
            <Video
                className={styles['video']}
                number={8}
                title={'The Loobendfeld Decay'}
                released={new Date(2018, 4, 23)}
                isUpcoming={true}
            />
        </div>
    ));