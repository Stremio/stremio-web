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
    var parser = new VTTJS.WebVTT.Parser(window, VTTJS.WebVTT.StringDecoder());
    var cues = [];
    var cuesByTime = {};
    parser.oncue = function(c) {
        var cue = Object.freeze({
            startTime: (c.startTime * 1000) | 0,
            endTime: (c.endTime * 1000) | 0,
            text: c.text
        });
        cues.push(cue);
        cuesByTime[cue.startTime] = cuesByTime[cue.startTime] || [];
        cuesByTime[cue.endTime] = cuesByTime[cue.endTime] || [];
    };
    parser.parse(text);
    parser.flush();
    global.VTTCue = nativeVTTCue;
    cuesByTime.times = Object.keys(cuesByTime)
        .map(function(time) {
            return parseInt(time);
        })
        .sort(function(t1, t2) {
            return t1 - t2;
        });
    Object.freeze(cues);
    Object.freeze(cuesByTime);
    Object.freeze(cuesByTime.times);
    for (var i = 0; i < cues.length; i++) {
        cuesByTime[cues[i].startTime].push(cues[i]);
        var startTimeIndex = binarySearchUpperBound(cuesByTime.times, cues[i].startTime);
        for (var j = startTimeIndex + 1; j < cuesByTime.times.length; j++) {
            if (cues[i].endTime <= cuesByTime.times[j]) {
                break;
            }

            cuesByTime[cuesByTime.times[j]].push(cues[i]);
        }
    }

    for (var i = 0; i < cuesByTime.times.length; i++) {
        cuesByTime[cuesByTime.times[i]].sort(function(c1, c2) {
            return c1.startTime - c2.startTime ||
                c1.endTime - c2.endTime;
        });

        Object.freeze(cuesByTime[cuesByTime.times[i]]);
    }

    return cuesByTime;
}

function cuesForTime(cuesByTime, time) {
    var index = binarySearchUpperBound(cuesByTime.times, time);
    return index !== -1 ? cuesByTime[cuesByTime.times[index]] : Object.freeze([]);
}

function render(text) {
    return VTTJS.WebVTT.convertCueToDOMTree(window, text);
}

module.exports = Object.freeze({
    parse: parse,
    cuesForTime: cuesForTime,
    render: render
});
