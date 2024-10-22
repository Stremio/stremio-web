// Copyright (C) 2017-2024 Smart code 203358507

import React, { useRef, useEffect, useState } from 'react';
import classNames from 'classnames';
import styles from './HorizontalScroll.less';

const SCROLL_THRESHOLD = 1;

type Props = {
    className: string,
    children: React.ReactNode,
};

const HorizontalScroll = ({ className, children }: Props) => {
    const ref = useRef<HTMLDivElement>(null);
    const [scrollPosition, setScrollPosition] = useState('left');

    useEffect(() => {
        const onScroll = ({ target }: Event) => {
            const { scrollLeft, scrollWidth, offsetWidth } = target as HTMLDivElement;

            setScrollPosition(() => (
                (scrollLeft - SCROLL_THRESHOLD) <= 0 ? 'left' :
                    (scrollLeft + offsetWidth + SCROLL_THRESHOLD) >= scrollWidth ? 'right' :
                        'center'
            ));
        };

        ref.current?.addEventListener('scroll', onScroll);
        return () => ref.current?.removeEventListener('scroll', onScroll);
    }, []);

    return (
        <div ref={ref} className={classNames(styles['horizontal-scroll'], className, [styles[scrollPosition]])}>
            {children}
        </div>
    );
};

export default HorizontalScroll;
