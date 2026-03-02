import { useEffect, useRef } from 'react';

const useInterval = (duration: number) => {
    const interval = useRef<NodeJS.Timer | null>(null);

    const start = (callback: () => void) => {
        cancel();
        interval.current = setInterval(callback, duration);
    };

    const cancel = () => {
        interval.current && clearInterval(interval.current);
        interval.current = null;
    };

    useEffect(() => {
        return () => cancel();
    }, []);

    return {
        start,
        cancel,
    };
};

export default useInterval;
