// Copyright (C) 2017-2024 Smart code 203358507

import { createContext } from 'react';
import { type Menu } from './types';

type MenuContext = {
    active?: Menu,
    create: (menu: Omit<Menu, 'open'>) => void,
    remove: (id: string) => void,
    render: (content: JSX.Element) => void,
    toggle: (id: string) => void,
};

const MenuContext = createContext<MenuContext>({} as MenuContext);

export default MenuContext;

