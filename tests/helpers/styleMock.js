// Copyright (C) 2017-2026 Smart code 203358507

module.exports = new Proxy(
    {},
    {
        get: (_target, prop) => (prop === '__esModule' ? false : prop),
    }
);
