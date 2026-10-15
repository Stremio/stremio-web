import React from 'react';

type PopupCloseEvent = {
    type: 'close',
    nativeEvent: Event,
    dataset?: Record<string, unknown>,
};

type PopupLabelProps = {
    ref: React.Ref<HTMLDivElement>,
    className: string,
    children: React.ReactNode,
} & Record<string, any>;

type PopupProps = {
    className?: string,
    open: boolean,
    direction?: 'top-left' | 'bottom-left' | 'top-right' | 'bottom-right',
    portal?: boolean,
    autoFocus?: boolean,
    menuClassName?: string,
    dataset?: Record<string, unknown>,
    renderLabel: (props: PopupLabelProps) => React.ReactNode,
    renderMenu: () => React.ReactNode,
    onCloseRequest?: (event: PopupCloseEvent) => void,
} & Record<string, unknown>;

declare const Popup: (props: PopupProps) => React.JSX.Element;

export = Popup;
