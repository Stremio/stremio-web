// Copyright (C) 2017-2023 Smart code 203358507

import type { MutableRefObject } from 'react';

declare function useLiveRef<T>(value: T): MutableRefObject<T>;

export = useLiveRef;
