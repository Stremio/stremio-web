// Copyright (C) 2017-2026 Smart code 203358507

import { createContext } from 'react';

export type ControllerType = 'playstation' | 'xbox' | 'generic';

const GamepadContext = createContext<{
    on: (event: string, id: string, callback: (data?: string) => void) => void;
    off: (event: string, id: string) => void;
    lock: (prefix: string) => void;
    unlock: () => void;
    controllerType: ControllerType;
} | null>(null);

export default GamepadContext;
