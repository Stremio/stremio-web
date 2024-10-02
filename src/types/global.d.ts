interface QtTransport {
    send: (message: string) => void,
}

interface Qt {
    webChannelTransport: QtTransport,
}

declare global {
    var qt: Qt | undefined;
}

export { };