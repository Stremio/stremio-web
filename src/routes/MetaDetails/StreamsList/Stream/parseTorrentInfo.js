const parseTorrent = (description) => {
    const isEmoji = (str) => {
        const emojiRegex = /[\uD83C][\uDDE6-\uDDFF][\uD83C][\uDDE6-\uDDFF]/g;
        return [...str.matchAll(emojiRegex)];
    };
    const streamName = description.split(/\u{1F464}/u)[0].trim();

    const seedersMatch = description.match(/\u{1F464}\s(\d+)/u);
    const streamSeeders = seedersMatch ? parseInt(seedersMatch[1]) : null;

    const sizeMatch = description.match(/(?<=\uD83D\uDCBE).*?(?=\u2699\uFE0F?)/);
    const streamSize = sizeMatch ? sizeMatch[0] : null;

    const providerMatch = description.match(/\u2699\uFE0F\s(\S+?)\s/);

    const streamProvider = providerMatch ? providerMatch[1].trim() : null;

    const flagMatches = isEmoji(description);
    let streamFlags = '';
    for (const match of flagMatches) {
        streamFlags += match[0];
    }

    const torrentInfo = {
        streamName,
        streamSeeders,
        streamSize,
        streamProvider,
        streamFlags
    };

    return torrentInfo;
};

module.exports = parseTorrent;

