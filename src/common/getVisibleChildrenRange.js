// Copyright (C) 2017-2023 Smart code 203358507

const isChildVisible = (container, element) => {
    const elementTop = element.offsetTop;
    const elementBottom = element.offsetTop + element.clientHeight;
    const containerTop = container.scrollTop;
    const containerBottom = container.scrollTop + container.clientHeight;
    return (elementTop >= containerTop && elementBottom <= containerBottom) ||
        (elementTop < containerTop && containerTop < elementBottom) ||
        (elementTop < containerBottom && containerBottom < elementBottom);
};

const getVisibleChildrenRange = (container) => {
    return Array.from(container.children).reduce((result, child, index) => {
        if (isChildVisible(container, child)) {
            if (result === null) {
                result = {
                    start: index,
                    end: index
                };
            } else {
                result.end = index;
            }
        }

        return result;
    }, null);
};

module.exports = getVisibleChildrenRange;
