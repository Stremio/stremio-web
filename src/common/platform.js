// Copyright (C) 2017-2022 Smart code 203358507

const userAgent = window.navigator.userAgent;
const platform = window.navigator?.userAgentData?.platform || window.navigator?.platform;
const macosPlatforms = ['Macintosh', 'MacIntel', 'MacPPC', 'Mac68K'];
const windowsPlatforms = ['Win32', 'Win64', 'Windows', 'WinCE'];
const iosPlatforms = ['iPhone', 'iPad', 'iPod'];

let name = null;

if (macosPlatforms.includes(platform)) {
    name = 'macos';
} else if (iosPlatforms.includes(platform)) {
    name = 'ios';
} else if (windowsPlatforms.includes(platform)) {
    name = 'windows';
} else if (/Android/.test(userAgent)) {
    name = 'android';
} else if (/Linux/.test(platform)) {
    name = 'linux';
}

module.exports = {
    name,
    isMobile: () => {
        return name === 'ios' || name === 'android';
    }
};
