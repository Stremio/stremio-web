// Copyright (C) 2017-2026 Smart code 203358507

import { getInterfaceRect } from 'stremio/common/interfaceScale';

export const getScrollParent = (element: HTMLElement | null): HTMLElement | null => {
    let parent = element?.parentElement ?? null;
    while (parent !== null && !['auto', 'scroll', 'overlay'].includes(window.getComputedStyle(parent).overflowY)) {
        parent = parent.parentElement;
    }

    return parent;
};

const getOffsetInParent = (element: HTMLElement, parent: HTMLElement) => {
    return getInterfaceRect(element).top - getInterfaceRect(parent).top;
};

export const revealNearest = (element: HTMLElement) => {
    const parent = getScrollParent(element);
    if (!parent) {
        return;
    }

    const style = window.getComputedStyle(element);
    const marginTop = parseFloat(style.scrollMarginTop) || 0;
    const marginBottom = parseFloat(style.scrollMarginBottom) || 0;
    const top = getOffsetInParent(element, parent);
    const bottom = top + getInterfaceRect(element).height;
    if (top < marginTop) {
        parent.scrollTop += top - marginTop;
    } else if (bottom > parent.clientHeight - marginBottom) {
        parent.scrollTop += bottom - (parent.clientHeight - marginBottom);
    }
};

export const scrollToFraction = (element: HTMLElement, fraction: number, smooth: boolean) => {
    const parent = getScrollParent(element);
    if (!parent) {
        return;
    }

    parent.scrollTo({
        top: Math.max(0, parent.scrollTop + getOffsetInParent(element, parent) - parent.clientHeight * fraction),
        behavior: smooth ? 'smooth' : 'auto',
    });
};
