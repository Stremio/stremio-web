import {
    isDirectStream,
    isSeasonPack,
    parseEpisode,
    parseQuality,
    parseRuntimeMinutes,
    parseSeason,
    streamFileSizeBytes,
    streamKey,
    streamLabel,
    streamText,
} from './streamQuality';

export type SmartPlayStreamGroup = {
    addon: {
        transportUrl: string;
        manifest: {
            name: string;
        };
    };
    streams: Stream[];
};

export type SmartPlayCandidate = {
    groupIndex: number;
    index: number;
    stream: Stream;
    addon: SmartPlayStreamGroup['addon'];
    addonName: string;
    height: number;
    hdr: boolean;
    sizeBytes: number;
    requiredMbps: number;
    key: string;
    label: string;
};

export type SmartPlaySelectionOptions = {
    groups: SmartPlayStreamGroup[];
    type?: string | null;
    video?: {
        season?: number;
        episode?: number;
        runtime?: string;
    } | null;
    metaItem?: {
        type?: string;
        runtime?: string;
    } | null;
    targetHeight: number;
    hdrPreference: 'auto' | 'hdr' | 'sdr';
    ignoredKeys: Set<string>;
    hasExternalPlayer: boolean;
    bandwidthMbps: number | null;
};

export type SmartPlaySelectionResult = {
    candidate: SmartPlayCandidate | null;
    candidates: SmartPlayCandidate[];
};

const matchesRequestedContent = (
    stream: Stream,
    options: SmartPlaySelectionOptions,
): boolean => {
    const text = streamText(stream);
    const requestedSeason = options.video?.season;
    const requestedEpisode = options.video?.episode;
    const requestedIsEpisode = typeof requestedSeason === 'number' && typeof requestedEpisode === 'number';
    const isMovie = options.type === 'movie' || options.metaItem?.type === 'movie';

    if (requestedIsEpisode) {
        if (isSeasonPack(text)) {
            return false;
        }
        const parsedEpisode = parseEpisode(text);
        if (parsedEpisode && (parsedEpisode.season !== requestedSeason || parsedEpisode.episode !== requestedEpisode)) {
            return false;
        }
        const parsedSeason = parseSeason(text);
        if (parsedSeason !== null && parsedSeason !== requestedSeason) {
            return false;
        }
    }

    if (isMovie) {
        if (parseEpisode(text) !== null || parseSeason(text) !== null || isSeasonPack(text)) {
            return false;
        }
        const expectedRuntime = parseRuntimeMinutes(options.metaItem?.runtime ?? options.video?.runtime ?? '');
        const actualRuntime = parseRuntimeMinutes(text);
        if (expectedRuntime > 0 && actualRuntime > 0 && Math.abs(expectedRuntime - actualRuntime) > 5) {
            return false;
        }
    }

    return true;
};

const collectCandidates = (options: SmartPlaySelectionOptions): SmartPlayCandidate[] => {
    const candidates: SmartPlayCandidate[] = [];
    const isMovie = options.type === 'movie' || options.metaItem?.type === 'movie';
    const runtimeText = options.video?.runtime ?? (isMovie ? options.metaItem?.runtime ?? '' : '');
    const runtimeMinutes = parseRuntimeMinutes(runtimeText);
    options.groups.forEach((group, groupIndex) => {
        group.streams.forEach((stream, index) => {
            if (!stream.deepLinks) {
                return;
            }
            if (!options.hasExternalPlayer && typeof stream.deepLinks.player !== 'string') {
                return;
            }
            const hasInternalSource = typeof stream.url === 'string' && stream.url.length > 0
                || typeof stream.infoHash === 'string' && stream.infoHash.length > 0
                || typeof stream.ytId === 'string' && stream.ytId.length > 0;
            if (!options.hasExternalPlayer && !hasInternalSource) {
                return;
            }
            if (!matchesRequestedContent(stream, options)) {
                return;
            }
            const key = streamKey(stream, group.addon.transportUrl);
            if (options.ignoredKeys.has(key)) {
                return;
            }
            const quality = parseQuality(stream);
            const sizeBytes = streamFileSizeBytes(stream);
            const requiredMbps = sizeBytes > 0 && runtimeMinutes > 0
                ? (sizeBytes * 8) / (runtimeMinutes * 60) / 1_000_000
                : 0;
            candidates.push({
                groupIndex,
                index,
                stream,
                addon: group.addon,
                addonName: group.addon.manifest.name,
                height: quality.height,
                hdr: quality.hdr,
                sizeBytes,
                requiredMbps,
                key,
                label: streamLabel(stream, group.addon.manifest.name),
            });
        });
    });
    return candidates;
};

const preferredHdr = (
    candidates: SmartPlayCandidate[],
    preference: SmartPlaySelectionOptions['hdrPreference'],
): SmartPlayCandidate[] => {
    if (preference === 'hdr' && candidates.some((candidate) => candidate.hdr)) {
        return candidates.filter((candidate) => candidate.hdr);
    }
    if (preference === 'sdr' && candidates.some((candidate) => !candidate.hdr)) {
        return candidates.filter((candidate) => !candidate.hdr);
    }
    return candidates;
};

const pickBest = (
    candidates: SmartPlayCandidate[],
    preference: SmartPlaySelectionOptions['hdrPreference'],
): SmartPlayCandidate => {
    const hdrPreferred = preferredHdr(candidates, preference);
    const direct = hdrPreferred.filter((candidate) => isDirectStream(candidate.stream));
    const chosen = direct.length > 0 ? direct : hdrPreferred;
    const sized = chosen.filter((candidate) => candidate.requiredMbps > 0);
    if (sized.length > 0) {
        const lightest = Math.min(...sized.map((candidate) => candidate.requiredMbps));
        return sized.find((candidate) => candidate.requiredMbps === lightest) ?? chosen[0];
    }
    return chosen[0];
};

export const selectSmartPlayCandidate = (options: SmartPlaySelectionOptions): SmartPlaySelectionResult => {
    const candidates = collectCandidates(options);
    if (candidates.length === 0) {
        return { candidate: null, candidates };
    }

    const groups = new Map<number, SmartPlayCandidate[]>();
    for (const candidate of candidates) {
        const group = groups.get(candidate.groupIndex) ?? [];
        group.push(candidate);
        groups.set(candidate.groupIndex, group);
    }

    const bandwidthLimit = typeof options.bandwidthMbps === 'number' && options.bandwidthMbps > 0
        ? options.bandwidthMbps * 0.9
        : 0;
    const fitsBandwidth = (candidate: SmartPlayCandidate) => {
        return bandwidthLimit === 0 || candidate.requiredMbps === 0 || candidate.requiredMbps <= bandwidthLimit;
    };

    for (const [, group] of groups) {
        const heightFitting = group.filter((candidate) => candidate.height > 0 && candidate.height <= options.targetHeight);
        const fitting = heightFitting.filter(fitsBandwidth);
        if (fitting.length === 0) {
            continue;
        }
        const bestHeight = Math.max(...fitting.map((candidate) => candidate.height));
        return {
            candidate: pickBest(fitting.filter((candidate) => candidate.height === bestHeight), options.hdrPreference),
            candidates,
        };
    }

    const heightFitting = candidates.filter((candidate) => candidate.height > 0 && candidate.height <= options.targetHeight);
    if (heightFitting.length > 0) {
        if (bandwidthLimit > 0) {
            const sized = heightFitting.filter((candidate) => candidate.requiredMbps > 0);
            if (sized.length > 0) {
                const lightest = Math.min(...sized.map((candidate) => candidate.requiredMbps));
                return {
                    candidate: pickBest(sized.filter((candidate) => candidate.requiredMbps === lightest), options.hdrPreference),
                    candidates,
                };
            }
        }
        const bestHeight = Math.max(...heightFitting.map((candidate) => candidate.height));
        return {
            candidate: pickBest(heightFitting.filter((candidate) => candidate.height === bestHeight), options.hdrPreference),
            candidates,
        };
    }

    const withHeight = candidates.filter((candidate) => candidate.height > 0);
    if (withHeight.length === 0) {
        return { candidate: candidates[0], candidates };
    }

    const closestDistance = Math.min(...withHeight.map((candidate) => Math.abs(candidate.height - options.targetHeight)));
    const closest = withHeight.filter((candidate) => Math.abs(candidate.height - options.targetHeight) === closestDistance);
    return {
        candidate: pickBest(closest, options.hdrPreference),
        candidates,
    };
};
