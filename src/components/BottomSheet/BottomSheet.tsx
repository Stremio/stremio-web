// Copyright (C) 2017-2024 Smart code 203358507

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';
import { Modal, useModalsContainer } from 'stremio-router';
import { useRouteFocused } from 'stremio/common';
import useOrientation from 'stremio/common/useOrientation';
import styles from './BottomSheet.less';

const CLOSE_THRESHOLD = 100;
const CLOSE_THRESHOLD_RATIO = 0.12;
const ANIMATION_DURATION = 250;
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

type Props = {
    children: React.ReactNode,
    className?: string,
    title?: string,
    ariaLabel?: string,
    show: boolean,
    onClose: () => void,
    closeOnContentClick?: boolean,
    closeOnOrientationChange?: boolean,
    flush?: boolean,
};

const BottomSheet = ({ children, className, title, ariaLabel, show, onClose, closeOnContentClick = true, closeOnOrientationChange = true, flush = false }: Props) => {
    const { t } = useTranslation();
    const routeFocused = useRouteFocused();
    const modalsContainer = useModalsContainer();
    const modalRef = useRef<HTMLElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const onCloseRef = useRef(onClose);
    const closingRef = useRef(false);
    const wasShownRef = useRef(false);
    const dragRef = useRef<DragState>(createDragState());
    const orientation = useOrientation();
    const previousOrientationRef = useRef(orientation);
    const [offset, setOffset] = useState(0);
    const [dragging, setDragging] = useState(false);
    const [mounted, setMounted] = useState(false);
    const [open, setOpen] = useState(false);
    const [closing, setClosing] = useState(false);

    onCloseRef.current = onClose;

    const labelledBy = typeof title === 'string' && title.length > 0 ? title : ariaLabel;

    const containerStyle = useMemo(() => ({
        transform: open ? `translateY(${offset}px)` : 'translateY(100%)',
    }), [open, offset]);

    const finishClose = useCallback(() => {
        if (!closingRef.current) {
            return;
        }

        closingRef.current = false;
        wasShownRef.current = false;
        dragRef.current = createDragState();
        setClosing(false);
        setDragging(false);
        setMounted(false);
        setOffset(0);
        onCloseRef.current();
    }, []);

    const requestClose = useCallback(() => {
        if (!wasShownRef.current || closingRef.current) {
            return;
        }

        closingRef.current = true;
        dragRef.current = createDragState();
        setClosing(true);
        setDragging(false);
        setOpen(false);
        setOffset(0);
    }, []);

    const onContentClick = useCallback(() => {
        if (closeOnContentClick) {
            requestClose();
        }
    }, [closeOnContentClick, requestClose]);

    const onTransitionEnd = useCallback((event: React.TransitionEvent<HTMLDivElement>) => {
        if (event.target !== containerRef.current || event.propertyName !== 'transform') {
            return;
        }

        if (closingRef.current) {
            finishClose();
        }
    }, [finishClose]);

    useEffect(() => {
        if (show) {
            closingRef.current = false;
            wasShownRef.current = true;
            dragRef.current = createDragState();
            setClosing(false);
            setDragging(false);
            setMounted(true);
            setOffset(0);

            let secondFrame = 0;
            const firstFrame = requestAnimationFrame(() => {
                secondFrame = requestAnimationFrame(() => {
                    if (!closingRef.current) {
                        setOpen(true);
                    }
                });
            });

            return () => {
                cancelAnimationFrame(firstFrame);
                cancelAnimationFrame(secondFrame);
            };
        }

        if (!wasShownRef.current) {
            return undefined;
        }

        requestClose();
        return undefined;
    }, [show, requestClose]);

    useEffect(() => {
        if (!closing) {
            return undefined;
        }

        const timeout = window.setTimeout(() => {
            finishClose();
        }, ANIMATION_DURATION + 50);

        return () => window.clearTimeout(timeout);
    }, [closing, finishClose]);

    useEffect(() => {
        if (!mounted || !routeFocused || !(modalsContainer instanceof HTMLElement)) {
            return undefined;
        }

        const onKeyDown = (event: KeyboardEvent) => {
            if (event.code !== 'Escape') {
                return;
            }

            if (modalsContainer.childNodes[modalsContainer.childElementCount - 2] !== modalRef.current) {
                return;
            }

            requestClose();
        };

        window.addEventListener('keydown', onKeyDown);
        return () => window.removeEventListener('keydown', onKeyDown);
    }, [mounted, routeFocused, modalsContainer, requestClose]);

    useEffect(() => {
        if (!closeOnOrientationChange) {
            previousOrientationRef.current = orientation;
            return undefined;
        }

        if (previousOrientationRef.current !== orientation && wasShownRef.current) {
            requestClose();
        }

        previousOrientationRef.current = orientation;
        return undefined;
    }, [orientation, closeOnOrientationChange, requestClose]);

    useEffect(() => {
        const node = containerRef.current;
        if (!mounted || node === null) {
            return undefined;
        }

        const resetDrag = () => {
            dragRef.current = createDragState();
            setDragging(false);
            setOffset(0);
        };

        const onTouchStart = (event: TouchEvent) => {
            if (closingRef.current || event.touches.length !== 1) {
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
            if (!touch || closingRef.current || drag.locked) {
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
            const nextOffset = Math.max(0, touch.clientY - drag.startY);
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
                node.getBoundingClientRect().height * CLOSE_THRESHOLD_RATIO,
            );

            if (shouldClose) {
                requestClose();
                return;
            }

            resetDrag();
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
    }, [mounted, requestClose]);

    if (!mounted) {
        return null;
    }

    return (
        <Modal
            ref={modalRef}
            className={classNames(styles['bottom-sheet'], className, { [styles['open']]: open })}
            autoFocus
        >
            <button
                className={styles['backdrop']}
                aria-label={t('BUTTON_CLOSE')}
                onClick={requestClose}
            />
            <div
                ref={containerRef}
                className={classNames(styles['container'], {
                    [styles['dragging']]: dragging,
                    [styles['flush']]: flush,
                })}
                style={containerStyle}
                role={'dialog'}
                aria-modal={'true'}
                aria-label={labelledBy}
                onTransitionEnd={onTransitionEnd}
            >
                <div className={styles['handle']} />
                {
                    typeof title === 'string' && title.length > 0 ?
                        <div className={styles['heading']}>
                            <div className={styles['title']}>
                                {title}
                            </div>
                        </div>
                        :
                        null
                }
                <div className={styles['content']} onClick={closeOnContentClick ? onContentClick : undefined}>
                    {children}
                </div>
            </div>
        </Modal>
    );
};

export default BottomSheet;
