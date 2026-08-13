// Copyright (C) 2017-2026 Smart code 203358507

import { useContext } from 'react';
import GamepadContext from './GamepadContext';

const useGamepad = () => {
    return useContext(GamepadContext);
};

export default useGamepad;
