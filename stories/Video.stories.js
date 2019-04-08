import React from 'react';
import { storiesOf } from '@storybook/react';
import Video from '../src/routes/Detail/VideosList/Video';
import appStyles from '../src/App/styles';
import styles from './styles';

const storyStyle = {
    padding: '10px',
    overflow: 'auto',
    minHeight: 'initial'
};

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
