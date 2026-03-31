
type StreamDeepLinks = {
    player: string | null,
    externalPlayer: ExternalPlayerLinks,
};

type Stream = {
    ytId?: string,
    name: string,
    description: string,
    infoHash?: string,
    fileIdx?: string,
    externalUrl?: string,
    /** Absolute URL to a WebVTT file mapping time ranges to thumbnail images (e.g. sprite + #xywh). Provided by addons. */
    thumbnails?: string,
    deepLinks: {
        player: string,
        externalPlayer: ExternalPlayerLinks,
    },
};
