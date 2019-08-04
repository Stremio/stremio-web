
const { useFocusable } = require('stremio-navigation');

const useTabIndex = (tabIndex, disabled) => {
    const focusable = useFocusable();
    return (tabIndex === null || isNaN(tabIndex)) ?
        (focusable && !disabled ? 0 : -1)
        :
        tabIndex;
};

module.exports = useTabIndex;
