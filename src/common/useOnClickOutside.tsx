// Copyright (C) 2017-2024 Smart code 203358507

import { useEffect } from 'react';

const useOnClickOutside = (ref: React.MutableRefObject<HTMLElement>, handler: () => void, ignore?: boolean) => {
    useEffect(() => {
        const onClickOutside = (event: MouseEvent) => {
            const element = event.target as Node;
            if (ref.current && !ref.current.contains(element)) {
                !ignore && handler();
            }
        };

        document.addEventListener('mouseup', onClickOutside);
        return () => document.removeEventListener('mouseup', onClickOutside);
    }, [handler]);
};

export default useOnClickOutside;
