// Copyright (C) 2017-2024 Smart code 203358507

import { useEffect } from 'react';

const useKeyboardEvent = (name: string, handler: (shift: boolean) => void, ignore?: boolean) => {
    useEffect(() => {
        const onKeyDown = ({ code, shiftKey }: KeyboardEvent) => {
            !ignore && code === name && handler(shiftKey);
        };

        document.addEventListener('keydown', onKeyDown);
        return () => document.removeEventListener('keydown', onKeyDown);
    }, [handler, ignore]);
};

export default useKeyboardEvent;
