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

    const interval = useInterval(100);
    const timeout = useTimeout(250);

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
    }, [onChange]);

    const onDecrementMouseDown = useCallback(() => {
        cancel();
        timeout.start(() => interval.start(() => updateValue(-step)));
    }, [updateValue]);

    const onDecrementMouseUp = useCallback(() => {
        cancel();
        updateValue(-step);
    }, [updateValue]);

    const onIncrementMouseDown = useCallback(() => {
        cancel();
        timeout.start(() => interval.start(() => updateValue(step)));
    }, [updateValue]);

    const onIncrementMouseUp = useCallback(() => {
        cancel();
        updateValue(step);
    }, [updateValue]);

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
