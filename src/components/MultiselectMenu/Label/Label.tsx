// Copyright (C) 2017-2026 Smart code 203358507

import React from 'react';
import classNames from 'classnames';
import Icon from '@stremio/stremio-icons/react';
import Button from 'stremio/components/Button';
import styles from './Label.less';

type Props = {
    text?: string | null,
    icon?: string,
    disabled?: boolean,
    open: boolean,
    onClick: (event: React.MouseEvent<HTMLDivElement>) => void,
};

const Label = ({ text, icon, disabled, open, onClick }: Props) => (
    <Button
        className={classNames(styles['button'], { [styles['open']]: open })}
        disabled={disabled}
        onClick={onClick}
        tabIndex={0}
        aria-haspopup={'listbox'}
        aria-expanded={open}
        role={icon ? 'button' : undefined}
        aria-label={icon ? text : undefined}
        title={icon ? text ?? undefined : undefined}
    >
        <div className={styles['text']}>
            {
                icon ?
                    <Icon name={icon} className={styles['label-icon']} />
                    :
                    text
            }
        </div>
        {
            !icon &&
                <Icon name={'caret-down'} className={classNames(styles['icon'], { [styles['open']]: open })} />
        }
    </Button>
);

export default Label;
