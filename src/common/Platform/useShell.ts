const createId = () => Math.floor(Math.random() * 9999) + 1;

const useShell = () => {
    const transport = globalThis?.qt?.webChannelTransport;

    const send = (method: string, ...args: (string | number)[]) => {
        transport?.send(JSON.stringify({
            id: createId(),
            type: 6,
            object: 'transport',
            method: 'onEvent',
            args: [method, ...args],
        }));
    };

    return {
        active: !!transport,
        send,
    };
};

export default useShell;
