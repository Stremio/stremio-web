import { useEffect, useState } from 'react';
import EventEmitter from 'eventemitter3';

const IPC = globalThis?.chrome?.webview;
const LEGACY_IPC = globalThis?.qt?.webChannelTransport;
if (LEGACY_IPC) LEGACY_IPC.onmessage = () => { /* empty */ };

const events = new EventEmitter();

enum ShellEventType {
    SIGNAL = 1,
    INIT = 3,
    INVOKE_METHOD = 6,
}

type ShellEvent = {
    id: number;
    type: ShellEventType;
};

type ShellEventInit = ShellEvent & {
    data: {
        transport: {
            properties: string[][],
        }
    };
};

type ShellEventSignal = ShellEvent & {
    args: string[];
};

type ShellMessage = {
    data: string;
};

const useShell = (): Shell => {
    const [state, setState] = useState<ShellState>({
        initialized: false,
        version: null,
        windowClosed: false,
        windowHidden: false,
    });

    const on = (name: string, listener: (arg: any) => void) => events.on(name, listener);
    const off = (name: string, listener: (arg: any) => void) => events.off(name, listener);

    const send = (method: string, ...args: (string | number | object)[]) => {
        try {
            IPC?.postMessage(JSON.stringify({
                id: 0,
                type: ShellEventType.INVOKE_METHOD,
                args: [method, ...args],
            }));
        } catch (e) {
            console.error('Shell', 'Failed to send event', e);
        }
    };

    useEffect(() => {
        const onWindowVisibilityChanged = (data: WindowVisibility) => {
            setState((state) => ({
                ...state,
                windowClosed: data.visible === false && data.visibility === 0,
            }));
        };

        const onWindowStateChanged = (data: WindowState) => {
            setState((state) => ({
                ...state,
                windowHidden: data.state === 9,
            }));
        };

        on('win-visibility-changed', onWindowVisibilityChanged);
        on('win-state-changed', onWindowStateChanged);

        return () => {
            off('win-visibility-changed', onWindowVisibilityChanged);
            off('win-state-changed', onWindowStateChanged);
        };
    }, []);

    useEffect(() => {
        const onMessage = (message: ShellMessage) => {
            try {
                const event = JSON.parse(message.data) as ShellEvent;

                if (event.type === ShellEventType.INIT) {
                    const { data } = event as ShellEventInit;
                    const [, [,,, version]] = data.transport.properties;

                    setState((state) => ({ ...state, initialized: true, version }));
                }

                if (event.type === ShellEventType.SIGNAL) {
                    const { args } = event as ShellEventSignal;
                    const [methodName, methodArg] = args;
                    events.emit(methodName, methodArg);
                }
            } catch (e) {
                console.error('Shell', 'Failed to handle event', e);
            }
        };

        IPC?.addEventListener('message', onMessage);
        IPC?.postMessage(JSON.stringify({
            id: 0,
            type: ShellEventType.INIT,
        }));

        return () => IPC?.removeEventListener('message', onMessage);
    }, []);

    return {
        active: !!IPC,
        send,
        on,
        off,
        state,
    };
};

export default useShell;
