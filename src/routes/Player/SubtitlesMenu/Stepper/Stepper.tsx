import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';
import Icon from '@stremio/stremio-icons/react';
import { Button } from 'stremio/components';
import { useInterval, useTimeout } from 'stremio/common';
import {
    getSubtitleDelayStepMultiplier,
    SUBTITLES_DELAY_REPEAT_DELAY_MS,
    SUBTITLES_DELAY_REPEAT_INTERVAL_MS,
} from '../../subtitleDelay';
import styles from './Stepper.less';

const clamp = (value: number, min?: number, max?: number) => {
    const minClamped = typeof min === 'number' ? Math.max(value, min) : value;
    const maxClamped = typeof max === 'number' ? Math.min(minClamped, max) : minClamped;
    return maxClamped;
};

type Props = {
    className: string,
    label: string,
    value: number,
    unit?: string,
    step: number,
    min?: number,
    max?: number,
    disabled?: boolean,
    accelerate?: boolean,
    onChange: (value: number) => void,
};

const Stepper = ({ className, label, value, unit, step, min, max, disabled, accelerate = false, onChange }: Props) => {
    const { t } = useTranslation();

    const localValue = useRef(value);
    const holdStartedAt = useRef(0);
    const hasRepeated = useRef(false);

    const interval = useInterval(SUBTITLES_DELAY_REPEAT_INTERVAL_MS);
    const timeout = useTimeout(SUBTITLES_DELAY_REPEAT_DELAY_MS);

    const cancel = () => {
        interval.cancel();
        timeout.cancel();
    };

    const decreaseDisabled = useMemo(() => {
        return disabled || typeof value !== 'number' || (typeof min === 'number' && value <= min);
    }, [disabled, min, value]);

    const increaseDisabled = useMemo(() => {
        return disabled || typeof value !== 'number' || (typeof max === 'number' && value >= max);
    }, [disabled, max, value]);

    const valueLabel = useMemo(() => {
        return (disabled || typeof value !== 'number') ? '--' : `${value}${unit}`;
    }, [disabled, value, unit]);

    const updateValue = useCallback((delta: number) => {
        onChange(clamp(localValue.current + delta, min, max));
    }, [max, min, onChange]);

    const startRepeating = useCallback((direction: number) => {
        cancel();
        holdStartedAt.current = performance.now();
        hasRepeated.current = false;
        let repeatValue = localValue.current;

        timeout.start(() => interval.start(() => {
            if (!accelerate) {
                updateValue(direction * step);
                return;
            }

            hasRepeated.current = true;
            const heldFor = performance.now() - holdStartedAt.current;
            const multiplier = getSubtitleDelayStepMultiplier(heldFor);
            repeatValue = clamp(repeatValue + direction * step * multiplier, min, max);
            onChange(repeatValue);
        }));
    }, [accelerate, max, min, onChange, step, updateValue]);

    const onDecrementMouseDown = useCallback(() => {
        startRepeating(-1);
    }, [startRepeating]);

    const onDecrementMouseUp = useCallback(() => {
        cancel();
        if (!accelerate || !hasRepeated.current) updateValue(-step);
    }, [accelerate, step, updateValue]);

    const onIncrementMouseDown = useCallback(() => {
        startRepeating(1);
    }, [startRepeating]);

    const onIncrementMouseUp = useCallback(() => {
        cancel();
        if (!accelerate || !hasRepeated.current) updateValue(step);
    }, [accelerate, step, updateValue]);

    useEffect(() => {
        localValue.current = value;
    }, [value]);

    return (
        <div className={classNames(styles['stepper'], className)}>
            <div className={styles['header']}>
                { t(label) }
            </div>
            <div className={styles['content']}>
                <Button
                    className={classNames(styles['button'], { 'disabled': decreaseDisabled })}
                    onMouseDown={onDecrementMouseDown}
                    onMouseUp={onDecrementMouseUp}
                    onMouseLeave={cancel}
                >
                    <Icon className={styles['icon']} name={'remove'} />
                </Button>
                <div className={styles['value']}>
                    { valueLabel }
                </div>
                <Button
                    className={classNames(styles['button'], { 'disabled': increaseDisabled })}
                    onMouseDown={onIncrementMouseDown}
                    onMouseUp={onIncrementMouseUp}
                    onMouseLeave={cancel}
                >
                    <Icon className={styles['icon']} name={'add'} />
                </Button>
            </div>
        </div>
    );
};

export default Stepper;
