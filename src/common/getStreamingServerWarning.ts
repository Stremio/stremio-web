// Copyright (C) 2017-2024 Smart code 203358507

const isStreamingServerNotRunning = (streamingServer: StreamingServer): boolean => (
    streamingServer.state === null ||
    streamingServer.state.type === 'Err' ||
    (streamingServer.state.type === 'Ready' && streamingServer.state.content === 'notRunning')
);

const getStreamingServerWarning = (streamingServer: StreamingServer, profile: Profile): boolean => {
    if (!isStreamingServerNotRunning(streamingServer)) {
        return false;
    }

    const dismissedAt = profile.settings.streamingServerWarningDismissed;
    return dismissedAt === null || isNaN(dismissedAt.getTime()) || dismissedAt.getTime() < Date.now();
};

export default getStreamingServerWarning;
