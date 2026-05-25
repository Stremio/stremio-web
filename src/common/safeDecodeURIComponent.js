// Copyright (C) 2017-2026 Smart code 203358507

const safeDecodeURIComponent = (value) => {
    try {
        return decodeURIComponent(value);
    } catch (_) {
        return value;
    }
};

module.exports = safeDecodeURIComponent;
