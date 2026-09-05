interface Window {
    core: CoreTransport | null | undefined,
    onCoreEvent: ((event: NewStateEvent | CoreEventEvent) => void) | null;
}

interface Bridge {
    call(action: string[], args: any[]): Promise<any>,
}
