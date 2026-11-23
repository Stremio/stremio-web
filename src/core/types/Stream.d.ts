
type StreamDeepLinks = {
    player: string,
    externalPlayer: ExternalPlayerLinks,
};

type Stream = {
    ytId?: string,
    name: string,
    description: string,
    infoHash?: string,
    fileIdx?: number,
    url?: string,
    externalUrl?: string,
    thumbnail?: string | null,
    progress?: number | null,
    lastUsed?: boolean | null,
    deepLinks?: StreamDeepLinks,
};
