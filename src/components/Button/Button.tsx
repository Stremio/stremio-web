// Copyright (C) 2017-2023 Smart code 203358507

import { createElement, forwardRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import classNames from 'classnames';
import { LongPressEventType, useLongPress } from 'use-long-press';
import styles from './Button.less';

type Props = {
    className?: string,
    style?: object,
    href?: string,
    target?: string
    download?: string,
    title?: string,
    disabled?: boolean,
    tabIndex?: number,
    children: React.ReactNode,
    onKeyDown?: (event: React.KeyboardEvent) => void,
    onMouseDown?: (event: React.MouseEvent) => void,
    onMouseUp?: (event: React.MouseEvent) => void,
    onMouseLeave?: (event: React.MouseEvent) => void,
    onLongPress?: () => void,
    onClick?: (event: React.MouseEvent<HTMLDivElement>) => void,
    onDoubleClick?: () => void,
};

const Button = forwardRef(({ className, href, disabled, children, onLongPress, onDoubleClick, ...props }: Props, ref) => {
    const longPress = useLongPress(onLongPress!, { detect: LongPressEventType.Pointer });
    const to = typeof href === 'string' && href.startsWith('#/') && typeof props.download !== 'string' ? href.slice(1) : null;
    const component: React.ElementType = to !== null ? Link : typeof href === 'string' && href.length > 0 ? 'a' : 'div';

    const onKeyDown = useCallback((event: React.KeyboardEvent<HTMLDivElement>) => {
        if (typeof props.onKeyDown === 'function') {
            props.onKeyDown(event);
        }

        if (event.key === 'Enter') {
            event.preventDefault();
            // @ts-expect-error: Property 'buttonClickPrevented' does not exist on type 'KeyboardEvent'.
            if (!event.nativeEvent.buttonClickPrevented) {
                event.currentTarget.click();
            }
        }
    }, [props.onKeyDown]);

    const onMouseDown = useCallback((event: React.MouseEvent<HTMLDivElement>) => {
        if (typeof props.onMouseDown === 'function') {
            props.onMouseDown(event);
        }

        // @ts-expect-error: Property 'buttonBlurPrevented' does not exist on type 'MouseEvent'.
        if (!event.nativeEvent.buttonBlurPrevented) {
            event.preventDefault();
            if (document.activeElement instanceof HTMLElement) {
                document.activeElement.blur();
            }
        }
    }, [props.onMouseDown]);

    return createElement(
        component,
        {
            tabIndex: 0,
            ...props,
            ref,
            className: classNames(className, styles['button-container'], { 'disabled': disabled }),
            href,
            ...(to !== null ? { to } : {}),
            onKeyDown,
            onMouseDown,
            onDoubleClick,
            ...longPress()
        },
        children
    );
});

export default Button;

