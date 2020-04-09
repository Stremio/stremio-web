// Copyright (C) 2017-2020 Smart code 203358507

function padWithZero(str) {
    return ('0' + str).slice(-2);
}

function rgbaToHex(rgbaString) {
    var values = rgbaString.split('(')[1].split(')')[0].split(',');
    var red = parseInt(values[0]).toString(16);
    var green = parseInt(values[1]).toString(16);
    var blue = parseInt(values[2]).toString(16);
    var alpha = Math.round((values[3] || 1) * 255).toString(16);
    return '#' + padWithZero(red) + padWithZero(green) + padWithZero(blue) + padWithZero(alpha);
}

module.exports = {
    rgbaToHex
};
