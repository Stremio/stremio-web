// Copyright (C) 2017-2023 Smart code 203358507

/**
 * Opens a custom URL scheme (vlc-x-callback:, outplayer:, …) on iOS.
 * window.location.assign / <a href> in PWA often rewrite schemes to https://host//path.
 */
const openAppDeepLink = (url) => {
    if (typeof url !== 'string' || url.length === 0) {
        return;
    }

    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.rel = 'noopener noreferrer';
    anchor.style.display = 'none';
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
};

const isAppDeepLink = (url) => {
    if (typeof url !== 'string' || url.length === 0) {
        return false;
    }
    return /^[a-z][a-z0-9+.-]*:/i.test(url) && !/^https?:\/\//i.test(url);
};

module.exports = openAppDeepLink;
module.exports.isAppDeepLink = isAppDeepLink;
