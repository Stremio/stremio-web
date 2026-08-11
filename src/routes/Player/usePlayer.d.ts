declare const usePlayer: (urlParams: UrlParams) => [
    Player,
    videoParamsChanged: (videoParams: { hash: string | null, size: number | null, filename: string | null }) => void,
    streamStateChanged: (state: Partial<StreamState>) => void,
    subtitlePreferenceChanged: (preference: SubtitlePreference) => void,
    timeChanged: (time: number, duration: number, device: string) => void,
    seek: (time: number, duration: number, device: string) => void,
    pausedChanged: (paused: boolean) => void,
    ended: () => void,
    nextVideo: () => void,
];

export = usePlayer;
