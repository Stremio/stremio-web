// Copyright (C) 2017-2024 Smart code 203358507

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import classNames from 'classnames';
import useOrientation from 'stremio/common/useOrientation';
import styles from './BottomSheet.less';

const CLOSE_THRESHOLD = 100;

type Props = {
    children: JSX.Element,
    title: string,
    show: boolean,
    onClose: () => void,
};

const BottomSheetContent = ({ children, title, onClose }: Omit<Props, 'show'>) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const orientation = useOrientation();
    const previousOrientationRef = useRef(orientation);
    const [startOffset, setStartOffset] = useState(0);
    const [offset, setOffset] = useState(0);

    const containerStyle = useMemo(() => ({
        transform: `translateY(${offset}px)`
    }), [offset]);

    const containerHeight = () => containerRef.current?.offsetHeight ?? 0;

    const onCloseRequest = () => setOffset(containerHeight());

    const onTouchStart = ({ touches }: React.TouchEvent<HTMLDivElement>) => {
        const { clientY } = touches[0];
        setStartOffset(clientY);
    };

    const onTouchMove = useCallback(({ touches }: React.TouchEvent<HTMLDivElement>) => {
        const { clientY } = touches[0];
        setOffset(Math.max(0, clientY - startOffset));
    }, [startOffset]);

    const onTouchEnd = () => {
        setOffset((offset) => offset > CLOSE_THRESHOLD ? containerHeight() : 0);
        setStartOffset(0);
    };

    const onTransitionEnd = useCallback((event: React.TransitionEvent<HTMLDivElement>) => {
        if (event.target === containerRef.current && event.propertyName === 'transform' && offset === containerHeight()) {
            onClose();
        }
    }, [offset, onClose]);

    useEffect(() => {
        if (previousOrientationRef.current !== orientation) {
            previousOrientationRef.current = orientation;
            onClose();
        }
    }, [orientation, onClose]);

    return createPortal((
        <div className={styles['bottom-sheet']}>
            <div className={styles['backdrop']} onClick={onCloseRequest} />
            <div
                ref={containerRef}
                className={classNames(styles['container'], { [styles['dragging']]: startOffset }, 'animation-slide-up')}
                style={containerStyle}
                onTouchStart={onTouchStart}
                onTouchMove={onTouchMove}
                onTouchEnd={onTouchEnd}
                onTransitionEnd={onTransitionEnd}
            >
                <div className={styles['heading']}>
                    <div className={styles['handle']} />
                    <div className={styles['title']}>
                        {title}
                    </div>
                </div>
                <div className={styles['content']} onClick={onCloseRequest}>
                    {children}
                </div>
            </div>
        </div>
    ), document.body);
};

const BottomSheet = ({ show, ...props }: Props) => show ? <BottomSheetContent {...props} /> : null;

export default BottomSheet;
