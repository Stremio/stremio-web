type Action = {
    action: string,
    args?: {
        model?: string,
        action?: string,
        args?: any,
    }
};

type AnalyticsEvent = {
    event: string,
    args: object,
};

interface CoreTransport {
    start: (args: object) => Promise<void>,
    getState: (model: string) => Promise<object>,
    dispatch: (action: Action, model?: string) => Promise<void>,
    decodeStream: (stream: string) => Promise<Stream>,
    analytics: (event: AnalyticsEvent) => Promise<void>,
    on: (name: string, listener: () => void) => void,
    off: (name: string, listener: () => void) => void,
}

interface Core {
    active: boolean,
    transport: CoreTransport,
}