// Copyright (C) 2017-2025 Smart code 203358507

import React from 'react';

const RouteFocusedContext = React.createContext(true);

export const useRouteActive = () => {
    return React.useContext(RouteFocusedContext);
};

const useRouteFocused = () => {
    const routeActive = useRouteActive();
    const [isFocused, setIsFocused] = React.useState(document.hasFocus());

    React.useEffect(() => {
        const handleFocus = () => setIsFocused(true);
        const handleBlur = () => setIsFocused(false);

        window.addEventListener('focus', handleFocus);
        window.addEventListener('blur', handleBlur);

        // catch focus changes that happened before the listeners were attached
        setIsFocused(document.hasFocus());

        return () => {
            window.removeEventListener('focus', handleFocus);
            window.removeEventListener('blur', handleBlur);
        };
    }, []);

    return routeActive && isFocused;
};

export const RouteFocusedProvider = RouteFocusedContext.Provider;

export default useRouteFocused;
