// Copyright (C) 2017-2026 Smart code 203358507

import type { ComponentType } from 'react';

type LibItemProps = {
    _id?: string,
    removable?: boolean,
    progress?: number,
    notifications?: Notifications,
    watched?: boolean,
    detailsVideosFirst?: boolean,
    deepLinks?: Partial<MetaItemDeepLinks> | Partial<VideoDeepLinks>,
    optionOnSelect?: (event: any) => void,
    [key: string]: any,
};

declare const LibItem: ComponentType<LibItemProps>;

export = LibItem;
