module.exports = function(cues, time) {
    var timeInSeconds = time / 1000;
    var cuesForTime = [];
    var middleCueIndex = -1;
    var left = 0;
    var right = cues.length - 1;
    while (left <= right) {
        var middle = Math.floor((left + right) / 2);
        if (cues[middle].endTime < timeInSeconds) {
            left = middle + 1;
        } else if (cues[middle].startTime > timeInSeconds) {
            right = middle - 1;
        } else {
            middleCueIndex = middle;
            break;
        }
    }

    if (middleCueIndex !== -1) {
        cuesForTime.push(cues[middleCueIndex]);
        for (var i = middleCueIndex - 1; i >= 0; i--) {
            if (cues[i].startTime > timeInSeconds || cues[i].endTime < timeInSeconds) {
                break;
            }

            cuesForTime.push(cues[i]);
        }

        for (var i = middleCueIndex + 1; i < cues.length; i++) {
            if (cues[i].startTime > timeInSeconds || cues[i].endTime < timeInSeconds) {
                break;
            }

            cuesForTime.push(cues[i]);
        }
    }

    return cuesForTime.sort(function(c1, c2) {
        return c1.startTime - c2.startTime ||
            c1.endTime - c2.endTime;
    });
};
