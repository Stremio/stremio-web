// Copyright (C) 2017-2024 Smart code 203358507

import React from 'react';
import classnames from 'classnames';
import styles from './styles.less';

type Props = React.InputHTMLAttributes<HTMLInputElement> & {
    className?: string;
    disabled?: boolean;
    onKeyDown?: (event: React.KeyboardEvent<HTMLInputElement>) => void;
    onSubmit?: (event: React.KeyboardEvent<HTMLInputElement>) => void;
};

const TextInput = React.forwardRef<HTMLInputElement, Props>((props, ref) => {
    const { onSubmit, className, disabled, ...rest } = props;

    const onKeyDown = React.useCallback((event: React.KeyboardEvent<HTMLInputElement>) => {
        if (typeof props.onKeyDown === 'function') {
            props.onKeyDown(event);
        }

        if (
            event.key === 'Enter' &&
            !(event.nativeEvent as any).submitPrevented &&
            typeof onSubmit === 'function'
        ) {
            onSubmit(event);
        }
    }, [props.onKeyDown, onSubmit]);

    return (
        <input
            size={1}
            autoCorrect={'off'}
            autoCapitalize={'off'}
            autoComplete={'off'}
            spellCheck={false}
            tabIndex={0}
            ref={ref}
            className={classnames(className, styles['text-input'], { disabled })}
            onKeyDown={onKeyDown}
            {...rest}
        />
    );
});

TextInput.displayName = 'TextInput';

export default TextInput;
