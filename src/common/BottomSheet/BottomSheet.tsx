// Copyright (C) 2017-2024 Smart code 203358507

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import classNames from 'classnames';
import useBinaryState from 'stremio/common/useBinaryState';
import styles from './BottomSheet.less';

const CLOSE_THRESHOLD = 100;

type Props = {
    children: JSX.Element,
    title: string,
    show?: boolean,
    onClose: () => void,
};

const BottomSheet = ({ children, title, show }: Props) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [startOffset, setStartOffset] = useState(0);
    const [offset, setOffset] = useState(0);

    const [opened, open, close] = useBinaryState();

    const containerStyle = useMemo(() => ({
        transform: `translateY(${offset}px)`
    }), [offset]);

    const containerHeight = () => containerRef.current?.offsetHeight ?? 0;

    const onClose = () => setOffset(containerHeight());

    const onTouchStart = ({ touches }: React.TouchEvent<HTMLDivElement>) => {
        const { clientY } = touches[0];
        setStartOffset(clientY);
    };

    const onTouchMove = useCallback(({ touches }: React.TouchEvent<HTMLDivElement>) => {
        const { clientY } = touches[0];
        setOffset(Math.max(0, clientY - startOffset));
    }, [startOffset]);

    const onTouchEnd = useCallback(() => {
        setOffset((offset) => offset > CLOSE_THRESHOLD ? containerHeight() : 0);
        setStartOffset(0);
    }, []);

    const onTransitionEnd = useCallback(() => {
        (offset === containerHeight()) && close();
    }, [offset]);

    useEffect(() => {
        setOffset(0);
        show ? open() : close();
    }, [show]);

    return opened && createPortal((
        <div className={styles['bottom-sheet']}>
            <div className={styles['backdrop']} onClick={onClose} />
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
                <div className={styles['content']} onClick={onClose}>
                    {children}
                </div>
            </div>
        </div>
    ), document.body);
};

export default BottomSheet;
