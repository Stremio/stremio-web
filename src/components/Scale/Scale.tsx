import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';
import Button from 'stremio/components/Button';
import styles from './Scale.less';

type Props = {
    min: number,
    max: number,
    step: number,
    value: number,
    options: number[],
    tabIndex?: number,
    onChange: (value: number) => void,
};

const onKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    // Keep arrow keys on the range instead of spatial navigation.
    if (event.key.startsWith('Arrow')) event.stopPropagation();
};

const getTickIndex = (key: string, index: number, count: number) => {
    switch (key) {
        case 'ArrowRight':
        case 'ArrowUp':
            return Math.min(count - 1, index + 1);
        case 'ArrowLeft':
        case 'ArrowDown':
            return Math.max(0, index - 1);
        case 'Home':
            return 0;
        case 'End':
            return count - 1;
        default:
            return null;
    }
};

const Scale = ({ min, max, step, options, value, tabIndex, onChange }: Props) => {
    const { t } = useTranslation();
    const [preview, setPreview] = useState(value);
    const inputRef = useRef<HTMLInputElement>(null);
    const ticksRef = useRef<HTMLDivElement>(null);
    const dragging = useRef<number | null>(null);

    const onTickClick = useCallback((event: React.MouseEvent<HTMLDivElement>) => {
        onChange(Number(event.currentTarget.dataset.value));
    }, [onChange]);

    const onTicksKeyDown = useCallback((event: React.KeyboardEvent<HTMLDivElement>) => {
        const next = getTickIndex(event.key, options.indexOf(preview), options.length);
        if (next === null) return;
        event.preventDefault();
        event.stopPropagation();
        onChange(options[next]);
        (ticksRef.current?.children[next] as HTMLElement | undefined)?.focus();
    }, [options, preview, onChange]);

    const onPointerDown = useCallback((event: React.PointerEvent<HTMLInputElement>) => {
        if (event.isPrimary && event.button === 0) dragging.current = event.pointerId;
    }, []);

    const onInputChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        const next = event.currentTarget.valueAsNumber;
        setPreview(next);
        // Zooming during a drag moves the slider underneath the pointer.
        if (dragging.current === null) onChange(next);
    }, [onChange]);

    useEffect(() => {
        setPreview(value);
    }, [value]);

    useEffect(() => {
        const finishDrag = (event: PointerEvent) => {
            if (dragging.current !== event.pointerId || !inputRef.current) return;
            dragging.current = null;
            onChange(inputRef.current.valueAsNumber);
        };
        const cancelDrag = () => {
            if (dragging.current === null) return;
            dragging.current = null;
            setPreview(value);
        };

        // Let the native range own pointer capture; taking it breaks WebKit dragging.
        document.addEventListener('pointerup', finishDrag, true);
        document.addEventListener('pointercancel', cancelDrag, true);
        window.addEventListener('blur', cancelDrag);
        return () => {
            document.removeEventListener('pointerup', finishDrag, true);
            document.removeEventListener('pointercancel', cancelDrag, true);
            window.removeEventListener('blur', cancelDrag);
        };
    }, [value, onChange]);

    return (
        <div className={styles['scale']}>
            <div
                ref={ticksRef}
                className={styles['ticks']}
                style={{ gridTemplateColumns: `repeat(${options.length}, 1fr)` }}
                role={'radiogroup'}
                aria-label={t('SETTINGS_UI_ZOOM')}
                onKeyDown={onTicksKeyDown}
            >
                {
                    options.map((tick) => (
                        <Button
                            key={tick}
                            className={classNames(styles['label'], { [styles['active']]: preview === tick })}
                            data-value={tick}
                            role={'radio'}
                            aria-checked={preview === tick}
                            tabIndex={preview === tick ? 0 : -1}
                            onClick={onTickClick}
                        >
                            {tick}%
                        </Button>
                    ))
                }
            </div>
            <input
                ref={inputRef}
                type={'range'}
                tabIndex={tabIndex}
                aria-label={t('SETTINGS_UI_ZOOM')}
                aria-valuetext={`${preview}%`}
                value={preview}
                min={min}
                max={max}
                step={step}
                onKeyDown={onKeyDown}
                onPointerDown={onPointerDown}
                onChange={onInputChange}
            />
        </div>
    );
};

export default Scale;
