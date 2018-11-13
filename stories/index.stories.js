import React from 'react';
import { storiesOf } from '@storybook/react';
import { Addon, Checkbox, LibraryItemList, MetaItem, ShareAddon, Stream, UserPanel, Video } from 'stremio-common';
import appStyles from '../src/app/styles';
import styles from './styles';

storiesOf('Addon', module)
    .add('addon', () => (
        <div style={{ padding: '10px' }} className={appStyles['app']}>
            <Addon onToggleClicked={function() { alert('1') }} logo={'ic_series'} name={'Watch Hub'} version={'1.3.0'} isInstalled={false} types={['Movies', 'Series']} description={'Find where to stream your favourite movies and shows amongst iTunes, Hulu, Amazon and other UK/US services.'} urls={['http://nfxaddon.strem.io/stremioget', 'http://127.0.0.1:11470/addons/com.stremio.subtitles/stremioget', 'http://127.0.0.1:11470/addons/com.stremio.localfiles/stremioget']} />
            <Addon name={'Cinemeta'} version={'2.4.0'} isInstalled={true} types={['Movies', 'Series']} description={'Watch your favourite YouTube channels ad-free and get notified when they upload new videos.'} urls={['https://channels.strem.io/stremioget/stremio/v1', 'https://channels.strem.io/stremioget/stremio/v1']} />
            <Addon logo={'ic_youtube_small'} name={'YouTube'} version={'1.3.0'} isInstalled={true} types={['Channels', 'Videos']} description={'Watch your favourite YouTube channels ad-free and get notified when they upload new videos.'} urls={['https://channels.strem.io/stremioget/stremio/v1', 'https://channels.strem.io/stremioget/stremio/v1']} />
            <Addon name={'OpenSubtitles'} version={'1.3.0'} isInstalled={false} types={['Movies', 'Series']} description={'Watch your favourite YouTube channels ad-free and get notified when they upload new videos.'} urls={['https://channels.strem.io/stremioget/stremio/v1', 'https://channels.strem.io/stremioget/stremio/v1', 'http://127.0.0.1:11470/addons/com.stremio.subtitles/stremioget', 'https://channels.strem.io/stremioget/stremio/v1']} />
        </div>
    ));

storiesOf('Checkbox', module)
    .add('checkbox', () => (
        <div style={{ padding: '10px' }} className={appStyles['app']}>
            <Checkbox className={styles['checkbox-size']} checked={true} enabled={false} />
            <Checkbox className={styles['checkbox-size']} checked={false} enabled={false} />
            <Checkbox className={styles['checkbox-size']} checked={false} enabled={true} />
            <Checkbox className={styles['checkbox-size']} checked={true} enabled={true} />
        </div>
    ))

storiesOf('LibraryItemList', module)
    .add('library item list', () => (
        <div style={{ padding: '10px' }} className={appStyles['app']}>
            <LibraryItemList poster={'http://t3.gstatic.com/images?q=tbn:ANd9GcST1uigGrukMvSAVUefFNuQ0NMZAR-FjfFIwSZFCR5ZkyMSgCyj'} title={'Thor Ragnarok'} type={'Movies'} releaseInfo={new Date(2018)} released={new Date(2018, 4, 23)} views={12} hours={1245} lastViewed={new Date(2018, 4, 23)} />
            <LibraryItemList play={function() { alert('2') }} watchTrailer={function() { alert('4') }} addToLibrary={function() { alert('24') }} poster={'https://m.media-amazon.com/images/M/MV5BMTU5NDI1MjkwMF5BMl5BanBnXkFtZTgwNjIxNTY2MzI@._V1_UX182_CR0,0,182,268_AL_.jpg'} title={'Pitch Perfect 3'} type={'Series'} releaseInfo={new Date(2018)} released={new Date(2018, 4, 23)} views={1} hours={1245} lastViewed={new Date(2018, 4, 23)} />
            <LibraryItemList poster={'https://m.media-amazon.com/images/M/MV5BODAxNDFhNGItMzdiMC00NDM1LWExYWUtZjNiMGIzYTc0MTM5XkEyXkFqcGdeQXVyMjYzMjA3NzI@._V1_UY268_CR3,0,182,268_AL_.jpg'} title={'Deadpool'} type={'Channel'} releaseInfo={new Date(2018)} released={new Date(2018, 4, 23)} views={3} hours={1245} lastViewed={new Date(2018, 4, 23)} />
            <LibraryItemList poster={'https://m.media-amazon.com/images/M/MV5BNGNiNWQ5M2MtNGI0OC00MDA2LWI5NzEtMmZiYjVjMDEyOWYzXkEyXkFqcGdeQXVyMjM4NTM5NDY@._V1_.jpg'} title={'The Shape of Water'} type={'Movies'} releaseInfo={new Date(2018)} released={new Date(2018, 4, 23)} views={8} hours={1245} lastViewed={new Date(2018, 4, 23)} />
        </div>
    ));

storiesOf('MetaItem', module)
    .add('meta item', () => (
        <div style={{ padding: '10px' }} className={appStyles['app']}>
            <MetaItem poster={'https://m.media-amazon.com/images/M/MV5BODQ0NDhjYWItYTMxZi00NTk2LWIzNDEtOWZiYWYxZjc2MTgxXkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_.jpg'} />
            <MetaItem title={'Red Sparrow'} poster={'https://m.media-amazon.com/images/M/MV5BMTk2Mjc2NzYxNl5BMl5BanBnXkFtZTgwMTA2OTA1NDM@._V1_.jpg'} />
            <MetaItem play={function() { alert('32423') }} showInfo={function() { alert('222') }} progress={50} poster={'https://m.media-amazon.com/images/M/MV5BMTA3MDkxOTc4NDdeQTJeQWpwZ15BbWU4MDAxNzgyNTQz._V1_.jpg'} />
            <MetaItem poster={'https://m.media-amazon.com/images/M/MV5BYWVhZjZkYTItOGIwYS00NmRkLWJlYjctMWM0ZjFmMDU4ZjEzXkEyXkFqcGdeQXVyMTMxODk2OTU@._V1_UX182_CR0,0,182,268_AL_.jpg'} />
        </div>
    ));

storiesOf('ShareAddon', module)
    .add('share addon', () => (
        <div style={{ padding: '10px' }} className={appStyles['app']}>
            <ShareAddon url={'....'} />
        </div>
    ));

storiesOf('Stream', module)
    .add('stream', () => (
        <div style={{ padding: '10px' }} className={appStyles['app']}>
            <Stream sourceName={'Amazon'} title={'Vikings S01E09 HDTV XviD-AFG[ettv], 👤 1'} />
            <Stream sourceName={'iTunes'} subtitle={'Aasdasd dsasa sad.'} />
            <Stream play={function() { alert(122) }} progress={40} logo={'ic_itunes'} title={'$1.99 purchase SD,$2.99 purchase HD'} />
            <Stream logo={'ic_amazon'} title={'HDTV'} isFree={true} />
            <Stream sourceName={'Amazon'} title={'SD'} isSubscription={true} />
        </div>
    ));

storiesOf('UserPanel', module)
    .add('user panel', () => (
        <div style={{ padding: '10px' }} className={appStyles['app']}>
            <UserPanel resizeWindow={function() { alert('asdas') }} photo={'https://image.freepik.com/free-vector/wild-animals-cartoon_1196-361.jpg'} email={'animals@mail.com'} />
        </div>
    ));

storiesOf('Video', module)
    .add('video', () => (
        <div style={{ padding: '10px' }} className={appStyles['app']}>
            <Video poster={'https://www.nationalgeographic.com/content/dam/photography/rights-exempt/pod-archive-grid-wide.adapt.945.1.jpg'} number={2} name={'The Bing Bran Hypothesis'} duration={23} isWatched={true} onVideoClicked={function() { alert(8) }} />
            <Video number={4} name={'The Luminous Fish Effect'} progress={50} duration={22} />
            <Video poster={'5'} number={5} name={'The Dumpling Paradox'} progress={50} duration={22} />
            <Video number={8} name={'The Loobendfeld Decay'} released={new Date(2018, 4, 23)} isUpcoming={true} />
        </div>
    ));