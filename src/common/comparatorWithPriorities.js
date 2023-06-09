// Copyright (C) 2017-2023 Smart code 203358507

const comparatorWithPriorities = (priorities) => {
    return (a, b) => {
        if (isNaN(priorities[a]) && isNaN(priorities[b])) {
            return a.localeCompare(b);
        } else if (isNaN(priorities[a])) {
            if (priorities[b] === Number.NEGATIVE_INFINITY) {
                return -1;
            } else {
                return 1;
            }
        } else if (isNaN(priorities[b])) {
            if (priorities[a] === Number.NEGATIVE_INFINITY) {
                return 1;
            } else {
                return -1;
            }
        } else {
            return priorities[b] - priorities[a];
        }
    };
};

module.exports = comparatorWithPriorities;
