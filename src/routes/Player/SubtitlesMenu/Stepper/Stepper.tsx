import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';
import Icon from '@stremio/stremio-icons/react';
import { Button } from 'stremio/components';
import { useInterval, useTimeout } from 'stremio/common';
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
    onChange: (value: number) => void,
};

const Stepper = ({ className, label, value, unit, step, min, max, disabled, onChange }: Props) => {
    const { t } = useTranslation();

    const localValue = useRef(value);
    const repeatActive = useRef(false);
    const repeated = useRef(false);

    const interval = useInterval(100);
    const timeout = useTimeout(250);

    const cancel = useCallback(() => {
        interval.cancel();
        timeout.cancel();
        repeatActive.current = false;
        repeated.current = false;
    }, [interval, timeout]);

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
        const newValue = clamp(localValue.current + delta, min, max);

        if (newValue !== localValue.current) {
            onChange(newValue);
        }
    }, [max, min, onChange]);

    const startRepeat = useCallback((delta: number) => {
        if (repeatActive.current) {
            return;
        }

        cancel();
        repeatActive.current = true;
        timeout.start(() => {
            repeated.current = true;
            updateValue(delta);
            interval.start(() => updateValue(delta));
        });
    }, [cancel, interval, timeout, updateValue]);

    const stopRepeat = useCallback((delta: number) => {
        const hasRepeated = repeated.current;

        cancel();

        if (!hasRepeated) {
            updateValue(delta);
        }
    }, [cancel, updateValue]);

    const onDecrementMouseDown = useCallback(() => {
        if (!decreaseDisabled) {
            startRepeat(-step);
        }
    }, [decreaseDisabled, startRepeat, step]);

    const onDecrementMouseUp = useCallback(() => {
        if (!decreaseDisabled) {
            stopRepeat(-step);
        }
    }, [decreaseDisabled, stopRepeat, step]);

    const onDecrementKeyDown = useCallback((event: React.KeyboardEvent) => {
        if (!decreaseDisabled && (event.key === 'Enter' || event.key === ' ')) {
            event.preventDefault();
            if (!event.repeat) {
                startRepeat(-step);
            }
        }
    }, [decreaseDisabled, startRepeat, step]);

    const onDecrementKeyUp = useCallback((event: React.KeyboardEvent) => {
        if (!decreaseDisabled && (event.key === 'Enter' || event.key === ' ')) {
            event.preventDefault();
            stopRepeat(-step);
        }
    }, [decreaseDisabled, stopRepeat, step]);

    const onIncrementMouseDown = useCallback(() => {
        if (!increaseDisabled) {
            startRepeat(step);
        }
    }, [increaseDisabled, startRepeat, step]);

    const onIncrementMouseUp = useCallback(() => {
        if (!increaseDisabled) {
            stopRepeat(step);
        }
    }, [increaseDisabled, stopRepeat, step]);

    const onIncrementKeyDown = useCallback((event: React.KeyboardEvent) => {
        if (!increaseDisabled && (event.key === 'Enter' || event.key === ' ')) {
            event.preventDefault();
            if (!event.repeat) {
                startRepeat(step);
            }
        }
    }, [increaseDisabled, startRepeat, step]);

    const onIncrementKeyUp = useCallback((event: React.KeyboardEvent) => {
        if (!increaseDisabled && (event.key === 'Enter' || event.key === ' ')) {
            event.preventDefault();
            stopRepeat(step);
        }
    }, [increaseDisabled, stopRepeat, step]);

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
                    onKeyDown={onDecrementKeyDown}
                    onKeyUp={onDecrementKeyUp}
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
                    onKeyDown={onIncrementKeyDown}
                    onKeyUp={onIncrementKeyUp}
                >
                    <Icon className={styles['icon']} name={'add'} />
                </Button>
            </div>
        </div>
    );
};

export default Stepper;
