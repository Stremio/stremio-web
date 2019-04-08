import React from 'react';
import { storiesOf } from '@storybook/react';
import { FocusableProvider } from 'stremio-common';
import InstallAddonDialog from '../src/routes/Addons/InstallAddonDialog';
import ModalsContainerProvider from '../src/common/Router/Route/ModalsContainerProvider';
import appStyles from '../src/App/styles';

const storyStyle = {
    padding: '10px',
    overflow: 'auto',
    minHeight: 'initial'
};

const onModalsContainerDomTreeChange = ({ modalsContainerElement }) => {
    return modalsContainerElement.childElementCount === 0;
};

storiesOf('InstallAddonDialog', module)
    .add('install addon dialog', () => (
        <ModalsContainerProvider>
            <FocusableProvider onModalsContainerDomTreeChange={onModalsContainerDomTreeChange}>
                <div style={storyStyle} className={appStyles['app']}>
                    <InstallAddonDialog 
                        logo={'ic_youtube_small'}
                        name={'YouTube'}
                        version={'1.3.0'}
                        isInstalled={false}
                        types={['Channels', 'Videos', 'Movies']}
                        description={'Watch your favourite YouTube channels ad-free and get notified when they upload new videos.'}
                        onClose={function() { alert('closed') }}
                        onInstallClicked={function() { alert('installed') }}
                    />
                </div>
            </FocusableProvider>
        </ModalsContainerProvider>
    ));
