// Copyright (C) 2017-2026 Smart code 203358507

export type EPGChannel = {
    id: string;
    type: string;
    name: string;
    logo: string | null;
    deepLinks?: MetaItemDeepLinks;
};

export type EPGProgram = {
    id?: string;
    title: string;
    overview: string | null;
    thumbnail?: string | null;
    links?: Link[];
    runtime?: string | null;
    releaseInfo?: string | null;
    released?: string | null;
    genres?: string[];
    cast?: string[];
    directors?: string[];
    startTime: Date;
    endTime: Date;
    channelId: string;
    channelName: string;
    channelLogo: string | null;
    deepLinks?: MetaItemDeepLinks | VideoDeepLinks;
    raw: Record<string, unknown>;
};
