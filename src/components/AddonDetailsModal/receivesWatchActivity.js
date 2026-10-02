// Copyright (C) 2017-2026 Smart code 203358507

const WATCH_ACTIVITY_RESOURCES = ['player', 'library'];

const receivesWatchActivity = (manifest) => manifest.resources.some((resource) => {
    return WATCH_ACTIVITY_RESOURCES.includes(typeof resource === 'string' ? resource : resource.name);
});

module.exports = receivesWatchActivity;
