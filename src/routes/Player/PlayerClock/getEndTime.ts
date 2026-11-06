// Playback timestamps use milliseconds; remaining wall time depends on speed.
const getEndTime = (now: Date, time: number | null | undefined, duration: number | null | undefined, playbackSpeed?: number | null, live = false): Date | null => {
    if (live || typeof time !== 'number' || !Number.isFinite(time) || typeof duration !== 'number' || !Number.isFinite(duration) || duration <= 0) return null;
    const speed = typeof playbackSpeed === 'number' && Number.isFinite(playbackSpeed) && playbackSpeed > 0 ? playbackSpeed : 1;
    const end = new Date(now.getTime() + Math.max(0, duration - Math.max(0, time)) / speed);
    return Number.isFinite(end.getTime()) ? end : null;
};
export default getEndTime;
