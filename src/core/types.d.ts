type DispatchAction = {
    action: string,
    args?: {
        model?: string,
        action?: string,
        args?: any,
    }
};

type CoreTransport = {
    init: (args: object) => Promise<void>,
    getState: (model: string) => Promise<object>,
    dispatch: (action: DispatchAction, model?: string) => Promise<void>,
    encodeStream: (stream: Stream) => Promise<string>,
    decodeStream: (stream: string) => Promise<Stream>,
    analytics: (event: object) => Promise<void>,
};

type CoreStateListener = (models: string[]) => void;
type CoreEventListener = (name: string, data: object) => void;
type CoreErrorListener = (source: CoreEvent, error: CoreEventError) => void;

type CoreListener = CoreStateListener | CoreEventListener | CoreErrorListener;
type CoreListenerType = 'state' | 'event' | 'error';

type NewStateEvent = {
    name: 'NewState',
    args: string[],
};

type CoreEvent = {
    event: 'UserPulledFromAPI' | 'UserLibraryMissing' | 'UserAuthenticated' | 'UserAddonsLocked' |
        'LibraryItemsPulledFromAPI' | 'LibraryItemsPushedToStorage' | 'LibrarySyncWithAPIPlanned',
    args: object,
};

type CoreEventError = {
    code: number,
    type: string,
    message: string,
};

type CoreError = {
    event: 'Error',
    args: {
        source: CoreEvent,
        error: CoreEventError,
    },
};

type CoreEventEvent = {
    name: 'CoreEvent',
    args: CoreEvent | CoreError,
};
