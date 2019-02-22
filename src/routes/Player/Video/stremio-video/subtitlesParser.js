var VTTJS = require('vtt.js');
var binarySearchUpperBound = require('./binarySearchUpperBound');

function parse(text) {
    var nativeVTTCue = window.VTTCue;
    window.VTTCue = VTTJS.VTTCue;
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
    window.VTTCue = nativeVTTCue;
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

module.exports = Object.freeze({
    parse: parse
});
