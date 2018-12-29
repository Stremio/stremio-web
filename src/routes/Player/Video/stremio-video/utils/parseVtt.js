var VTTJS = require('vtt.js');

function binarySearch(array, element) {
    var left = 0;
    var right = array.length - 1;
    while (left <= right) {
        var middle = Math.floor((left + right) / 2);
        if (array[middle] < element) {
            left = middle + 1;
        } else if (array[middle] > element) {
            right = middle - 1;
        } else {
            return middle;
        }
    }

    return -1;
}

module.exports = function(text) {
    var nativeVTTCue = VTTCue;
    global.VTTCue = VTTJS.VTTCue;
    var cuesTree = {};
    var cues = [];
    var parser = new VTTJS.WebVTT.Parser(window, VTTJS.WebVTT.StringDecoder());
    parser.oncue = function(cue) {
        cues.push({
            startTime: cue.startTime * 1000,
            endTime: cue.endTime * 1000,
            text: cue.text
        });
    };
    parser.parse(text);
    parser.flush();
    var cueBoundTimes = Object.keys(cuesTree).map(function(time) {
        return parseInt(time);
    });
    for (var i = 0; i < cues.length; i++) {
        var cue = cues[i];
        cuesTree[cue.startTime] = cuesTree[cue.startTime] || [];
        cuesTree[cue.startTime].push(cue);
        var startTimeBoundIndex = binarySearch(cueBoundTimes, cue.startTime);
        for (var j = startTimeBoundIndex + 1; j < cueBoundTimes.length; j++) {
            if (cue.endTime <= cueBoundTimes[j]) {
                break;
            }

            cuesTree[cueBoundTimes[j]] = cuesTree[cueBoundTimes[j]] || [];
            cuesTree[cueBoundTimes[j]].push(cue);
        }
    }

    global.VTTCue = nativeVTTCue;
    return cuesTree;
};
