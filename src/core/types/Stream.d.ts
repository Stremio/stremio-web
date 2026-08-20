
type StreamDeepLinks = {
    player: string | null,
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
    deepLinks?: {
        player: string,
        externalPlayer: ExternalPlayerLinks,
    },
};
