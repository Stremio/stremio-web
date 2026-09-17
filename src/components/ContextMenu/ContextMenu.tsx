import React, { memo, RefObject, useCallback, useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import { getInterfaceRect, getInterfaceScale } from 'stremio/common/interfaceScale';
import Transition from '../Transition';
import styles from './ContextMenu.less';

const PADDING = 8;

type Coordinates = [number, number];
type Size = [number, number];
type Lock = 'top' | 'right' | 'bottom' | 'left';

type Props = {
    children: React.ReactNode,
    on: RefObject<HTMLElement>[],
    autoClose: boolean,
    lock?: Lock,
};

const ContextMenu = ({ children, on, autoClose, lock }: Props) => {
    const [active, setActive] = useState(false);
    const [position, setPosition] = useState<Coordinates>([0, 0]);
    const [containerSize, setContainerSize] = useState<Size>([0, 0]);
    const [triggerRect, setTriggerRect] = useState<DOMRect | null>(null);

    const ref = useCallback((element: HTMLDivElement) => {
        element && setContainerSize([element.offsetWidth, element.offsetHeight]);
    }, []);

    const style = useMemo(() => {
        const scale = getInterfaceScale();
        const [viewportWidth, viewportHeight] = [window.innerWidth / scale, window.innerHeight / scale];
        const [containerWidth, containerHeight] = containerSize;

        let x: number;
        let y: number;

        if (lock && triggerRect) {
            switch (lock) {
                case 'top':
                    x = triggerRect.left;
                    y = triggerRect.top - containerHeight;
                    break;
                case 'bottom':
                    x = triggerRect.left;
                    y = triggerRect.bottom;
                    break;
                case 'left':
                    x = triggerRect.left - containerWidth;
                    y = triggerRect.top;
                    break;
                case 'right':
                    x = triggerRect.right;
                    y = triggerRect.top;
                    break;
            }
        } else {
            [x, y] = position;
        }

        const left = Math.max(
            PADDING,
            Math.min(
                x + containerWidth > viewportWidth - PADDING ? x - containerWidth : x,
                viewportWidth - containerWidth - PADDING
            )
        );

        const top = Math.max(
            PADDING,
            Math.min(
                y + containerHeight > viewportHeight - PADDING ? y - containerHeight : y,
                viewportHeight - containerHeight - PADDING
            )
        );

        return { top, left };
    }, [position, containerSize, lock, triggerRect]);

    const close = useCallback(() => {
        setActive(false);
    }, []);

    const stopPropagation = useCallback((event: React.MouseEvent | React.TouchEvent) => {
        event.stopPropagation();
    }, []);

    const onContextMenu = useCallback((event: MouseEvent) => {
        if (event.shiftKey) return;

        event.preventDefault();

        if (lock) {
            const target = event.currentTarget as HTMLElement;
            setTriggerRect(getInterfaceRect(target));
        } else {
            setPosition([event.clientX / getInterfaceScale(), event.clientY / getInterfaceScale()]);
        }
        setActive(true);
    }, [lock]);

    const containerOnMouseDown = useCallback((event: React.MouseEvent) => {
        if (event.button !== 2 && !event.ctrlKey) close();
    }, [close]);

    const containerOnContextMenu = useCallback((event: React.MouseEvent) => {
        if (event.shiftKey) return;

        event.preventDefault();
        if (!lock && event.target === event.currentTarget) {
            setPosition([event.clientX / getInterfaceScale(), event.clientY / getInterfaceScale()]);
        }
    }, [lock]);

    const handleKeyDown = useCallback((event: KeyboardEvent) => event.key === 'Escape' && close(), [close]);

    const onClick = useCallback((event: React.MouseEvent) => {
        event.stopPropagation();
        autoClose && close();
    }, [autoClose, close]);

    useEffect(() => {
        on.forEach((ref) => ref.current && ref.current.addEventListener('contextmenu', onContextMenu));
        document.addEventListener('keydown', handleKeyDown);
        window.addEventListener('resize', close);

        return () => {
            on.forEach((ref) => ref.current && ref.current.removeEventListener('contextmenu', onContextMenu));
            document.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('resize', close);
        };
    }, [on, onContextMenu, handleKeyDown, close]);

    return createPortal((
        <Transition when={active} name={'fade'}>
            <div
                className={styles['context-menu-container']}
                onMouseDown={containerOnMouseDown}
                onContextMenu={containerOnContextMenu}
                onTouchStart={close}
            >
                <div
                    ref={ref}
                    className={styles['context-menu']}
                    style={style}
                    onMouseDown={stopPropagation}
                    onTouchStart={stopPropagation}
                    onClick={onClick}
                >
                    {children}
                </div>
            </div>
        </Transition>
    ), document.body);
};

export default memo(ContextMenu);
