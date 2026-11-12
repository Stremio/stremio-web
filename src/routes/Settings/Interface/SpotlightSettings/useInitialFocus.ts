// Copyright (C) 2017-2026 Smart code 203358507

import { useEffect, useRef, useState } from 'react';

const useInitialFocus = (active: boolean, ready: boolean) => {
    const [root, setRoot] = useState<HTMLDivElement | null>(null);
    const focusedRef = useRef(false);

    useEffect(() => {
        if (!active) {
            focusedRef.current = false;
            return;
        }

        if (focusedRef.current || !ready || root === null) return;

        const dialog = root.closest('.modal-container');
        const target = dialog?.querySelector<HTMLElement>('[aria-selected="true"]') ?? dialog?.querySelector<HTMLElement>('input');
        if (target) {
            focusedRef.current = true;
            target.focus({ preventScroll: true, focusVisible: false });
            target.scrollIntoView({ block: 'nearest' });
        }
    }, [active, ready, root]);

    return setRoot;
};

export default useInitialFocus;
