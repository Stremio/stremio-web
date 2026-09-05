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
    const dragging = useRef(false);

    const onTickClick = useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
        onChange(Number(event.currentTarget.value));
    }, [onChange]);

    const onPointerDown = useCallback((event: React.PointerEvent<HTMLInputElement>) => {
        dragging.current = true;
        event.currentTarget.setPointerCapture(event.pointerId);
    }, []);

    const onInputChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        const next = event.currentTarget.valueAsNumber;
        setPreview(next);
        // Zooming during a drag moves the slider underneath the pointer.
        if (!dragging.current) onChange(next);
    }, [onChange]);

    const onPointerUp = useCallback((event: React.PointerEvent<HTMLInputElement>) => {
        if (!dragging.current) return;
        dragging.current = false;
        onChange(event.currentTarget.valueAsNumber);
    }, [onChange]);

    useEffect(() => {
        setPreview(value);
    }, [value]);

    const cancelDrag = useCallback(() => {
        if (!dragging.current) return;
        dragging.current = false;
        setPreview(value);
    }, [value]);

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
                onPointerUp={onPointerUp}
                onPointerCancel={cancelDrag}
                onLostPointerCapture={cancelDrag}
            />
        </div>
    );
};

export default Scale;
