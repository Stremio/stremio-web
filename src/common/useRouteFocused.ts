// Copyright (C) 2017-2025 Smart code 203358507

import React from 'react';

const RouteFocusedContext = React.createContext(true);

const useRouteFocused = () => {
    const routeFocused = React.useContext(RouteFocusedContext);
    const [isFocused, setIsFocused] = React.useState(document.hasFocus());

    React.useEffect(() => {
        const handleFocus = () => setIsFocused(true);
        const handleBlur = () => setIsFocused(false);

        window.addEventListener('focus', handleFocus);
        window.addEventListener('blur', handleBlur);

        return () => {
            window.removeEventListener('focus', handleFocus);
            window.removeEventListener('blur', handleBlur);
        };
    }, []);

    return routeFocused && isFocused;
};

export const RouteFocusedProvider = RouteFocusedContext.Provider;

export default useRouteFocused;
