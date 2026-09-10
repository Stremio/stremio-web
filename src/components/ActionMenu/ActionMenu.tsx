// Copyright (C) 2017-2026 Smart code 203358507

import React, { useCallback, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import classNames from 'classnames';
import styles from './ActionMenu.less';

const VIEWPORT_PADDING = 8;
const HIDDEN_MENU_STYLE: React.CSSProperties = { visibility: 'hidden' };

type Option = {
    label: string,
    title?: string,
    value: string,
};

type ActionMenuSelectEvent = {
    type: 'select',
    value: string,
    reactEvent: React.MouseEvent<HTMLButtonElement>,
    nativeEvent: MouseEvent,
};

type Props = {
    className?: string,
    title?: string,
    tabIndex?: number,
    options: Option[],
    children: React.ReactNode,
    onOpen?: () => void,
    onClose?: () => void,
    onSelect: (event: ActionMenuSelectEvent) => void,
};

type Position = {
    top: number,
    left: number,
};

const ActionMenu = ({ className, title, tabIndex, options, children, onOpen, onClose, onSelect }: Props) => {
    const triggerRef = useRef<HTMLButtonElement>(null);
    const menuRef = useRef<HTMLDivElement>(null);
    const [open, setOpen] = useState(false);
    const [position, setPosition] = useState<Position | null>(null);

    const openMenu = useCallback(() => {
        setOpen(true);
        onOpen?.();
    }, [onOpen]);

    const closeMenu = useCallback(() => {
        setOpen(false);
        setPosition(null);
        onClose?.();
    }, [onClose]);

    const closeMenuAndRestoreFocus = useCallback(() => {
        closeMenu();
        triggerRef.current?.focus();
    }, [closeMenu]);

    useLayoutEffect(() => {
        if (!open || !triggerRef.current || !menuRef.current) return;

        const triggerRect = triggerRef.current.getBoundingClientRect();
        const menuRect = menuRef.current.getBoundingClientRect();
        const maxTop = window.innerHeight - menuRect.height - VIEWPORT_PADDING;
        const maxLeft = window.innerWidth - menuRect.width - VIEWPORT_PADDING;
        const preferredTop = triggerRect.bottom + menuRect.height <= window.innerHeight - VIEWPORT_PADDING
            ? triggerRect.bottom
            : triggerRect.top - menuRect.height;
        const preferredLeft = triggerRect.left + menuRect.width <= window.innerWidth - VIEWPORT_PADDING
            ? triggerRect.left
            : triggerRect.right - menuRect.width;

        setPosition({
            top: Math.max(VIEWPORT_PADDING, Math.min(preferredTop, maxTop)),
            left: Math.max(VIEWPORT_PADDING, Math.min(preferredLeft, maxLeft))
        });
        menuRef.current.querySelector<HTMLButtonElement>('[role="menuitem"]')?.focus();
    }, [open]);

    const layerOnClick = useCallback((event: React.MouseEvent<HTMLDivElement>) => {
        if (event.target === event.currentTarget) {
            closeMenuAndRestoreFocus();
        }
    }, [closeMenuAndRestoreFocus]);

    const menuOnKeyDown = useCallback((event: React.KeyboardEvent<HTMLDivElement>) => {
        if (event.key === 'Escape') {
            event.preventDefault();
            closeMenuAndRestoreFocus();
            return;
        }

        if (event.key === 'Tab') {
            closeMenuAndRestoreFocus();
            return;
        }

        const items = Array.from(event.currentTarget.querySelectorAll<HTMLButtonElement>('[role="menuitem"]'));
        const currentIndex = items.indexOf(document.activeElement as HTMLButtonElement);
        const nextIndex = event.key === 'ArrowDown'
            ? (currentIndex + 1) % items.length
            : event.key === 'ArrowUp'
                ? (currentIndex - 1 + items.length) % items.length
                : event.key === 'Home'
                    ? 0
                    : event.key === 'End'
                        ? items.length - 1
                        : null;

        if (nextIndex !== null && items.length > 0) {
            event.preventDefault();
            items[nextIndex].focus();
        }
    }, [closeMenuAndRestoreFocus]);

    const optionOnClick = useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
        const value = event.currentTarget.dataset.value;
        if (typeof value !== 'string') return;

        closeMenuAndRestoreFocus();
        onSelect({
            type: 'select',
            value,
            reactEvent: event,
            nativeEvent: event.nativeEvent
        });
    }, [closeMenuAndRestoreFocus, onSelect]);

    const portalContainer = triggerRef.current?.closest('.route-container') ?? document.body;

    return (
        <React.Fragment>
            <button
                ref={triggerRef}
                type={'button'}
                className={classNames(styles['trigger'], className, { 'active': open })}
                title={title}
                aria-label={title}
                aria-haspopup={'menu'}
                aria-expanded={open}
                tabIndex={tabIndex}
                onClick={openMenu}
            >
                {children}
            </button>
            {
                open ?
                    createPortal(
                        <div className={styles['layer']} onClick={layerOnClick}>
                            <div
                                ref={menuRef}
                                className={styles['menu-container']}
                                style={position ?? HIDDEN_MENU_STYLE}
                                role={'menu'}
                                aria-label={title}
                                onKeyDown={menuOnKeyDown}
                            >
                                {options.map((option) => (
                                    <button
                                        key={option.value}
                                        type={'button'}
                                        className={styles['option-container']}
                                        title={option.title ?? option.label}
                                        data-value={option.value}
                                        role={'menuitem'}
                                        tabIndex={-1}
                                        onClick={optionOnClick}
                                    >
                                        <span className={styles['label']}>{option.label}</span>
                                    </button>
                                ))}
                            </div>
                        </div>,
                        portalContainer
                    )
                    :
                    null
            }
        </React.Fragment>
    );
};

export default ActionMenu;
