// Copyright (C) 2017-2024 Smart code 203358507

import React, { useEffect, useRef } from 'react';
import useMenu from './useMenu';
import useKeyboardEvent from '../useKeyboardEvent';
import type { MenuPosition } from './types';
import styles from './styles.less';

type Props = {
    children: JSX.Element,
    className: string,
    shortcut?: string,
    position?: MenuPosition,
};

const createId = () => (Math.random() + 1).toString(36).substring(7);

const Menu = ({ children, className, shortcut, position }: Props) => {    
    const menu = useMenu();
    
    const id = useRef(createId());
    const element = useRef<HTMLDivElement>(null);

    const onToggle = () => {
        menu.toggle(id.current);
    };

    useEffect(() => {
        const parent = element.current?.parentElement;
        if (parent) {
            parent.addEventListener('click', onToggle);
            menu.create({
                id: id.current,
                className,
                parent,
                position,
            });
        }

        return () => {
            parent && parent.removeEventListener('click', onToggle);
            menu.remove(id.current);
        };
    }, []);

    shortcut && useKeyboardEvent(shortcut, onToggle, !shortcut);

    return <>
        <div ref={element} className={styles['menu-placeholder']} />
        {menu.active?.id === id.current && menu.render(children)}
    </>;
};

export default Menu;
