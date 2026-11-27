// Copyright (C) 2017-2026 Smart code 203358507

const getScrollParent = (element: HTMLElement | null): HTMLElement | null => {
    let parent = element?.parentElement ?? null;
    while (parent !== null && !['auto', 'scroll', 'overlay'].includes(window.getComputedStyle(parent).overflowY)) {
        parent = parent.parentElement;
    }

    return parent;
};

export default getScrollParent;
