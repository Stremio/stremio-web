// Copyright (C) 2017-2026 Smart code 203358507

import React from 'react';
import classNames from 'classnames';
import Icon from '@stremio/stremio-icons/react';
import Button from 'stremio/components/Button';
import { Tooltip } from 'stremio/common/Tooltips';
import styles from './ToggleButton.less';

type Props = {
    className?: string,
    variant: 'library' | 'watched',
    on: boolean,
    label: string,
    onClick: () => void,
};

const ICONS = {
    library: { base: 'library-outline', fill: 'library', ring: 'add' },
    watched: { base: 'eye', fill: null, ring: 'checkmark' },
};

const ToggleButton = ({ className, variant, on, label, onClick }: Props) => {
    const icons = ICONS[variant];

    return (
        <Button
            className={classNames(className, styles['toggle-button'], { [styles['on']]: on })}
            aria-pressed={on}
            aria-label={label}
            onClick={onClick}
        >
            <Tooltip label={label} position={'top'} />
            <div className={styles['glyph']}>
                <div className={styles['art']}>
                    <Icon className={styles['icon']} name={icons.base} />
                    {
                        icons.fill !== null ?
                            <Icon className={classNames(styles['icon'], styles['fill'])} name={icons.fill} />
                            :
                            null
                    }
                </div>
                <div className={styles['ring']} aria-hidden={'true'}>
                    <Icon className={styles['ring-icon']} name={icons.ring} />
                </div>
                <div className={styles['disc']} aria-hidden={'true'}>
                    <Icon className={styles['disc-icon']} name={'checkmark'} />
                </div>
            </div>
        </Button>
    );
};

export default ToggleButton;
