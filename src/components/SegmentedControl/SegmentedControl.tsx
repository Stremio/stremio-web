// Copyright (C) 2017-2026 Smart code 203358507

import React, { useCallback, useLayoutEffect, useRef } from 'react';
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
    onSelect: (value: string) => void,
};

const SegmentedControl = ({ className, options, value, ariaLabel, size = 'medium', onSelect }: Props) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const trackRef = useRef<HTMLDivElement>(null);
    const indicatorRef = useRef<HTMLDivElement>(null);
    const placedValueRef = useRef<string | null>(null);

    const onClick = useCallback((event: React.MouseEvent<HTMLDivElement>) => {
        const { value } = event.currentTarget.dataset;
        if (typeof value === 'string') {
            onSelect(value);
        }
    }, [onSelect]);

    useLayoutEffect(() => {
        const container = containerRef.current;
        const track = trackRef.current;
        const indicator = indicatorRef.current;
        if (!container || !track || !indicator) {
            return;
        }

        const place = (animate: boolean) => {
            const option = track.querySelector<HTMLElement>('[aria-selected="true"]');
            if (!option) {
                indicator.style.opacity = '0';
                return;
            }

            indicator.style.transition = animate ? '' : 'none';
            indicator.style.opacity = '1';
            indicator.style.width = `${option.offsetWidth}px`;
            indicator.style.transform = `translateX(${option.offsetLeft}px)`;
            if (!animate) {
                indicator.getBoundingClientRect();
                indicator.style.transition = '';
            }

            if (placedValueRef.current !== value) {
                placedValueRef.current = value;
                container.scrollTo({
                    left: Math.max(0, option.offsetLeft - (container.clientWidth - option.offsetWidth) / 2),
                    behavior: animate ? 'smooth' : 'auto',
                });
            }
        };

        place(placedValueRef.current !== null);
        const observer = new ResizeObserver(() => place(false));
        observer.observe(track);
        return () => observer.disconnect();
    }, [options, value]);

    return (
        <div ref={containerRef} className={classNames(className, styles['segmented-control'], styles[size])} role={'tablist'} aria-label={ariaLabel}>
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
