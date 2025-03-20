import React, { RefObject, useCallback, useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import styles from './ContextMenu.less';

type Coordinates = [number, number];

type Props = {
    children: React.ReactNode,
    on: RefObject<HTMLElement>[],
    autoClose: boolean,
    padding?: number;
};

const ContextMenu = ({ children, on, autoClose, padding = 8 }: Props) => {
    const [active, setActive] = useState(false);
    const [position, setPosition] = useState<Coordinates>([0, 0]);
    const [containerSize, setContainerSize] = useState<Coordinates>([0, 0]);

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

    const onContextMenu = (event: MouseEvent) => {
        event.preventDefault();

        setPosition([event.clientX, event.clientY]);
        setActive(true);
    };

    const onClickOutside = () => {
        close();
    };

    const onClick = useCallback(() => {
        autoClose && close();
    }, [autoClose]);

    const onMouseDown = (event: React.MouseEvent) => {
        event.stopPropagation();
    };

    const onTouchStart = (event: React.TouchEvent) => {
        event.stopPropagation();
    };

    useEffect(() => {
        const containers = on.map((ref) => ref.current).filter((element) => !!element);
        containers.forEach((container) => container.addEventListener('contextmenu', onContextMenu));

        document.addEventListener('keydown', handleKeyDown);

        return () => {
            containers.forEach((container) => container.removeEventListener('contextmenu', onContextMenu));
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [on]);

    return active && createPortal((
        <div
            className={styles['context-menu-container']}
            onMouseDown={onClickOutside}
            onTouchStart={onClickOutside}
        >
            <div
                ref={ref}
                className={styles['context-menu']}
                style={style}
                onMouseDown={onMouseDown}
                onTouchStart={onTouchStart}
                onClick={onClick}
                tabIndex={-1}
            >
                {children}
            </div>
        </div>
    ), document.body);
};

export default ContextMenu;
