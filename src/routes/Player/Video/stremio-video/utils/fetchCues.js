var VTTJS = require('vtt.js');

module.exports = function(url) {
    return new Promise(function(resolve) {
        var nativeVTTCue = VTTCue;
        global.VTTCue = VTTJS.VTTCue;
        var cues = [];
        var parser = new VTTJS.WebVTT.Parser(window, VTTJS.WebVTT.StringDecoder());
        parser.oncue = function(cue) {
            cues.push({
                startTime: cue.startTime,
                endTime: cue.endTime,
                text: cue.text
            });
        };
        parser.parse(demoText);
        parser.flush();
        cues = cues.sort(function(c1, c2) {
            return c1.endTime - c2.endTime ||
                c2.startTime - c1.startTime;
        });
        global.VTTCue = nativeVTTCue;
        resolve(cues);
    });
};

var demoText = `WEBVTT

00:00:20.000 --> 00:00:40.000
20-40

00:00:05.000 --> 00:00:10.000
5-10

00:00:02.000 --> 00:00:10.000
2-10

00:00:00.000 --> 00:00:10.000
0-10

00:00:00.000 --> 00:00:20.000
0-20

00:00:00.000 --> 00:00:38.000
0-38

00:00:00.000 --> 00:00:15.000
0-15

00:00:50.000 --> 00:05:55.000
50-5:55

00:02:50.000 --> 00:04:55.000
2:50-4:55

00:00:50.000 --> 00:01:55.000
50-1:55
`;
