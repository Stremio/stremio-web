// Copyright (C) 2017-2026 Smart code 203358507

import { useCallback, useEffect, useRef, useState } from 'react';
import { getInterfaceRect, getInterfaceScale } from 'stremio/common/interfaceScale';

const CLOSE_THRESHOLD = 100;
const CLOSE_THRESHOLD_RATIO = 0.12;
const DISMISS_START_DELTA = 8;

type DragState = {
    id: number | null,
    startX: number,
    startY: number,
    offset: number,
    dismissing: boolean,
    locked: boolean,
    scroller: Element | null,
};

type Options = {
    containerRef: React.RefObject<HTMLDivElement>,
    enabled: boolean,
    isExiting: () => boolean,
    onDismiss: () => void,
};

const createDragState = (): DragState => ({
    id: null,
    startX: 0,
    startY: 0,
    offset: 0,
    dismissing: false,
    locked: false,
    scroller: null,
});

const isVerticallyScrollable = (element: Element) => {
    const { overflowY } = window.getComputedStyle(element);
    if (overflowY !== 'auto' && overflowY !== 'scroll' && overflowY !== 'overlay') {
        return false;
    }

    return element.scrollHeight > element.clientHeight + 1;
};

const findScrolledAncestor = (target: EventTarget | null, container: HTMLElement | null) => {
    let element = target instanceof Element ? target : null;

    while (element && element !== container) {
        if (isVerticallyScrollable(element) && element.scrollTop > 1) {
            return element;
        }

        element = element.parentElement;
    }

    return null;
};

const useSheetDrag = ({ containerRef, enabled, isExiting, onDismiss }: Options) => {
    const dragRef = useRef<DragState>(createDragState());
    const [offset, setOffset] = useState(0);
    const [dragging, setDragging] = useState(false);

    const reset = useCallback(() => {
        dragRef.current = createDragState();
        setDragging(false);
        setOffset(0);
    }, []);

    useEffect(() => {
        const node = containerRef.current;
        if (!enabled || node === null) {
            return undefined;
        }

        const onTouchStart = (event: TouchEvent) => {
            if (isExiting() || event.touches.length !== 1) {
                return;
            }

            const touch = event.touches[0];
            dragRef.current = {
                id: touch.identifier,
                startX: touch.clientX,
                startY: touch.clientY,
                offset: 0,
                dismissing: false,
                locked: false,
                scroller: findScrolledAncestor(event.target, node),
            };
        };

        const onTouchMove = (event: TouchEvent) => {
            const drag = dragRef.current;
            const touch = Array.from(event.touches).find(({ identifier }) => identifier === drag.id);
            if (!touch || isExiting() || drag.locked) {
                return;
            }

            const deltaX = touch.clientX - drag.startX;
            const deltaY = touch.clientY - drag.startY;

            if (!drag.dismissing) {
                if (Math.abs(deltaX) > 10 && Math.abs(deltaX) > Math.abs(deltaY)) {
                    drag.locked = true;
                    return;
                }

                if (deltaY < DISMISS_START_DELTA) {
                    return;
                }

                if (drag.scroller !== null && drag.scroller.scrollTop > 1) {
                    return;
                }

                drag.dismissing = true;
                drag.startY = touch.clientY;
                drag.offset = 0;
                setDragging(true);
                event.preventDefault();
                return;
            }

            event.preventDefault();
            const nextOffset = Math.max(0, (touch.clientY - drag.startY) / getInterfaceScale());
            drag.offset = nextOffset;
            setOffset(nextOffset);
        };

        const onTouchEnd = (event: TouchEvent) => {
            const drag = dragRef.current;
            if (drag.id === null || event.touches.length > 0) {
                return;
            }

            const shouldClose = drag.dismissing && drag.offset > Math.max(
                CLOSE_THRESHOLD,
                getInterfaceRect(node).height * CLOSE_THRESHOLD_RATIO,
            );

            if (shouldClose) {
                onDismiss();
                return;
            }

            reset();
        };

        node.addEventListener('touchstart', onTouchStart, { passive: true });
        node.addEventListener('touchmove', onTouchMove, { passive: false });
        node.addEventListener('touchend', onTouchEnd);
        node.addEventListener('touchcancel', onTouchEnd);

        return () => {
            node.removeEventListener('touchstart', onTouchStart);
            node.removeEventListener('touchmove', onTouchMove);
            node.removeEventListener('touchend', onTouchEnd);
            node.removeEventListener('touchcancel', onTouchEnd);
        };
    }, [containerRef, enabled, isExiting, onDismiss, reset]);

    return { offset, dragging, reset };
};

export default useSheetDrag;
