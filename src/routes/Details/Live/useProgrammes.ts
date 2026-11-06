// Copyright (C) 2017-2026 Smart code 203358507

import { useMemo } from 'react';
import { EPGChannel, EPGProgram, toEpgProgram } from 'stremio/common/EPG';

const useProgrammes = (meta: MetaItemMetaDetails, now: number) => {
    const channel = useMemo<EPGChannel>(() => ({
        id: meta.id,
        type: meta.type,
        name: meta.name,
        logo: meta.logo ?? meta.poster,
        deepLinks: meta.deepLinks,
    }), [meta.id, meta.type, meta.name, meta.logo, meta.poster, meta.deepLinks]);

    const programmes = useMemo(() => {
        return meta.videos
            .map((video) => toEpgProgram(video, channel))
            .filter((programme): programme is EPGProgram => programme !== null)
            .sort((a, b) => a.startTime.getTime() - b.startTime.getTime());
    }, [meta.videos, channel]);

    const current = useMemo(() => {
        return programmes.find((programme) => programme.startTime.getTime() <= now && now < programme.endTime.getTime()) ?? null;
    }, [programmes, now]);

    return { channel, programmes, current };
};

export default useProgrammes;
