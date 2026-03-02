type ShellTransportProps = {
    shellVersion: string,
};

type ShellTransport = {
    props: ShellTransportProps,
};

interface ShellService {
    transport: ShellTransport,
}
