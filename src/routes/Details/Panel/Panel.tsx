// Copyright (C) 2017-2026 Smart code 203358507

import React, { useEffect, useRef, useState } from 'react';
import classNames from 'classnames';
import { getInterfaceRect } from 'stremio/common/interfaceScale';
import styles from './Panel.less';

type Props = {
    className?: string,
    ariaLabel: string,
    header?: React.ReactNode,
    resetKey?: string | number | null,
    children: React.ReactNode,
};

const getScrollParent = (element: HTMLElement | null): HTMLElement | null => {
    let parent = element?.parentElement ?? null;
    while (parent !== null && !['auto', 'scroll', 'overlay'].includes(window.getComputedStyle(parent).overflowY)) {
        parent = parent.parentElement;
    }

    return parent;
};

const getStickyOffset = (header: HTMLElement | null): number | null => {
    const style = header !== null ? window.getComputedStyle(header) : null;
    return style !== null && style.position === 'sticky' ?
        Math.abs(parseFloat(style.marginTop) || 0)
        :
        null;
};

const Panel = ({ className, ariaLabel, header, resetKey, children }: Props) => {
    const panelRef = useRef<HTMLDivElement>(null);
    const headerRef = useRef<HTMLDivElement>(null);
    const bodyRef = useRef<HTMLDivElement>(null);
    const sentinelRef = useRef<HTMLDivElement>(null);
    const [stuck, setStuck] = useState(false);

    useEffect(() => {
        const sentinel = sentinelRef.current;
        const stickyOffset = getStickyOffset(headerRef.current);
        if (!sentinel || stickyOffset === null) {
            return;
        }

        const observer = new IntersectionObserver(([entry]) => {
            setStuck(!entry.isIntersecting && entry.rootBounds !== null && entry.boundingClientRect.top < entry.rootBounds.top);
        }, {
            root: getScrollParent(sentinel),
            rootMargin: `-${Math.ceil(stickyOffset) + 5}px 0px 0px 0px`,
        });
        observer.observe(sentinel);
        return () => observer.disconnect();
    }, [header]);

    useEffect(() => {
        const panel = panelRef.current;
        const body = bodyRef.current;
        const stickyOffset = getStickyOffset(headerRef.current);
        if (!panel || !body) {
            return;
        }

        if (stickyOffset !== null) {
            const scrollParent = getScrollParent(panel);
            if (!scrollParent) {
                return;
            }

            const panelTop = getInterfaceRect(panel).top - getInterfaceRect(scrollParent).top + scrollParent.scrollTop - stickyOffset;
            if (scrollParent.scrollTop > panelTop) {
                scrollParent.scrollTop = panelTop;
            }
        } else {
            body.scrollTop = 0;
        }
    }, [resetKey]);

    return (
        <section ref={panelRef} className={classNames(className, styles['panel'])} aria-label={ariaLabel}>
            <div ref={sentinelRef} className={styles['sentinel']} aria-hidden={'true'} />
            {
                header !== undefined && header !== null ?
                    <div ref={headerRef} className={classNames(styles['header'], { [styles['stuck']]: stuck })}>
                        {header}
                    </div>
                    :
                    null
            }
            <div ref={bodyRef} className={styles['body']}>
                {children}
            </div>
        </section>
    );
};

export default Panel;
