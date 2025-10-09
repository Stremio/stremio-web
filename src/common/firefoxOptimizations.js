// Copyright (C) 2017-2023 Smart code 203358507

const Bowser = require('bowser');

const isFirefox = () => {
    const browser = Bowser.parse(window.navigator?.userAgent || '');
    return browser?.browser?.name === 'Firefox';
};

const isLinux = () => {
    const browser = Bowser.parse(window.navigator?.userAgent || '');
    return browser?.os?.name === 'Linux';
};

const applyFirefoxOptimizations = () => {
    if (!isFirefox()) return;

    // Force hardware acceleration for video elements
    const style = document.createElement('style');
    style.textContent = `
        video {
            transform: translateZ(0) !important;
            will-change: transform !important;
            backface-visibility: hidden !important;
        }
        
        /* Optimize rendering layers for Firefox */
        .video-container {
            transform: translateZ(0) !important;
            will-change: transform !important;
        }
        
        /* Reduce repaints during playback */
        .player-container {
            contain: layout style paint !important;
        }
        
        /* Optimize subtitles rendering */
        .subtitles-container {
            transform: translateZ(0) !important;
            will-change: opacity, transform !important;
        }
    `;
    document.head.appendChild(style);

    // Disable smooth scrolling for better performance
    if (isLinux()) {
        document.documentElement.style.scrollBehavior = 'auto';
    }
};

const optimizeVideoElement = (videoElement) => {
    if (!isFirefox() || !videoElement) return;

    // Firefox-specific video optimizations
    videoElement.style.transform = 'translateZ(0)';
    videoElement.style.willChange = 'transform';
    videoElement.style.backfaceVisibility = 'hidden';

    // Disable picture-in-picture for better performance
    if ('disablePictureInPicture' in videoElement) {
        videoElement.disablePictureInPicture = true;
    }

    // Optimize buffering
    if (videoElement.buffered && videoElement.buffered.length > 0) {
        videoElement.preload = 'metadata';
    }
};

module.exports = {
    isFirefox,
    isLinux,
    applyFirefoxOptimizations,
    optimizeVideoElement
};
