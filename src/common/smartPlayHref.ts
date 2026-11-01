type PlaybackDeepLinks = {
    player?: string | null;
    metaDetailsStreams?: string | null;
    metaDetailsVideos?: string | null;
};

const appendToPart = (part: string): string => {
    const [path, query = ''] = part.split('?');
    const params = new URLSearchParams(query);
    if (params.get('smartPlay') !== '1') {
        params.set('smartPlay', '1');
    }
    return `${path}?${params.toString()}`;
};

export const withSmartPlay = (href?: string | null): string | null => {
    if (typeof href !== 'string' || href.length === 0) {
        return null;
    }
    const hashIndex = href.indexOf('#');
    if (hashIndex >= 0) {
        return `${href.slice(0, hashIndex)}#${appendToPart(href.slice(hashIndex + 1))}`;
    }
    return appendToPart(href);
};

export const smartPlayDeepLink = (deepLinks?: PlaybackDeepLinks | null): string | null => {
    if (!deepLinks) {
        return null;
    }
    const target = deepLinks.metaDetailsStreams ?? deepLinks.metaDetailsVideos ?? deepLinks.player;
    return withSmartPlay(target);
};

export const buildMetaDetailsSmartPlayPath = (
    type?: string | null,
    id?: string | null,
    videoId?: string | null,
    targetHeight?: number,
    skipKey?: string | null,
    retryToken?: string | null,
): string | null => {
    if (typeof type !== 'string' || typeof id !== 'string' || type.length === 0 || id.length === 0) {
        return null;
    }
    const params = new URLSearchParams({ smartPlay: '1' });
    if (typeof targetHeight === 'number' && targetHeight > 0) {
        params.set('targetHeight', `${targetHeight}`);
    }
    if (typeof skipKey === 'string' && skipKey.length > 0) {
        params.set('skipKey', skipKey);
    }
    if (typeof retryToken === 'string' && retryToken.length > 0) {
        params.set('retry', retryToken);
    }
    const videoPart = typeof videoId === 'string' && videoId.length > 0
        ? `/${encodeURIComponent(videoId)}`
        : '';
    return `/detail/${encodeURIComponent(type)}/${encodeURIComponent(id)}${videoPart}?${params.toString()}`;
};
