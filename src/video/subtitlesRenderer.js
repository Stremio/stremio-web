var VTTJS = require('vtt.js');
var binarySearchUpperBound = require('./binarySearchUpperBound');

function render(cuesByTime, time) {
    var nodes = [];
    var timeIndex = binarySearchUpperBound(cuesByTime.times, time);
    if (timeIndex !== -1) {
        var cuesForTime = cuesByTime[cuesByTime.times[timeIndex]];
        for (var i = 0; i < cuesForTime.length; i++) {
            var node = VTTJS.WebVTT.convertCueToDOMTree(window, cuesForTime[i].text);
            nodes.push(node);
        }
    }

    return Object.freeze(nodes);
}

module.exports = Object.freeze({
    render: render
});
