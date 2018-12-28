module.exports = function(cues, time) {
    var timeInSeconds = time / 1000;
    var cuesForTime = [];
    var left = 0;
    var right = cues.length - 1;
    var lastCueIndex = -1;
    while (left <= right) {
        var middle = Math.floor((left + right) / 2);
        if (cues[middle].startTime === timeInSeconds) {
            lastCueIndex = middle;
            left = middle + 1;
        } else if (cues[middle].startTime > timeInSeconds) {
            right = middle - 1;
        } else {
            left = middle + 1;
        }
    }

    var cueIndex = lastCueIndex !== -1 ? lastCueIndex : right;
    while (cueIndex >= 0) {
        if (cues[cueIndex].startTime > timeInSeconds || cues[cueIndex].endTime < timeInSeconds) {
            break;
        }

        cuesForTime.push(cues[cueIndex]);
        cueIndex--;
    }

    return cuesForTime.sort(function(c1, c2) {
        return c1.startTime - c2.startTime ||
            c1.endTime - c2.endTime;
    });
};
