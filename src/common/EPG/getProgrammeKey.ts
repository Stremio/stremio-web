// Copyright (C) 2017-2026 Smart code 203358507

import type { EPGProgram } from 'stremio/common/EPG';

const getProgrammeKey = (programme: EPGProgram) => programme.id ?? `${programme.channelId}:${programme.startTime.getTime()}`;

export default getProgrammeKey;
