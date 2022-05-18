const isChildVisible = (container, element, threshold) => {
    const elementTop = element.offsetTop;
    const elementBottom = element.offsetTop + element.clientHeight;
    const containerTop = container.scrollTop - threshold;
    const containerBottom = container.scrollTop + container.clientHeight + threshold;
    return (elementTop >= containerTop && elementBottom <= containerBottom) ||
        (elementTop < containerTop && containerTop < elementBottom) ||
        (elementTop < containerBottom && containerBottom < elementBottom);
};

const getVisibleChildrenRange = (container, threshold) => {
    return Array.from(container.children).reduce((result, child, index) => {
        if (isChildVisible(container, child, threshold)) {
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
