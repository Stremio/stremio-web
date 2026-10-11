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
    library: { off: 'add-to-library', on: 'library', undo: 'remove-from-library' },
    watched: { off: 'eye', on: 'eye', undo: 'eye-off' },
};

const ToggleButton = ({ className, variant, on, label, onClick }: Props) => {
    const [fresh, setFresh] = useState(false);
    const icons = ICONS[variant];

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
                <Icon className={classNames(styles['icon'], styles['icon-off'])} name={icons.off} />
                <Icon className={classNames(styles['icon'], styles['icon-on'])} name={icons.on} />
                <Icon className={classNames(styles['icon'], styles['icon-undo'])} name={icons.undo} />
            </div>
        </Button>
    );
};

export default ToggleButton;
