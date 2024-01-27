// Copyright (C) 2017-2023 Smart code 203358507

const useModelState = require('stremio/common/useModelState');

const map = (ctx) => ctx.notifications;

const useNotifications = () => {
    return useModelState({ model: 'ctx', map });
};

module.exports = useNotifications;
