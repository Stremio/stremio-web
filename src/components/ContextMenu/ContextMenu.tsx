import React, { memo, RefObject, useCallback, useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import styles from './ContextMenu.less';

type Coordinates = [number, number];
type Size = [number, number];

type Props = {
    children: React.ReactNode,
    on: RefObject<HTMLElement>[],
    autoClose: boolean,
    padding?: number;
};

const ContextMenu = ({ children, on, autoClose, padding = 8 }: Props) => {
    const [active, setActive] = useState(false);
    const [position, setPosition] = useState<Coordinates>([0, 0]);
    const [containerSize, setContainerSize] = useState<Size>([0, 0]);

    const ref = useCallback((element: HTMLDivElement) => {
        element && setContainerSize([element.offsetWidth, element.offsetHeight]);
    }, []);

    const style = useMemo(() => {
        const [viewportWidth, viewportHeight] = [window.innerWidth, window.innerHeight];
        const [containerWidth, containerHeight] = containerSize;
        const [x, y] = position;

        const left = Math.max(
            padding,
            Math.min(
                x + containerWidth > viewportWidth - padding ? x - containerWidth : x,
                viewportWidth - containerWidth - padding
            )
        );

        const top = Math.max(
            padding,
            Math.min(
                y + containerHeight > viewportHeight - padding ? y - containerHeight : y,
                viewportHeight - containerHeight - padding
            )
        );

        return { top, left };
    }, [position, containerSize, padding]);

    const close = () => {
        setPosition([0, 0]);
        setActive(false);
    };

    const handleKeyDown = useCallback((event: KeyboardEvent) => {
        if (event.key === 'Escape') {
            close();
        }
    }, [close]);

    const stopPropagation = (event: React.MouseEvent | React.TouchEvent) => {
        event.stopPropagation();
    };

    const onContextMenu = (event: MouseEvent) => {
        event.preventDefault();

        setPosition([event.clientX, event.clientY]);
        setActive(true);
    };

    const onClick = useCallback(() => {
        autoClose && close();
    }, [autoClose]);

    useEffect(() => {
        on.forEach((ref) => ref.current && ref.current.addEventListener('contextmenu', onContextMenu));
        document.addEventListener('keydown', handleKeyDown);

        return () => {
            on.forEach((ref) => ref.current && ref.current.removeEventListener('contextmenu', onContextMenu));
            document.removeEventListener('keydown', handleKeyDown);
        }
    }, [on]);

    return active && createPortal((
        <div
            className={styles['context-menu-container']}
            onMouseDown={close}
            onTouchStart={close}
        >
            <div
                ref={ref}
                className={styles['context-menu']}
                style={style}
                onMouseDown={stopPropagation}
                onTouchStart={stopPropagation}
                onClick={onClick}
                tabIndex={-1}
            >
                {children}
            </div>
        </div>
    ), document.body);
};

export default memo(ContextMenu);
