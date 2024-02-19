// Copyright (C) 2017-2024 Smart code 203358507

import React, { useCallback, useRef } from 'react';
import classNames from 'classnames';
import Icon from '@stremio/stremio-icons/react';
import { Button, useOnClickOutside, useKeyboardEvent } from 'stremio/common';
import styles from './styles.less';

type Props = {
    id: string;
    children?: JSX.Element,
    className?: string,
    disabled?: boolean,
    icon: string,
    title?: string,
    shortcut?: string,
    onClick?: () => void,
    isActive: boolean;
    toggleMenu?: (id: string) => void;
};

const Control = ({ id, children, className, disabled, icon, title, shortcut, onClick, isActive, toggleMenu }: Props) => {
    const ref = useRef<HTMLDivElement>(null);

    const handleClick = () => {
        onClick?.();
        !isActive ? toggleMenu(id) : toggleMenu(null);
    };

    const onClickOutside = useCallback(() => {
        if (isActive) toggleMenu?.(null);
    }, [isActive, toggleMenu]);

    const handleMenuClick = (e: { stopPropagation: () => void }) => {
        e.stopPropagation();
    }

    useOnClickOutside(ref, onClickOutside);
    useKeyboardEvent('Escape', onClickOutside);
    shortcut && useKeyboardEvent(shortcut, handleClick); 

    return (
        <div ref={ref} className={classNames(className, styles['control-button'], { 'disabled': disabled })} title={title}>
            <Button tabIndex={-1} onClick={handleClick}>
                <Icon className={classNames(styles['icon'])} name={icon} />
            </Button>
            {
                isActive && children ?
                    <div className={styles['menu-container']} onClick={handleMenuClick}>
                        {children}
                    </div>
                    : 
                    null
            }
        </div>
    );
};

export default Control;
