import React from 'react';
import { storiesOf } from '@storybook/react';
import { Checkbox } from 'stremio-common';
import appStyles from '../src/App/styles';
import styles from './styles';

const storyStyle = {
    padding: '10px',
    overflow: 'auto',
    minHeight: 'initial'
};

storiesOf('Checkbox', module)
    .add('checked', () => (
        <div style={storyStyle} className={appStyles['app']}>
            <Checkbox className={styles['checkbox-size']} checked={true} disabled={false}>
                <div />
            </Checkbox>
        </div>
    ))
    .add('checked-disabled', () => (
        <div style={storyStyle} className={appStyles['app']}>
            <Checkbox className={styles['checkbox-size']} checked={true} disabled={true}>
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
    .add('not-checked-disabled', () => (
        <div style={storyStyle} className={appStyles['app']}>
            <Checkbox className={styles['checkbox-size']} checked={false} disabled={true}>
                <div />
            </Checkbox>
        </div>
    ));
