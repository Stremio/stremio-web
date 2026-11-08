// Copyright (C) 2017-2026 Smart code 203358507

import React from 'react';
import { useTranslation } from 'react-i18next';
import Icon from '@stremio/stremio-icons/react';
import { Button } from 'stremio/components';
import styles from './RowButton.less';

type Props = {
    label: string,
    external?: boolean,
    disabled?: boolean,
    onClick?: () => void,
};

const RowButton = ({ label, external, disabled, onClick }: Props) => {
    const { t } = useTranslation();

    return (
        <Button
            className={styles['row-button']}
            title={label}
            disabled={disabled}
            tabIndex={disabled ? -1 : 0}
            aria-disabled={disabled}
            onClick={disabled ? undefined : onClick}
        >
            <div className={styles['label']}>{label}</div>
            {
                external &&
                    <div className={styles['icon']} role={'img'} aria-label={t('SETTINGS_OPENS_IN_NEW_TAB')}>
                        <Icon className={styles['svg']} name={'open-in-browser'} />
                    </div>
            }
        </Button>
    );
};

export default RowButton;
