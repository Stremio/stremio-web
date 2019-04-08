import React from 'react';
import { storiesOf } from '@storybook/react';
import Stream from '../src/routes/Detail/StreamsList/Stream';
import appStyles from '../src/App/styles';
import styles from './styles';

const storyStyle = {
    padding: '10px',
    overflow: 'auto',
    minHeight: 'initial'
};

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
