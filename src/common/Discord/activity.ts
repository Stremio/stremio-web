type DiscordActivity = {
    state: string,
    details?: string | null,
    image?: string | null,
    startTimestamp?: number | null,
    endTimestamp?: number | null,
};

type DiscordTimestamps = {
    startTimestamp: number | null,
    endTimestamp: number | null,
};

type PlaybackDiscordActivityArgs = {
    title: string,
    image: string | null,
    paused: boolean | null,
    time: number | null,
    duration: number | null,
    timestamps: DiscordTimestamps,
};

const EMPTY_DISCORD_TIMESTAMPS: DiscordTimestamps = {
    startTimestamp: null,
    endTimestamp: null,
};

const getDiscordSeconds = (time: number | null | undefined) => {
    return typeof time === 'number' && Number.isFinite(time) ?
        Math.max(Math.floor(time / 1000), 0)
        :
        null;
};

const formatDiscordTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds / 60) % 60);
    const remainingSeconds = seconds % 60;
    const pad = (value: number) => `0${value}`.slice(-2);

    return hours > 0 ?
        `${pad(hours)}:${pad(minutes)}:${pad(remainingSeconds)}`
        :
        `${pad(minutes)}:${pad(remainingSeconds)}`;
};

const formatPausedDiscordState = (time: number | null, duration: number | null) => {
    const elapsedSeconds = getDiscordSeconds(time);
    const durationSeconds = getDiscordSeconds(duration);
    if (elapsedSeconds === null || durationSeconds === null) {
        return 'Paused';
    }

    return `Paused at ${formatDiscordTime(elapsedSeconds)} / ${formatDiscordTime(durationSeconds)}`;
};

const getPlayingDiscordTimestamps = (timestamps: DiscordTimestamps, time: number | null, duration: number | null) => {
    const elapsedSeconds = getDiscordSeconds(time);
    if (elapsedSeconds === null) {
        return EMPTY_DISCORD_TIMESTAMPS;
    }

    const nowTimestamp = Math.floor(Date.now() / 1000);
    const startTimestamp = nowTimestamp - elapsedSeconds;
    const durationSeconds = getDiscordSeconds(duration);
    const endTimestamp = durationSeconds === null ?
        null
        :
        nowTimestamp + Math.max(durationSeconds - elapsedSeconds, 0);

    return {
        startTimestamp: timestamps.startTimestamp === null || Math.abs(timestamps.startTimestamp - startTimestamp) > 5 ?
            startTimestamp
            :
            timestamps.startTimestamp,
        endTimestamp: endTimestamp === null || timestamps.endTimestamp === null || Math.abs(timestamps.endTimestamp - endTimestamp) > 5 ?
            endTimestamp
            :
            timestamps.endTimestamp,
    };
};

const getPlaybackDiscordActivity = ({
    title,
    image,
    paused,
    time,
    duration,
    timestamps,
}: PlaybackDiscordActivityArgs) => {
    const nextTimestamps = paused === true ?
        EMPTY_DISCORD_TIMESTAMPS
        :
        getPlayingDiscordTimestamps(timestamps, time, duration);

    return {
        activity: {
            state: paused === true ? formatPausedDiscordState(time, duration) : 'Watching',
            details: title,
            image,
            startTimestamp: nextTimestamps.startTimestamp,
            endTimestamp: nextTimestamps.endTimestamp,
        },
        timestamps: nextTimestamps,
    };
};

export {
    EMPTY_DISCORD_TIMESTAMPS,
    getPlaybackDiscordActivity,
};

export type {
    DiscordActivity,
};
