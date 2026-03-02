import { useEffect, useRef } from 'react';

const useTimeout = (duration: number) => {
    const timeout = useRef<NodeJS.Timeout | null>(null);

    const start = (callback: () => void) => {
        cancel();
        timeout.current = setTimeout(callback, duration);
    };

    const cancel = () => {
        timeout.current && clearTimeout(timeout.current);
        timeout.current = null;
    };

    useEffect(() => {
        return () => cancel();
    }, []);

    return {
        start,
        cancel,
    };
};

export default useTimeout;
