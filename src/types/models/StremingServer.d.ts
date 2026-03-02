type Torrent = [
    {
        extra: any[],
        id: string,
        resource: string,
        type: string,
    },
    {
        metaDetailsStreams: string | null,
        metaDetailsVideos: string | null,
        player: string | null,
    }
];

type StreamingServerSettings = {
    appPath: string,
    btDownloadSpeedHardLimit: number,
    btDownloadSpeedSoftLimit: number,
    btHandshakeTimeout: number,
    btMaxConnections: number,
    btMinPeersForStable: number,
    btRequestTimeout: number,
    cacheRoot: string,
    cacheSize: number,
    serverVersion: string,
    remoteHttps: string | null,
    transcodeProfile: string | null,
};

type SFile = {
    name: string,
    path: string,
    length: number,
    offset: number,
};

type Source = {
    last_started: string,
    numFound: number,
    numFoundUniq: number,
    numRequests: number,
    url: string,
};

type Growler = {
    flood: number,
    pulse: number,
};

type PeerSearch = {
    max: number,
    min: number,
    sources: string[],
};

type SwarmCap = {
    maxSpeed: number,
    minPeers: number,
};

type Options = {
    connections: number,
    dht: boolean,
    growler: Growler,
    handshakeTimeout: number,
    path: string,
    peerSearch: PeerSearch,
    swarmCap: SwarmCap,
    timeout: number,
    tracker: boolean,
    virtual: boolean,
};

type Statistics = {
    name: string,
    infoHash: string,
    files: SFile[],
    sources: Source[],
    opts: Options,
    downloadSpeed: number,
    uploadSpeed: number,
    downloaded: number,
    uploaded: number,
    unchoked: number,
    peers: number,
    queued: number,
    unique: number,
    connectionTries: number,
    peerSearchRunning: boolean,
    streamLen: number,
    streamName: string,
    streamProgress: number,
    swarmConnections: number,
    swarmPaused: boolean,
    swarmSize: number,
};

type NetworkInfo = {
    availableInterfaces: string[],
};

type DeviceInfo = {
    availableHardwareAccelerations: string[],
};

type PlaybackDevice = {
    id: string,
    name: string,
    type: string,
};

type Selected = {
    transportUrl: string,
    statistics: {
        infoHash: string,
        fileIdx: number,
    } | null
};

type StreamingServer = {
    baseUrl: string | null,
    remoteUrl: string | null,
    selected: Selected | null,
    settings: Loadable<StreamingServerSettings> | null,
    torrent: [string, Loadable<Torrent>] | null,
    statistics: Loadable<Statistics> | null,
    playbackDevices: Loadable<PlaybackDevice[]> | null,
    networkInfo: Loadable<NetworkInfo> | null,
    deviceInfo: Loadable<DeviceInfo> | null,
};
