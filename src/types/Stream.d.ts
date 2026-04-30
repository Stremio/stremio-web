
type StreamDeepLinks = {
    player: string | null,
    externalPlayer: ExternalPlayerLinks,
};
type PlaybackSegment = {
    type: 'intro' | 'credits',
    start: number,
    end: number,
};

type Stream = {
    ytId?: string,
    name: string,
    description: string,
    infoHash?: string,
    fileIdx?: string,
    externalUrl?: string,
    deepLinks: {
        player: string,
        externalPlayer: ExternalPlayerLinks,
    },
    behaviorHints?: BehaviorHints & {
        segments?: PlaybackSegment[],
    },
};
