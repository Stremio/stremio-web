// Copyright (C) 2017-2024 Smart code 203358507

import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';
import { Modal, useModalsContainer } from 'stremio-router';
import useRouteFocused from 'stremio/common/useRouteFocused';
import useOrientation from 'stremio/common/useOrientation';
import useSheetDrag from './useSheetDrag';
import styles from './BottomSheet.less';

const ANIMATION_DURATION = Number.parseInt(styles.animationDurationMs, 10) || 250;

type Phase = 'idle' | 'entering' | 'entered' | 'exiting';

type Props = {
    children: React.ReactNode,
    className?: string,
    title?: string,
    ariaLabel?: string,
    show: boolean,
    onCloseRequest: () => void,
    closeOnContentClick?: boolean,
    closeOnOrientationChange?: boolean,
    flush?: boolean,
};

const BottomSheet = ({ children, className, title, ariaLabel, show, onCloseRequest, closeOnContentClick = true, closeOnOrientationChange = true, flush = false }: Props) => {
    const { t } = useTranslation();
    const routeFocused = useRouteFocused();
    const modalsContainer = useModalsContainer();
    const modalRef = useRef<HTMLElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const onCloseRequestRef = useRef(onCloseRequest);
    const phaseRef = useRef<Phase>('idle');
    const orientation = useOrientation();
    const previousOrientationRef = useRef(orientation);
    const [phase, setPhase] = useState<Phase>('idle');

    useLayoutEffect(() => {
        onCloseRequestRef.current = onCloseRequest;
    }, [onCloseRequest]);

    const setPhaseState = useCallback((next: Phase) => {
        phaseRef.current = next;
        setPhase(next);
    }, []);

    const labelledBy = typeof title === 'string' && title.length > 0 ? title : ariaLabel;
    const open = phase === 'entered';
    const mounted = phase !== 'idle';

    const requestClose = useCallback(() => {
        if (phaseRef.current === 'idle' || phaseRef.current === 'exiting') {
            return;
        }

        onCloseRequestRef.current();
    }, []);

    const isExiting = useCallback(() => phaseRef.current === 'exiting', []);
    const { offset, dragging, reset: resetDrag } = useSheetDrag({ containerRef, enabled: mounted, isExiting, onDismiss: requestClose });

    useEffect(() => {
        if (show) {
            resetDrag();
            setPhaseState('entering');
            return undefined;
        }

        if (phaseRef.current === 'idle') {
            return undefined;
        }

        resetDrag();
        setPhaseState('exiting');
        return undefined;
    }, [show, setPhaseState, resetDrag]);

    useEffect(() => {
        if (phase !== 'entering') {
            return undefined;
        }

        const node = containerRef.current;
        if (node !== null) {
            node.getBoundingClientRect();
        }

        const frame = requestAnimationFrame(() => {
            if (phaseRef.current === 'entering') {
                setPhaseState('entered');
            }
        });

        return () => window.cancelAnimationFrame(frame);
    }, [phase, setPhaseState]);

    useEffect(() => {
        if (phase !== 'exiting') {
            return undefined;
        }

        const timeout = window.setTimeout(() => {
            setPhaseState('idle');
            resetDrag();
        }, ANIMATION_DURATION);

        return () => window.clearTimeout(timeout);
    }, [phase, setPhaseState, resetDrag]);

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

        if (previousOrientationRef.current !== orientation && phaseRef.current !== 'idle') {
            requestClose();
        }

        previousOrientationRef.current = orientation;
        return undefined;
    }, [orientation, closeOnOrientationChange, requestClose]);

    if (phase === 'idle') {
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
                style={{ transform: open ? `translateY(${offset}px)` : 'translateY(100%)' }}
                role={'dialog'}
                aria-modal={'true'}
                aria-label={labelledBy}
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
                <div className={styles['content']} onClick={closeOnContentClick ? requestClose : undefined}>
                    {children}
                </div>
            </div>
        </Modal>
    );
};

export default BottomSheet;
