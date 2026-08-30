// Copyright (C) 2017-2024 Smart code 203358507

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import classNames from 'classnames';
import useOrientation from 'stremio/common/useOrientation';
import styles from './BottomSheet.less';

const CLOSE_THRESHOLD = 100;
const ANIMATION_DURATION = 250;

type Props = {
    children: React.ReactNode,
    className?: string,
    title?: string,
    show: boolean,
    onClose: () => void,
    closeOnContentClick?: boolean,
};

const BottomSheet = ({ children, className, title, show, onClose, closeOnContentClick = true }: Props) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const onCloseRef = useRef(onClose);
    const closingRef = useRef(false);
    const wasShownRef = useRef(false);
    const orientation = useOrientation();
    const previousOrientationRef = useRef(orientation);
    const [startOffset, setStartOffset] = useState(0);
    const [offset, setOffset] = useState(0);
    const [mounted, setMounted] = useState(false);
    const [open, setOpen] = useState(false);
    const [closing, setClosing] = useState(false);

    onCloseRef.current = onClose;

    const dragging = startOffset !== 0;
    const containerStyle = useMemo(() => ({
        transform: open ? `translateY(${offset}px)` : 'translateY(100%)',
    }), [open, offset]);

    const finishClose = useCallback(() => {
        if (!closingRef.current) {
            return;
        }

        closingRef.current = false;
        wasShownRef.current = false;
        setClosing(false);
        setMounted(false);
        setOffset(0);
        onCloseRef.current();
    }, []);

    const requestClose = useCallback(() => {
        if (!wasShownRef.current || closingRef.current) {
            return;
        }

        closingRef.current = true;
        setClosing(true);
        setOpen(false);
        setStartOffset(0);
        setOffset(0);
    }, []);

    const onTouchStart = ({ touches }: React.TouchEvent<HTMLDivElement>) => {
        if (closingRef.current) {
            return;
        }

        const { clientY } = touches[0];
        setStartOffset(clientY);
    };

    const onTouchMove = useCallback(({ touches }: React.TouchEvent<HTMLDivElement>) => {
        if (startOffset === 0 || closingRef.current) {
            return;
        }

        const { clientY } = touches[0];
        setOffset(Math.max(0, clientY - startOffset));
    }, [startOffset]);

    const onTouchEnd = () => {
        if (startOffset === 0) {
            return;
        }

        setStartOffset(0);

        if (offset > CLOSE_THRESHOLD) {
            requestClose();
            return;
        }

        setOffset(0);
    };

    const onTransitionEnd = useCallback((event: React.TransitionEvent<HTMLDivElement>) => {
        if (event.target !== containerRef.current || event.propertyName !== 'transform') {
            return;
        }

        if (closingRef.current) {
            finishClose();
        }
    }, [finishClose]);

    const onContentClick = useCallback(() => {
        if (closeOnContentClick) {
            requestClose();
        }
    }, [closeOnContentClick, requestClose]);

    useEffect(() => {
        if (show) {
            closingRef.current = false;
            wasShownRef.current = true;
            setClosing(false);
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
        if (!mounted) {
            return undefined;
        }

        const onKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                requestClose();
            }
        };

        document.addEventListener('keydown', onKeyDown);
        return () => document.removeEventListener('keydown', onKeyDown);
    }, [mounted, requestClose]);

    useEffect(() => {
        if (previousOrientationRef.current !== orientation && wasShownRef.current) {
            requestClose();
        }

        previousOrientationRef.current = orientation;
    }, [orientation, requestClose]);

    if (!mounted) {
        return null;
    }

    return createPortal((
        <div className={classNames(styles['bottom-sheet'], className, { [styles['open']]: open })}>
            <button
                className={styles['backdrop']}
                aria-label={'Close'}
                onClick={requestClose}
            />
            <div
                ref={containerRef}
                className={classNames(styles['container'], { [styles['dragging']]: dragging })}
                style={containerStyle}
                role={'dialog'}
                aria-modal={'true'}
                aria-label={title}
                onTransitionEnd={onTransitionEnd}
            >
                <div
                    className={styles['handle']}
                    onTouchStart={onTouchStart}
                    onTouchMove={onTouchMove}
                    onTouchEnd={onTouchEnd}
                />
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
        </div>
    ), document.body);
};

export default BottomSheet;
