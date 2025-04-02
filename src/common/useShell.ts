import { useEffect, useState } from 'react';
import EventEmitter from 'eventemitter3';

const SHELL_EVENT_OBJECT = 'transport';
const transport = globalThis?.chrome?.webview;
const events = new EventEmitter();

enum ShellEventType {
    SIGNAL = 1,
    INVOKE_METHOD = 6,
}

type ShellEvent = {
    id: number;
    type: ShellEventType;
    object: string;
    args: string[];
};

export type WindowVisibility = {
    visible: boolean;
    visibility: number;
    isFullscreen: boolean;
};

export type WindowState = {
    state: number;
};

const createId = () => Math.floor(Math.random() * 9999) + 1;

const useShell = () => {
    const [windowClosed, setWindowClosed] = useState(false);
    const [windowHidden, setWindowHidden] = useState(false);

    const on = (name: string, listener: (arg: any) => void) => {
        events.on(name, listener);
    };

    const off = (name: string, listener: (arg: any) => void) => {
        events.off(name, listener);
    };

    const send = (method: string, ...args: (string | number | object)[]) => {
        try {
            transport?.postMessage(JSON.stringify({
                id: createId(),
                type: ShellEventType.INVOKE_METHOD,
                object: SHELL_EVENT_OBJECT,
                method: 'onEvent',
                args: [method, ...args],
            }));
        } catch (e) {
            console.error('Shell', 'Failed to send event', e);
        }
    };

    useEffect(() => {
        const onWindowVisibilityChanged = (data: WindowVisibility) => {
            setWindowClosed(data.visible === false && data.visibility === 0);
        };

        const onWindowStateChanged = (data: WindowState) => {
            setWindowHidden(data.state === 9);
        };

        on('win-visibility-changed', onWindowVisibilityChanged);
        on('win-state-changed', onWindowStateChanged);

        return () => {
            off('win-visibility-changed', onWindowVisibilityChanged);
            off('win-state-changed', onWindowStateChanged);
        };
    }, []);

    useEffect(() => {
        if (!transport) return;

        const onMessage = ({ data }: { data: string }) => {
            try {
                const { type, args } = JSON.parse(data) as ShellEvent;
                if (type === ShellEventType.SIGNAL) {
                    const [methodName, methodArg] = args;
                    events.emit(methodName, methodArg);
                }
            } catch (e) {
                console.error('Shell', 'Failed to handle event', e);
            }
        };

        transport.addEventListener('message', onMessage);
        return () => transport.removeEventListener('message', onMessage);
    }, []);

    return {
        active: !!transport,
        send,
        on,
        off,
        windowClosed,
        windowHidden,
    };
};

export default useShell;
