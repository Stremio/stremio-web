import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
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

const formatNumber = (value: number | null) => {
    if (typeof value !== 'number') {
        return '';
    }

    return Number.isInteger(value) ?
        value.toString()
        :
        value.toFixed(3).replace(/\.?0+$/, '');
};

type Props = {
    className: string,
    label: string,
    value: number | null,
    unit?: string,
    step: number,
    min?: number,
    max?: number,
    disabled?: boolean,
    editable?: boolean,
    onChange: (value: number) => void,
};

const Stepper = ({ className, label, value, unit, step, min, max, disabled, editable, onChange }: Props) => {
    const { t } = useTranslation();

    const localValue = useRef(value);
    const skipBlurCommit = useRef(false);
    const [editing, setEditing] = useState(false);
    const [draftValue, setDraftValue] = useState(formatNumber(value));

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
        if (typeof localValue.current !== 'number') {
            return;
        }

        const nextValue = clamp(localValue.current + delta, min, max);

        localValue.current = nextValue;
        onChange(nextValue);
    }, [max, min, onChange]);

    const commitDraftValue = useCallback(() => {
        const normalizedValue = draftValue.trim().replace(',', '.');
        const parsedValue = normalizedValue.length > 0 ? Number(normalizedValue) : Number.NaN;

        setEditing(false);

        if (Number.isFinite(parsedValue)) {
            const nextValue = clamp(parsedValue, min, max);

            localValue.current = nextValue;
            setDraftValue(formatNumber(nextValue));
            onChange(nextValue);
        } else {
            setDraftValue(formatNumber(value));
        }
    }, [draftValue, max, min, onChange, value]);

    const onValueBlur = useCallback(() => {
        if (skipBlurCommit.current) {
            skipBlurCommit.current = false;
            return;
        }

        commitDraftValue();
    }, [commitDraftValue]);

    const resetDraftValue = useCallback(() => {
        setEditing(false);
        setDraftValue(formatNumber(value));
    }, [value]);

    const onValueFocus = useCallback((event: React.FocusEvent<HTMLInputElement>) => {
        setEditing(true);
        event.currentTarget.select();
    }, []);

    const onValueChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        setDraftValue(event.currentTarget.value);
    }, []);

    const onValueKeyDown = useCallback((event: React.KeyboardEvent<HTMLInputElement>) => {
        event.stopPropagation();

        switch (event.key) {
            case 'Enter': {
                event.preventDefault();
                commitDraftValue();
                skipBlurCommit.current = true;
                event.currentTarget.blur();
                break;
            }
            case 'Escape': {
                event.preventDefault();
                resetDraftValue();
                skipBlurCommit.current = true;
                event.currentTarget.blur();
                break;
            }
        }
    }, [commitDraftValue, resetDraftValue]);

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

    useEffect(() => {
        if (!editing) {
            setDraftValue(formatNumber(value));
        }
    }, [editing, value]);

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
                {
                    editable && !disabled && typeof value === 'number' ?
                        <div className={styles['editable-value']}>
                            <input
                                className={styles['input']}
                                type={'text'}
                                inputMode={'decimal'}
                                aria-label={t(label)}
                                value={draftValue}
                                onBlur={onValueBlur}
                                onChange={onValueChange}
                                onFocus={onValueFocus}
                                onKeyDown={onValueKeyDown}
                            />
                            {
                                typeof unit === 'string' && unit.length > 0 ?
                                    <span className={styles['unit']}>
                                        { unit }
                                    </span>
                                    :
                                    null
                            }
                        </div>
                        :
                        <div className={styles['value']}>
                            { valueLabel }
                        </div>
                }
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
