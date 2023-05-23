type CoreEvent = {
    name: string,
    args: any[],
};

declare global {
    interface Window {
        onCoreEvent: (event: CoreEvent) => void;
    }
}

export {};