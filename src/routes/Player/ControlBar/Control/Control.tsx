// Copyright (C) 2017-2024 Smart code 203358507

import React from 'react';
import classNames from 'classnames';
import Icon from '@stremio/stremio-icons/react';
import { Button } from 'stremio/common';
import styles from './styles.less';

type Props = {
    children?: JSX.Element,
    className?: string,
    disabled?: boolean,
    icon: string,
    title?: string,
    onClick?: () => void,
};

const Control = ({ children, className, disabled, icon, title, onClick }: Props) => {
    return (
        <Button
            className={classNames(className, styles['control-button'], { 'disabled': disabled })}
            tabIndex={-1}
            title={title}
            onClick={onClick}
        >
            <Icon className={styles['icon']} name={icon} />
            {children}
        </Button>
    );
};

export default Control;
