import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';
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

const Scale = ({ min, max, step, options, value, tabIndex, onChange }: Props) => {
    const { t } = useTranslation();
    const [preview, setPreview] = useState(value);
    const inputRef = useRef<HTMLInputElement>(null);
    const dragging = useRef<number | null>(null);

    const onTickClick = useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
        onChange(Number(event.currentTarget.value));
    }, [onChange]);

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
            <div className={styles['ticks']} style={{ gridTemplateColumns: `repeat(${options.length}, 1fr)` }}>
                {
                    options.map((tick) => (
                        <button
                            type={'button'}
                            value={tick}
                            className={classNames(styles['label'], { [styles['active']]: preview === tick })}
                            key={tick}
                            aria-pressed={preview === tick}
                            onClick={onTickClick}
                        >
                            {tick}%
                        </button>
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
