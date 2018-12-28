module.exports = function(cues, time) {
    var cuesForTime = [];
    var middleCueIndex = -1;
    var left = 0;
    var right = cues.length - 1;
    while (left <= right) {
        var middle = Math.floor((left + right) / 2);
        if (cues[middle].endTime < time) {
            left = middle + 1;
        } else if (cues[middle].startTime > time) {
            right = middle - 1;
        } else {
            middleCueIndex = middle;
            break;
        }
    }

    if (middleCueIndex !== -1) {
        cuesForTime.push(cues[middleCueIndex]);
        for (var i = cueIndex - 1; i >= 0; i--) {
            if (cues[i].startTime > time || cues[i].endTime < time) {
                break;
            }

            cuesForTime.push(cues[i]);
        }

        for (var i = cueIndex + 1; i < cues.length; i++) {
            if (cues[i].startTime > time || cues[i].endTime < time) {
                break;
            }

            cuesForTime.push(cues[i]);
        }
    }

    return cuesForTime;
};
//TODO sort the result