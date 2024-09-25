// Copyright (C) 2017-2023 Smart code 203358507

let supportsVideoVolume = true;

// on iOS Safari, the video volume is always 1, regardless of what is being set
module.exports = function useSupportsVideoVolume() {
    return supportsVideoVolume;
};

const vid = document.createElement('video');
vid.volume = 0;

setTimeout(() => {
    if (vid.volume !== 0) {
        supportsVideoVolume = false;
    }

    vid.remove();
}, 0);
