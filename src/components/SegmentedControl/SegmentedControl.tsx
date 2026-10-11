// Copyright (C) 2017-2026 Smart code 203358507

import React, { useCallback, useLayoutEffect, useRef, useState } from 'react';
import classNames from 'classnames';
import Icon from '@stremio/stremio-icons/react';
import Button from 'stremio/components/Button';
import styles from './SegmentedControl.less';

type Option = {
    value: string,
    label: string,
    icon?: string,
    count?: number,
};

type Props = {
    className?: string,
    options: Option[],
    value: string | null,
    ariaLabel: string,
    size?: 'medium' | 'large',
    stretch?: boolean,
    onSelect: (value: string) => void,
};

const SegmentedControl = ({ className, options, value, ariaLabel, size = 'medium', stretch = false, onSelect }: Props) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const trackRef = useRef<HTMLDivElement>(null);
    const indicatorRef = useRef<HTMLDivElement>(null);
    const placedValueRef = useRef<string | null>(null);
    const [scrollable, setScrollable] = useState(false);

    const onClick = useCallback((event: React.MouseEvent<HTMLDivElement>) => {
        const { value } = event.currentTarget.dataset;
        if (typeof value === 'string') {
            onSelect(value);
        }
    }, [onSelect]);

    const place = useCallback((animate: boolean) => {
        const container = containerRef.current;
        const track = trackRef.current;
        const indicator = indicatorRef.current;
        if (!container || !track || !indicator) {
            return;
        }

        const option = track.querySelector<HTMLElement>('[aria-selected="true"]');
        if (!option) {
            indicator.style.visibility = 'hidden';
            return;
        }

        indicator.style.transition = animate ? '' : 'none';
        indicator.style.visibility = 'visible';
        indicator.style.width = `${option.offsetWidth}px`;
        indicator.style.left = `${option.offsetLeft}px`;
        if (!animate) {
            indicator.getBoundingClientRect();
            indicator.style.transition = '';
        }

        const nextValue = option.dataset.value ?? null;
        if (placedValueRef.current !== nextValue) {
            placedValueRef.current = nextValue;
            container.scrollTo({
                left: Math.max(0, option.offsetLeft - (container.clientWidth - option.offsetWidth) / 2),
                behavior: animate ? 'smooth' : 'auto',
            });
        }
    }, []);

    useLayoutEffect(() => {
        place(placedValueRef.current !== null);
    }, [options, value, place]);

    useLayoutEffect(() => {
        const container = containerRef.current;
        const track = trackRef.current;
        if (!container || !track) {
            return;
        }

        let width = track.offsetWidth;
        const observer = new ResizeObserver(() => {
            setScrollable(container.scrollWidth > container.clientWidth + 1);
            if (track.offsetWidth !== width) {
                width = track.offsetWidth;
                place(false);
            }
        });
        observer.observe(container);
        observer.observe(track);
        return () => observer.disconnect();
    }, [place]);

    return (
        <div
            ref={containerRef}
            className={classNames(className, styles['segmented-control'], styles[size], { [styles['stretch']]: stretch, [styles['scrollable']]: scrollable })}
            role={'tablist'}
            aria-label={ariaLabel}
        >
            <div ref={trackRef} className={styles['track']}>
                <div ref={indicatorRef} className={styles['indicator']} aria-hidden={'true'} />
                {
                    options.map((option) => (
                        <Button
                            key={option.value}
                            className={classNames(styles['option'], { [styles['selected']]: option.value === value })}
                            role={'tab'}
                            aria-selected={option.value === value}
                            data-value={option.value}
                            title={option.label}
                            onClick={onClick}
                        >
                            {
                                typeof option.icon === 'string' ?
                                    <Icon className={styles['icon']} name={option.icon} />
                                    :
                                    null
                            }
                            <div className={styles['label']}>{option.label}</div>
                            {
                                typeof option.count === 'number' ?
                                    <div className={styles['count']}>{option.count}</div>
                                    :
                                    null
                            }
                        </Button>
                    ))
                }
            </div>
        </div>
    );
};

export default SegmentedControl;
