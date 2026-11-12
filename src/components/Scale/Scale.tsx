import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';
import Button from 'stremio/components/Button';
import styles from './Scale.less';

type Props = {
    value: number,
    options: number[],
    onChange: (value: number) => void,
};

const getTickIndex = (key: string, index: number, count: number) => {
    switch (key) {
        case 'ArrowRight':
            return Math.min(count - 1, index + 1);
        case 'ArrowLeft':
            return Math.max(0, index - 1);
        case 'Home':
            return 0;
        case 'End':
            return count - 1;
        default:
            return null;
    }
};

const Scale = ({ options, value, onChange }: Props) => {
    const { t } = useTranslation();
    const [preview, setPreview] = useState(value);
    const groupRef = useRef<HTMLDivElement>(null);
    const dragging = useRef<number | null>(null);

    const commit = useCallback((next: number) => {
        if (next !== value) onChange(next);
    }, [value, onChange]);

    const focusStop = useCallback((index: number) => {
        groupRef.current?.querySelectorAll<HTMLElement>('[role="radio"]')[index]?.focus({ preventScroll: true, focusVisible: false });
    }, []);

    const getPointerIndex = useCallback((event: React.PointerEvent<HTMLDivElement>) => {
        const group = event.currentTarget;
        let x = event.nativeEvent.offsetX;
        for (let node = event.target as HTMLElement | null; node && node !== group; node = node.offsetParent as HTMLElement | null) {
            x += node.offsetLeft;
        }
        const index = Math.floor(x / group.clientWidth * options.length);
        return Math.min(options.length - 1, Math.max(0, index));
    }, [options]);

    const onTickClick = useCallback((event: React.MouseEvent<HTMLDivElement>) => {
        commit(Number(event.currentTarget.dataset.value));
    }, [commit]);

    const onKeyDown = useCallback((event: React.KeyboardEvent<HTMLDivElement>) => {
        const focused = event.target instanceof HTMLElement && event.target.dataset.value ? Number(event.target.dataset.value) : preview;
        if (event.key === ' ') {
            event.preventDefault();
            commit(focused);
            return;
        }
        const next = getTickIndex(event.key, options.indexOf(focused), options.length);
        if (next === null) return;
        event.preventDefault();
        event.stopPropagation();
        commit(options[next]);
        groupRef.current?.querySelectorAll<HTMLElement>('[role="radio"]')[next]?.focus();
    }, [options, preview, commit]);

    const onPointerDown = useCallback((event: React.PointerEvent<HTMLDivElement>) => {
        if (!event.isPrimary || event.button !== 0) return;
        dragging.current = event.pointerId;
        event.currentTarget.setPointerCapture(event.pointerId);
        setPreview(options[getPointerIndex(event)]);
    }, [options, getPointerIndex]);

    const onPointerMove = useCallback((event: React.PointerEvent<HTMLDivElement>) => {
        if (dragging.current !== event.pointerId) return;
        setPreview(options[getPointerIndex(event)]);
    }, [options, getPointerIndex]);

    const onPointerUp = useCallback((event: React.PointerEvent<HTMLDivElement>) => {
        if (dragging.current !== event.pointerId) return;
        dragging.current = null;
        const index = getPointerIndex(event);
        setPreview(options[index]);
        focusStop(index);
        commit(options[index]);
    }, [options, getPointerIndex, focusStop, commit]);

    const onPointerCancel = useCallback(() => {
        if (dragging.current === null) return;
        dragging.current = null;
        setPreview(value);
    }, [value]);

    useEffect(() => {
        setPreview(value);
    }, [value]);

    return (
        <div
            ref={groupRef}
            className={styles['scale']}
            style={{ '--count': options.length, '--index': options.indexOf(preview) } as React.CSSProperties}
            role={'radiogroup'}
            aria-label={t('SETTINGS_UI_ZOOM')}
            onKeyDown={onKeyDown}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerCancel={onPointerCancel}
            onLostPointerCapture={onPointerCancel}
        >
            {
                options.map((option) => (
                    <Button
                        key={option}
                        className={classNames(styles['stop'], { [styles['active']]: preview === option })}
                        data-value={option}
                        role={'radio'}
                        aria-checked={preview === option}
                        tabIndex={preview === option ? 0 : -1}
                        onClick={onTickClick}
                    >
                        <span className={styles['label']}>{option}%</span>
                    </Button>
                ))
            }
            <div className={styles['track']} aria-hidden={true}>
                <div className={styles['fill']} />
                <div className={styles['dots']}>
                    {options.map((option) => <div key={option} className={styles['dot']} />)}
                </div>
                <div className={styles['thumb']} />
            </div>
        </div>
    );
};

export default Scale;
