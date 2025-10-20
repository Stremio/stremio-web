// Copyright (C) 2017-2025 Smart code 203358507

const CryptoJS = require('crypto-js');

const getGravatarUrl = (email, size = 200, defaultType = 'retro', rating = 'pg') => {
    if (!email || typeof email !== 'string') {
        throw new Error('Email is required and must be a string');
    }

    // Generate proper MD5 hash as required by Gravatar
    const hash = CryptoJS.MD5(email.toLowerCase().trim()).toString();
    return `https://www.gravatar.com/avatar/${hash}?s=${size}&d=${defaultType}&r=${rating}`;
};

const getAvatarUrl = (auth, size = 200) => {
    // Anonymous user
    if (!auth) {
        // Return the webpack asset path for anonymous image
        try {
            return require('../../images/anonymous.png');
        } catch (_) {
            return '/images/anonymous.png';
        }
    }

    // Custom avatar takes priority
    if (auth.user.avatar) {
        return auth.user.avatar;
    }

    // Gravatar if email exists
    if (auth.user.email) {
        return getGravatarUrl(auth.user.email, size);
    }

    // Default avatar fallback
    try {
        return require('../../images/default_avatar.png');
    } catch (_) {
        return '/images/default_avatar.png';
    }
};

// Available Gravatar default types
const GRAVATAR_DEFAULTS = {
    MYSTERY_PERSON: 'mp',
    IDENTICON: 'identicon',
    MONSTER: 'monsterid',
    WAVATAR: 'wavatar',
    RETRO: 'retro',
    ROBOHASH: 'robohash',
    BLANK: 'blank'
};

// Available Gravatar ratings
const GRAVATAR_RATINGS = {
    G: 'g', // General - suitable for all audiences
    PG: 'pg', // Parental guidance suggested
    R: 'r', // Restricted
    X: 'x' // Adult content
};

module.exports = {
    getGravatarUrl,
    getAvatarUrl,
    GRAVATAR_DEFAULTS,
    GRAVATAR_RATINGS
};
