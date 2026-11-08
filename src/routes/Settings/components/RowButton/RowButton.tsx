// Copyright (C) 2017-2026 Smart code 203358507

import React from 'react';
import classNames from 'classnames';
import { useTranslation } from 'react-i18next';
import Icon from '@stremio/stremio-icons/react';
import { Button } from 'stremio/components';
import styles from './RowButton.less';

type Props = {
    label: string,
    icon?: string,
    href?: string,
    external?: boolean,
    variant?: 'primary' | 'danger',
    disabled?: boolean,
    onClick?: () => void,
};

const RowButton = ({ label, icon, href, external, variant, disabled, onClick }: Props) => {
    const { t } = useTranslation();

    return (
        <Button
            className={classNames(styles['row-button'], variant && styles[variant])}
            title={label}
            href={href}
            target={external && href ? '_blank' : undefined}
            disabled={disabled}
            tabIndex={disabled ? -1 : 0}
            aria-disabled={disabled}
            onClick={disabled ? undefined : onClick}
        >
            {
                icon &&
                    <Icon className={styles['icon']} name={icon} />
            }
            <div className={styles['label']}>{label}</div>
            {
                external &&
                    <div className={classNames(styles['icon'], styles['external'])} role={'img'} aria-label={t('SETTINGS_OPENS_IN_NEW_TAB')}>
                        <Icon className={styles['svg']} name={'open-in-browser'} />
                    </div>
            }
        </Button>
    );
};

export default RowButton;
