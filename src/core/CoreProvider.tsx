import React, { useEffect, useRef, useState } from 'react';
import CoreContext from './CoreContext';
import createTransport from './createTransport';
import Error from './Error';

const transport = createTransport();

type Props = {
    appInfo: object,
    children: React.ReactNode,
};

const Core = (props: Props) => {
    const initialized = useRef(false);
    const [ready, setReady] = useState(false);
    const [error, setError] = useState<Error | null>();

    const stateListeners = useRef(new Set<CoreStateListener>());
    const eventListeners = useRef(new Set<CoreEventListener>());
    const errorListeners = useRef(new Set<CoreErrorListener>());

    const on = (name: CoreListenerType, listener: CoreListener) => {
        if (name === 'state') stateListeners.current.add(listener as CoreStateListener);
        if (name === 'event') eventListeners.current.add(listener as CoreEventListener);
        if (name === 'error') errorListeners.current.add(listener as CoreErrorListener);
    };

    const off = (name: CoreListenerType, listener: CoreListener) => {
        if (name === 'state') stateListeners.current.delete(listener as CoreStateListener);
        if (name === 'event') eventListeners.current.delete(listener as CoreEventListener);
        if (name === 'error') errorListeners.current.delete(listener as CoreErrorListener);
    };

    useEffect(() => {
        if (initialized.current) return;
        initialized.current = true;

        const onCoreEvent = ({ name, args }: NewStateEvent | CoreEventEvent) => {
            switch (name) {
                case 'NewState':
                    Array.from(stateListeners.current).forEach((listener) => listener(args));
                    break;

                case 'CoreEvent': {
                    switch (args.event) {
                        case 'Error': {
                            const { source, error } = args.args;
                            Array.from(errorListeners.current).forEach((listener) => listener(
                                source,
                                error,
                            ));
                            break;
                        }
                        default:
                            Array.from(eventListeners.current).forEach((listener) => listener(
                                args.event,
                                args.args,
                            ));
                            break;
                    }
                    break;
                }

                default:
                    break;
            }
        };

        transport
            .init(props.appInfo)
            .then(() => {
                window.core = transport;
                window.onCoreEvent = onCoreEvent;
                setReady(true);
                setError(null);
            })
            .catch((e: Error) => {
                console.error('Failed to initialize core:', e);
                setReady(false);
                setError(e);
            });

        return () => {
            stateListeners.current = new Set();
            eventListeners.current = new Set();
            errorListeners.current = new Set();
        };
    }, []);

    return (
        <CoreContext.Provider value={{ transport, on, off }}>
            { error && !ready && <Error message={error.message} /> }
            { ready && !error && props.children }
        </CoreContext.Provider>
    );
};

export default Core;
