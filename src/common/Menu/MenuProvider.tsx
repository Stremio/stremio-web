// Copyright (C) 2017-2024 Smart code 203358507

import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import classNames from 'classnames';
import useKeyboardEvent from '../useKeyboardEvent';
import useOnClickOutside from '../useOnClickOutside';
import MenuContext from './MenuContext';
import { type Menu } from './types';

type Props = {
    children: JSX.Element,
    className: string,
};

const MenuProvider = ({ children, className }: Props) => {
    const container = useRef<HTMLDivElement>(null);

    const [menus, setMenus] = useState<Menu[]>([]);
    const [style, setStyle] = useState<React.CSSProperties>({});

    const active = useMemo(() => menus.find(({ open }) => open), [menus]);

    const create = (menu: Omit<Menu, 'open'>) => {
        setMenus((menus) => ([
            ...menus,
            {
                ...menu,
                open: false,
            },
        ]));
    };

    const remove = (id: string) => {
        setMenus((menus) => menus.filter((menu) => menu.id !== id));
    };

    const render = (content: JSX.Element) => {
        return container.current && createPortal(content, container.current);
    };

    const toggle = (id: string) => {
        setMenus((menus) => menus.map((menu) => ({
            ...menu,
            open: menu.id === id && !menu.open,
        })));
    };

    const closeAll = () => {
        setMenus((menus) => menus.map((menu) => ({
            ...menu,
            open: false,
        })));
    };

    useLayoutEffect(() => {
        setStyle({});

        if (container.current && active) {
            const menu = container.current.getBoundingClientRect();
            const parent = active.parent.getBoundingClientRect();

            const position = active.position;
            const y = position ? position[0] : (parent.bottom + menu.height) > window.innerHeight ? 'top' : 'bottom';
            const x = position ? position[1] : (parent.right + menu.width) > window.innerWidth ? 'left' : 'right';

            setStyle({
                top: y === 'top' ? parent.top - menu.height : parent.bottom,
                left: x === 'left' ? parent.right - menu.width : parent.left,
            });
        }
    }, [active]);

    useEffect(() => {
        window.addEventListener('resize', closeAll);
        return () => window.removeEventListener('resize', closeAll);
    });

    useKeyboardEvent('Escape', closeAll);
    useOnClickOutside(container.current && active?.parent ? [container.current, active.parent] : [], closeAll);

    return (
        <MenuContext.Provider value={{ active, create, remove, render, toggle }}>
            {children}
            <div ref={container} className={classNames(className, active?.className)} style={style} />
        </MenuContext.Provider>
    );
};

export default MenuProvider;
