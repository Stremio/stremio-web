// Copyright (C) 2017-2026 Smart code 203358507

import React, { useCallback, useState } from 'react';
import classNames from 'classnames';
import Icon from '@stremio/stremio-icons/react';
import Button from 'stremio/components/Button';
import { Tooltip } from 'stremio/common/Tooltips';
import styles from './RateButton.less';

type Props = {
    className?: string,
    icon: string,
    filledIcon: string,
    on: boolean,
    disabled?: boolean,
    label: string,
    onClick: () => void,
};

const RateButton = ({ className, icon, filledIcon, on, disabled = false, label, onClick }: Props) => {
    const [fresh, setFresh] = useState(false);

    const onButtonClick = useCallback(() => {
        setFresh(true);
        onClick();
    }, [onClick]);

    const onMouseLeave = useCallback(() => setFresh(false), []);

    return (
        <Button
            className={classNames(className, styles['rate-button'], { [styles['on']]: on, [styles['pending']]: disabled, [styles['fresh']]: fresh })}
            aria-pressed={on}
            aria-label={label}
            aria-disabled={disabled}
            onClick={disabled ? undefined : onButtonClick}
            onMouseLeave={onMouseLeave}
        >
            <Tooltip label={label} position={'top'} />
            <div className={styles['glyph']}>
                <Icon className={classNames(styles['icon'], styles['icon-off'])} name={icon} />
                <Icon className={classNames(styles['icon'], styles['icon-on'])} name={filledIcon} />
                <Icon className={classNames(styles['icon'], styles['icon-undo'])} name={icon} />
            </div>
        </Button>
    );
};

export default RateButton;
