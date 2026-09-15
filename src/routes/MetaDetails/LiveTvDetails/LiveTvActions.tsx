// Copyright (C) 2017-2026 Smart code 203358507

import React from 'react';
import { useTranslation } from 'react-i18next';
import ActionButton from 'stremio/components/MetaPreview/ActionButton';
import styles from './LiveTvActions.less';

type Props = {
    children?: React.ReactNode;
    inLibrary: boolean;
    onToggleLibrary: () => void;
};

const LiveTvActions = ({ children, inLibrary, onToggleLibrary }: Props) => {
    const { t } = useTranslation();

    return (
        <div className={styles['playback']}>
            {children}
            <ActionButton
                className={styles['action-button']}
                icon={inLibrary ? 'remove-from-library' : 'add-to-library'}
                label={inLibrary ? t('REMOVE_FROM_LIB') : t('ADD_TO_LIB')}
                variant={'icon'}
                tooltip={true}
                role={'button'}
                onClick={onToggleLibrary}
            />
        </div>
    );
};

export default LiveTvActions;
