
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
    behaviorHints?: {
        notWebReady?: boolean,
        bingeGroup?: string,
        countryWhitelist?: string[],
        filename?: string,
        videoHash?: string,
        videoSize?: number,
    },
    deepLinks?: {
        player: string,
        externalPlayer: ExternalPlayerLinks,
    },
};
