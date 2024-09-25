// Copyright (C) 2017-2023 Smart code 203358507

const React = require('react');

const usePageFocus = () => {
    const [pageFocused, setPageFocused] = React.useState(document.hasFocus());

    React.useEffect(() => {
        const updateFocus = () => setPageFocused(document.hasFocus());

        window.addEventListener('focus', updateFocus);
        window.addEventListener('blur', updateFocus);

        return () => {
            window.removeEventListener('focus', updateFocus);
            window.removeEventListener('blur', updateFocus);
        };
    }, []);

    return pageFocused;
};

module.exports = usePageFocus;
