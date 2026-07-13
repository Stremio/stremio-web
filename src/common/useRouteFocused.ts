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

        // focus may have changed between the initial render and this effect
        // running; without re-reading it here a focus event fired in that gap
        // is lost and the app never subscribes to model state updates
        setIsFocused(document.hasFocus());

        return () => {
            window.removeEventListener('focus', handleFocus);
            window.removeEventListener('blur', handleBlur);
        };
    }, []);

    return routeFocused && isFocused;
};

export const RouteFocusedProvider = RouteFocusedContext.Provider;

export default useRouteFocused;
