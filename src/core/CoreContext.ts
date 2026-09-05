import { createContext } from 'react';

interface CoreContext {
    transport: CoreTransport;
    on(name: 'state', listener: CoreStateListener): void;
    on(name: 'event', listener: CoreEventListener): void;
    on(name: 'error', listener: CoreErrorListener): void;
    off(name: 'state', listener: CoreStateListener): void;
    off(name: 'event', listener: CoreEventListener): void;
    off(name: 'error', listener: CoreErrorListener): void;
}

const CoreContext = createContext<CoreContext>({} as CoreContext);

export default CoreContext;
