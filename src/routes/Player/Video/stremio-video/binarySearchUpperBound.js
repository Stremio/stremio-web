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

module.exports = binarySearchUpperBound;
