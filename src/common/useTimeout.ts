import { useEffect, useRef } from 'react';

const useTimeout = (duration: number) => {
    const timeout = useRef<NodeJS.Timeout | null>(null);

    const start = (callback: () => void, delay = duration) => {
        cancel();
        timeout.current = setTimeout(callback, delay);
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
