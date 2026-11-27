// Copyright (C) 2017-2026 Smart code 203358507

import { useMemo } from 'react';

const useLiveChannel = (type: string | undefined, details: MetaDetails, metaItem: MetaItemMetaDetails | null, addons: Addon[]) => {
    const addonUrl = details.metaItem?.addon.transportUrl;
    const isEpgProvider = useMemo(() => {
        return addons.some((addon) => addon.transportUrl === addonUrl && addon.manifest.behaviorHints?.epgProvider === true);
    }, [addons, addonUrl]);
    const loading = type === 'tv' && (details.selected === null || (isEpgProvider && details.metaItem?.content.type === 'Loading'));
    const channel = isEpgProvider && metaItem !== null && (metaItem.behaviorHints?.isLive === true || metaItem.type === 'tv') ? metaItem : null;

    return { loading, channel };
};

export default useLiveChannel;
