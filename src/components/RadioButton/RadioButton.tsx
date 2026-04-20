// Copyright (C) 2017-2024 Smart code 203358507

import React, { useCallback, ChangeEvent, KeyboardEvent } from 'react';
import classNames from 'clsx';
import styles from './RadioButton.less';

type Props = {
    disabled?: boolean;
    selected?: boolean;
    className?: string;
    onChange?: (checked: boolean) => void;
    error?: string;
};

const RadioButton = ({ disabled, selected, className, onChange, error }: Props) => {

    const handleSelect = useCallback(({ target }: ChangeEvent<HTMLInputElement>) => {
        if (!disabled && onChange) {
            onChange(target.checked);
        }
    }, [disabled, onChange]);

    const onKeyDown = useCallback(({ key }: KeyboardEvent<HTMLDivElement>) => {
        if ((key === 'Enter' || key === ' ') && !disabled) {
            onChange && onChange(!selected);
        }
    }, [disabled, selected, onChange]);

    return (
        <div className={classNames(styles['radio-button'], className)}>
            <label>
                <div
                    className={classNames(
                        styles['radio-container'],
                        { [styles['selected']]: selected },
                        { [styles['disabled']]: disabled },
                        { [styles['error']]: error }
                    )}
                    role={'radio'}
                    tabIndex={disabled ? -1 : 0}
                    aria-checked={selected}
                    onKeyDown={onKeyDown}
                >
                    <input
                        type={'radio'}
                        checked={selected}
                        disabled={disabled}
                        onChange={handleSelect}
                        className={styles['input']}
                    />
                    <span className={styles['inner-circle']} />
                </div>
            </label>
        </div>
    );
};

export default RadioButton;
