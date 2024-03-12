// Copyright (C) 2017-2023 Smart code 203358507

const formatUnit = (value) => {
    return ('0' + value).slice(-1 * Math.max(value.toString().length, 2));
};

const formatTime = (time, prefix = '') => {
    if (time === null || isNaN(time)) {
        return '--:--:--';
    }

    const hours = Math.floor(time / (1000 * 60 * 60));
    const minutes = Math.floor((time / (1000 * 60)) % 60);
    const seconds = Math.floor((time / 1000) % 60);
    return `${formatUnit(hours)}:${formatUnit(minutes)}:${formatUnit(seconds)}${prefix}`;
};

module.exports = formatTime;
