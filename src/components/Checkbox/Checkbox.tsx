// Copyright (C) 2017-2025 Smart code 203358507

import React, { useCallback, ChangeEvent, KeyboardEvent, RefCallback } from 'react';
import classNames from 'classnames';
import styles from './Checkbox.less';
import Button from '../Button';
import Icon from '@stremio/stremio-icons/react';

type Props = {
    ref?: RefCallback<HTMLInputElement>;
    name: string;
    disabled?: boolean;
    checked?: boolean;
    className?: string;
    label?: string;
    link?: string;
    href?: string;
    onChange?: (props: {
        type: string;
        checked: boolean;
        reactEvent: KeyboardEvent<HTMLInputElement> | ChangeEvent<HTMLInputElement>;
        nativeEvent: Event;
    }) => void;
    error?: string;
};

const Checkbox = React.forwardRef<HTMLInputElement, Props>(({ name, disabled, className, label, href, link, onChange, error, checked }, ref) => {

    const handleSelect = useCallback((event: ChangeEvent<HTMLInputElement>) => {
        if (!disabled && onChange) {
            onChange({
                type: 'select',
                checked: event.target.checked,
                reactEvent: event,
                nativeEvent: event.nativeEvent,
            });
        }
    }, [disabled, onChange]);

    const onKeyDown = useCallback((event: KeyboardEvent<HTMLInputElement>) => {
        if ((event.key === 'Enter' || event.key === ' ') && !disabled) {
            onChange && onChange({
                type: 'select',
                checked: !checked,
                reactEvent: event as KeyboardEvent<HTMLInputElement>,
                nativeEvent: event.nativeEvent,
            });
        }
    }, [disabled, checked, onChange]);

    return (
        <div className={classNames(styles['checkbox'], className)}>
            <label className={styles['label']} htmlFor={name}>
                <div
                    className={classNames(
                        styles['checkbox-container'],
                        { [styles['checked']]: checked },
                        { [styles['disabled']]: disabled },
                        { [styles['error']]: error }
                    )}
                    role={'checkbox'}
                    tabIndex={disabled ? -1 : 0}
                    aria-checked={checked}
                    onKeyDown={onKeyDown}
                >
                    <input
                        ref={ref}
                        id={name}
                        type={'checkbox'}
                        checked={checked}
                        disabled={disabled}
                        onChange={handleSelect}
                        className={styles['input']}
                    />
                    {
                        checked ?
                            <Icon name={'checkmark'} className={styles['checkbox-icon']} />
                            : null
                    }
                </div>
                <div>
                    <span>{label}</span>
                    {
                        href && link ?
                            <Button className={styles['link']} href={href} target={'_blank'} tabIndex={-1}>
                                {link}
                            </Button>
                            : null
                    }
                </div>
            </label>
        </div>
    );
});

export default Checkbox;
