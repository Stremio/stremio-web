type Auth = {
    key: string,
    user: {
        _id: string,
        avatar: string,
        email: string,
        trakt: {
            access_token: string,
            created_at: number,
            expires_in: number,
        },
    },
};

type Settings = {
    audioLanguage: string,
    audioPassthrough: boolean,
    autoFrameRateMatching: boolean,
    bingeWatching: boolean,
    hardwareDecoding: boolean,
    escExitFullscreen: boolean,
    interfaceLanguage: string,
    nextVideoNotificationDuration: number,
    playInBackground: boolean,
    playerType: string | null,
    secondaryAudioLanguage: string | null,
    secondarySubtitlesLanguage: string | null,
    seekTimeDuration: number,
    seekShortTimeDuration: number,
    streamingServerUrl: string,
    streamingServerWarningDismissed: Date | null,
    subtitlesBackgroundColor: string,
    subtitlesBold: boolean,
    subtitlesFont: string,
    subtitlesLanguage: string,
    subtitlesOffset: number,
    subtitlesOutlineColor: string,
    subtitlesSize: number,
    subtitlesTextColor: string,
};

type Profile = {
    auth: Auth | null,
    settings: Settings,
};

type Notifications = {
    uid: string,
    created: string,
    items: Record<string, NotificationItem[]>,
};

type NotificationItem = {
    metaId: string,
    videoId: string,
    videoReleased: string,
}

type SearchHistory = string[];

type Ctx = {
    profile: Profile,
    notifications: Notifications,
    searchHistory: SearchHistory,
};