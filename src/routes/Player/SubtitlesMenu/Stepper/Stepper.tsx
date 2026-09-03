import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';
import Icon from '@stremio/stremio-icons/react';
import { Button } from 'stremio/components';
import { useTimeout } from 'stremio/common';
import {
    getAcceleratedInterval,
    getAcceleratedStep,
    SUBTITLES_DELAY_REPEAT_INTERVAL_MS,
} from '../../subtitleDelayAcceleration';
import { snapSubtitleDelay } from '../../subtitleDelay';
import styles from './Stepper.less';

const REPEAT_DELAY_MS = 350;

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
    repeatStep?: number,
    accelerate?: boolean,
    min?: number,
    max?: number,
    disabled?: boolean,
    onChange: (value: number) => void,
};

const Stepper = ({ className, label, value, unit, step, repeatStep = step, accelerate = false, min, max, disabled, onChange }: Props) => {
    const { t } = useTranslation();

    const localValue = useRef(value);
    const holdStartedAt = useRef(0);

    const timeout = useTimeout(REPEAT_DELAY_MS);

    const cancel = () => {
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
    }, [onChange]);

    const startRepeating = useCallback((direction: number) => {
        cancel();
        holdStartedAt.current = performance.now();
        let repeatValue = localValue.current;

        const repeat = () => {
            const heldFor = performance.now() - holdStartedAt.current;
            const delta = accelerate ? getAcceleratedStep(repeatStep, heldFor) : repeatStep;
            const interval = accelerate ?
                getAcceleratedInterval(SUBTITLES_DELAY_REPEAT_INTERVAL_MS, heldFor)
                :
                SUBTITLES_DELAY_REPEAT_INTERVAL_MS;
            repeatValue += direction * delta;
            const snappedValue = snapSubtitleDelay(
                Math.round(repeatValue * 1000),
                direction,
                Math.round(step * 1000),
            ) / 1000;
            onChange(clamp(snappedValue, min, max));
            timeout.start(repeat, interval);
        };

        timeout.start(repeat);
    }, [accelerate, max, min, onChange, repeatStep, step]);

    const onDecrementMouseDown = useCallback(() => {
        startRepeating(-1);
    }, [startRepeating]);

    const onDecrementMouseUp = useCallback(() => {
        cancel();
        updateValue(-step);
    }, [step, updateValue]);

    const onIncrementMouseDown = useCallback(() => {
        startRepeating(1);
    }, [startRepeating]);

    const onIncrementMouseUp = useCallback(() => {
        cancel();
        updateValue(step);
    }, [step, updateValue]);

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
