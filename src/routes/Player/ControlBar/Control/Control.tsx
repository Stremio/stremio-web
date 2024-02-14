// Copyright (C) 2017-2024 Smart code 203358507

import React, { useCallback, useEffect, useRef } from 'react';
import classNames from 'classnames';
import Icon from '@stremio/stremio-icons/react';
import { Button, useBinaryState, useOnClickOutside, useKeyboardEvent } from 'stremio/common';
import styles from './styles.less';

type Props = {
    children?: JSX.Element,
    className?: string,
    disabled?: boolean,
    icon: string,
    title?: string,
    shortcut?: string,
    onMenuChange?: (state: boolean) => void,
    onClick?: () => void,
};

const Control = ({ children, className, disabled, icon, title, shortcut, onMenuChange, onClick }: Props) => {
    const ref = useRef(null);
    const [menuOpen,, closeMenu, toggleMenu] = useBinaryState();

    const onButtonClick = () => {
        toggleMenu();
        onClick && onClick();
    };

    const onMenuClick = (event: React.MouseEvent<HTMLDivElement>) => {
        event.stopPropagation();
    };

    const onClickOutside = useCallback(() => {
        menuOpen && closeMenu();
    }, [menuOpen]);

    useEffect(() => {
        onMenuChange && onMenuChange(menuOpen);
    }, [menuOpen, onMenuChange]);

    useOnClickOutside(ref, onClickOutside);
    useKeyboardEvent('Escape', closeMenu);
    shortcut && useKeyboardEvent(shortcut, toggleMenu);

    return (
        <Button
            ref={ref}
            className={classNames(className, styles['control-button'], { 'disabled': disabled })}
            tabIndex={-1}
            title={title}
            onClick={onButtonClick}
        >
            <Icon className={styles['icon']} name={icon} />
            {
                children && menuOpen ?
                    <div className={styles['menu-container']} onClick={onMenuClick}>
                        {children}
                    </div>
                    :
                    null
            }
        </Button>
    );
};

export default Control;
