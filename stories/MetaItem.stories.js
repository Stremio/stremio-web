import React from 'react';
import { storiesOf } from '@storybook/react';
import { MetaItem, FocusableProvider } from 'stremio-common';
import ModalsContainerProvider from '../src/common/Router/Route/ModalsContainerProvider';
import appStyles from '../src/App/styles';
import styles from './styles';

const storyStyle = {
    padding: '10px',
    overflow: 'auto',
    minHeight: 'initial'
};

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
