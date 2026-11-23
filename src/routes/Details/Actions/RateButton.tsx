// Copyright (C) 2017-2026 Smart code 203358507

import React from 'react';
import classNames from 'classnames';
import Icon from '@stremio/stremio-icons/react';
import Button from 'stremio/components/Button';
import { Tooltip } from 'stremio/common/Tooltips';
import styles from './RateButton.less';

type Props = {
    className?: string,
    icon: string,
    fill: string,
    on: boolean,
    disabled?: boolean,
    label: string,
    onClick: () => void,
};

const RateButton = ({ className, icon, fill, on, disabled = false, label, onClick }: Props) => (
    <Button
        className={classNames(className, styles['rate-button'], { [styles['on']]: on, [styles['pending']]: disabled })}
        aria-pressed={on}
        aria-label={label}
        aria-disabled={disabled}
        onClick={disabled ? undefined : onClick}
    >
        <Tooltip label={label} position={'top'} />
        <div className={styles['glyph']}>
            <Icon className={styles['icon']} name={icon} />
            <Icon className={classNames(styles['icon'], styles['fill'])} name={fill} />
        </div>
    </Button>
);

export default RateButton;
