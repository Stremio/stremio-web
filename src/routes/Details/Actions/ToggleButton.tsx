// Copyright (C) 2017-2026 Smart code 203358507

import React, { useCallback, useState } from 'react';
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
    library: { off: 'library-outline', on: 'library' },
    watched: { off: 'eye', on: 'eye' },
};

const ToggleButton = ({ className, variant, on, label, onClick }: Props) => {
    const [fresh, setFresh] = useState(false);

    const onButtonClick = useCallback(() => {
        setFresh(true);
        onClick();
    }, [onClick]);

    const onMouseLeave = useCallback(() => {
        setFresh(false);
    }, []);

    return (
        <Button
            className={classNames(className, styles['toggle-button'], styles[variant], { [styles['on']]: on, [styles['fresh']]: fresh })}
            aria-pressed={on}
            aria-label={label}
            onClick={onButtonClick}
            onMouseLeave={onMouseLeave}
        >
            <Tooltip label={label} position={'top'} />
            <div className={styles['glyph']}>
                <Icon className={styles['icon']} name={on ? ICONS[variant].on : ICONS[variant].off} />
                <div className={styles['badge']} aria-hidden={'true'}>
                    <Icon className={classNames(styles['badge-icon'], styles['add'])} name={'add'} />
                    <Icon className={classNames(styles['badge-icon'], styles['check'])} name={'checkmark'} />
                    <Icon className={classNames(styles['badge-icon'], styles['remove'])} name={'remove'} />
                </div>
            </div>
        </Button>
    );
};

export default ToggleButton;
