import React from 'react';
import { storiesOf } from '@storybook/react';
import { ShareModal, FocusableProvider } from 'stremio-common';
import ModalsContainerProvider from '../src/common/Router/Route/ModalsContainerProvider';
import appStyles from '../src/App/styles';

const onModalsContainerDomTreeChange = ({ modalsContainerElement }) => {
    return modalsContainerElement.childElementCount === 0;
};

storiesOf('ShareModal', module)
    .add('share modal', () => (
        <ModalsContainerProvider>
            <FocusableProvider onModalsContainerDomTreeChange={onModalsContainerDomTreeChange}>
                <div className={appStyles['app']}>
                    <ShareModal url={'....'} />
                </div>
            </FocusableProvider>
        </ModalsContainerProvider>
    ));
