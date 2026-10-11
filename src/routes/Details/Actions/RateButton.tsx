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
    on: boolean,
    disabled?: boolean,
    label: string,
    onClick: () => void,
};

const RateButton = ({ className, icon, on, disabled = false, label, onClick }: Props) => (
    <Button
        className={classNames(className, styles['rate-button'], { [styles['on']]: on })}
        aria-pressed={on}
        aria-label={label}
        disabled={disabled}
        onClick={onClick}
    >
        <Tooltip label={label} position={'top'} />
        <Icon className={styles['icon']} name={icon} />
    </Button>
);

export default RateButton;
