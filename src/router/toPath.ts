// Copyright (C) 2017-2026 Smart code 203358507

const toPath = (link: string): string => link.startsWith('#') ? link.slice(1) : link;

export default toPath;
