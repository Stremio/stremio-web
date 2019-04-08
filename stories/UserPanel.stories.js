import React from 'react';
import { storiesOf } from '@storybook/react';
import { UserPanel } from 'stremio-common';
import appStyles from '../src/App/styles';

const storyStyle = {
    padding: '10px',
    overflow: 'auto',
    minHeight: 'initial'
};

storiesOf('UserPanel', module)
    .add('anonymous', () => (
        <div style={storyStyle} className={appStyles['app']}>
            <UserPanel
                resizeWindow={function() { alert('resized window') }}
            />
        </div>
    ))
    .add('without avatar', () => (
        <div style={storyStyle} className={appStyles['app']}>
            <UserPanel
                email={'user@mail.bg'}
                resizeWindow={function() { alert('resized window') }}
            />
        </div>
    ))
    .add('with avatar', () => (
        <div style={storyStyle} className={appStyles['app']}>
            <UserPanel
                avatar={'https://www.stremio.com/website/home-stremio.png'}
                email={'user@mail.bg'}
                resizeWindow={function() { alert('resized window') }}
            />
        </div>
    ));
