// Copyright (C) 2017-2024 Smart code 203358507

import { useEffect } from 'react';

const useMouseEvent = (name: string, handler: () => void, ignore?: boolean) => {
    useEffect(() => {
        const onWheel = ({ deltaY }: WheelEvent) => {
            !ignore && name === 'ScrollDown' && deltaY > 0 && handler();
            !ignore && name === 'ScrollUp' && deltaY < 0 && handler();
        };

        document.addEventListener('wheel', onWheel);
        return () => document.removeEventListener('wheel', onWheel);
    }, [handler, ignore]);
};

export default useMouseEvent;
