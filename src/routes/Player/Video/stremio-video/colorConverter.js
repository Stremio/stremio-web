function rgbaToHex(rgbaString) {
    var values = rgbaString.split('(')[1].split(')')[0].split(',');
    var red = parseInt(values[0]).toString(16);
    var green = parseInt(values[1]).toString(16);
    var blue = parseInt(values[2]).toString(16);
    var alpha = typeof values[3] === 'string' ? Math.round(values[3] * 255).toString(16) : '00';
    return '#' + red + green + blue + alpha;
}

module.exports = {
    rgbaToHex
};
