// Copyright (C) 2017-2024 Smart code 203358507

import React, { forwardRef, useCallback } from 'react';
import { type KeyboardEvent, type InputHTMLAttributes } from 'react';
import classnames from 'classnames';
import styles from './styles.less';

type Props = InputHTMLAttributes<HTMLInputElement> & {
    className?: string;
    disabled?: boolean;
    onKeyDown?: (event: KeyboardEvent<HTMLInputElement>) => void;
    onSubmit?: (event: KeyboardEvent<HTMLInputElement>) => void;
};

const Input = forwardRef<HTMLInputElement, Props>((props, ref) => {
    const onKeyDown = useCallback((event: KeyboardEvent<HTMLInputElement>) => {
        props.onKeyDown && props.onKeyDown(event);

        if (event.key === 'Enter' ) {
            props.onSubmit && props.onSubmit(event);
        }
    }, [props.onKeyDown, props.onSubmit]);

    return (
        <label className={classnames(props.className, styles['input-container'], { [styles['disabled']]: props.disabled })}>
            <input
                size={1}
                autoCorrect={'off'}
                autoCapitalize={'off'}
                autoComplete={'off'}
                spellCheck={false}
                tabIndex={0}
                {...props}
                ref={ref}
                className={styles['input']}
                onKeyDown={onKeyDown}
            />
        </label>
    );
});

Input.displayName = 'Input';

export default Input;
