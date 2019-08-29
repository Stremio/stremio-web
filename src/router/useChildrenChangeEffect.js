const React = require('react');

const useChildrenChangeEffect = (parent, children) => {
    React.useEffect(() => {
        if (parent instanceof HTMLElement) {
            parent.dispatchEvent(new CustomEvent('childrenchange', {
                bubbles: false,
                cancelable: false
            }));
        }
    }, [parent, children]);
};

module.exports = useChildrenChangeEffect;
