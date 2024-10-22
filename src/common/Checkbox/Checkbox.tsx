// Copyright (C) 2017-2024 Smart code 203358507

import React, { useState, useEffect, DetailedHTMLProps, HTMLAttributes } from 'react';
import classNames from 'classnames';
import styles from './Checkbox.less';
import Icon from '@stremio/stremio-icons/react';

type Props = {
    disabled?: boolean;
    value?: boolean;
    className?: string;
    onChange?: (checked: boolean) => void;
    ariaLabel?: string;
    error?: string;
};

const Checkbox = ({ disabled, value, className, onChange, ariaLabel, error }: Props) => {
    const [isChecked, setIsChecked] = useState(false);
    const [isError, setIsError] = useState(false);
    const [isDisabled, setIsDisabled] = useState(disabled);

    const handleChangeCheckbox = () => {
        if (disabled) {
            return;
        }

        setIsChecked(!isChecked);
        onChange && onChange(!isChecked);
    };

    const handleEnterPress = (event: DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>) => {
        if ((event.key === 'Enter' || event.key === ' ') && !disabled) {
            setIsChecked(!isChecked);
            onChange && onChange(!isChecked);
        }
    };

    useEffect(() => setIsDisabled(disabled), [disabled]);

    useEffect(() => setIsError(!!error), [error]);

    useEffect(() => {
        const checked = typeof value === 'boolean' ? value : false;
        setIsChecked(checked);
    }, [value]);

    return (
        <>
            <div className={classNames(styles['checkbox'], className)}>
                <label>
                    <div
                        className={classNames({
                            [styles['checkbox-checked']]: isChecked,
                            [styles['checkbox-unchecked']]: !isChecked,
                            [styles['checkbox-error']]: isError,
                            [styles['checkbox-disabled']]: isDisabled,
                        })}
                    >
                        <div
                            className={styles['checkbox-container']}
                            role={'input'}
                            tabIndex={0}
                            onKeyDown={handleEnterPress}
                        >
                            <input
                                type={'checkbox'}
                                onChange={handleChangeCheckbox}
                                aria-label={ariaLabel}
                                tabIndex={-1}
                                disabled={disabled}
                            />
                            {
                                isChecked ?
                                    <Icon name={'checkmark'} className={styles['checkbox-icon']} />
                                    : null
                            }
                        </div>
                    </div>
                </label>
            </div>
        </>
    );
};

export default Checkbox;
