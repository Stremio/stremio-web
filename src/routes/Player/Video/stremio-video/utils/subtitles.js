var VTTJS = require('vtt.js');

function binarySearchUpperBound(array, value) {
    if (value < array[0] || array[array.length - 1] < value) {
        return -1;
    }

    var left = 0;
    var right = array.length - 1;
    var index = -1;
    while (left <= right) {
        var middle = Math.floor((left + right) / 2);
        if (array[middle] > value) {
            right = middle - 1;
        } else if (array[middle] < value) {
            left = middle + 1;
        } else {
            index = middle;
            left = middle + 1;
        }
    }

    return index !== -1 ? index : right;
}

function parse(text) {
    var nativeVTTCue = VTTCue;
    global.VTTCue = VTTJS.VTTCue;
    var cues = [];
    var cuesForTime = {};
    var parser = new VTTJS.WebVTT.Parser(window, VTTJS.WebVTT.StringDecoder());
    parser.oncue = function(c) {
        var cue = {
            startTime: c.startTime * 1000,
            endTime: c.endTime * 1000,
            text: c.text
        };
        cues.push(cue);
        cuesForTime[cue.startTime] = cuesForTime[cue.startTime] || [];
        cuesForTime[cue.endTime] = cuesForTime[cue.endTime] || [];
    };
    parser.parse(text);
    parser.flush();
    cuesForTime.times = Object.keys(cuesForTime)
        .map(function(time) {
            return parseInt(time);
        })
        .sort(function(t1, t2) {
            return t1 - t2;
        });
    for (var i = 0; i < cues.length; i++) {
        cuesForTime[cues[i].startTime].push(cues[i]);
        var startTimeIndex = binarySearchUpperBound(cuesForTime.times, cues[i].startTime);
        for (var j = startTimeIndex + 1; j < cuesForTime.times.length; j++) {
            if (cues[i].endTime <= cuesForTime.times[j]) {
                break;
            }

            cuesForTime[cuesForTime.times[j]].push(cues[i]);
        }
    }
    for (var i = 0; i < cuesForTime.times.length; i++) {
        cuesForTime[cuesForTime.times[i]].sort(function(c1, c2) {
            return c1.startTime - c2.startTime ||
                c1.endTime - c2.endTime;
        });
    }
    global.VTTCue = nativeVTTCue;
    return cuesForTime;
}

function cuesForTime(cues, time) {
    var index = binarySearchUpperBound(cues.times, time);
    return index !== -1 ? cues[cues.times[index]] : [];
}

function render(cue) {
    return VTTJS.WebVTT.convertCueToDOMTree(window, cue.text);
}

module.exports = {
    parse,
    cuesForTime,
    render
};
