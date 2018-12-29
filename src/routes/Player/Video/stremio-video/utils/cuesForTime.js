module.exports = function(cues, time) {
    var cuesForTime = [];
    var cueBoundTimes = Object.keys(cues).map(function(time) {
        return parseInt(time);
    });
    var left = 0;
    var right = cueBoundTimes.length - 1;
    var index = -1;
    while (left <= right) {
        var middle = Math.floor((left + right) / 2);
        if (cueBoundTimes[middle] < time) {
            left = middle + 1;
        } else if (cueBoundTimes[middle] > time) {
            right = middle - 1;
        } else {
            index = middle;
            left = middle + 1;
        }
    }

    if (index !== -1) {
        cuesForTime = cues[cueBoundTimes[index]];
    }

    return cuesForTime.sort(function(c1, c2) {
        return c1.startTime - c2.startTime ||
            c1.endTime - c2.endTime;
    });
};
