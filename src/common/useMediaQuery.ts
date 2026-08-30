// Copyright (C) 2017-2026 Smart code 203358507

import { useEffect, useState } from 'react';

const useMediaQuery = (query: string): boolean => {
    const [matches, setMatches] = useState(() => (
        typeof window !== 'undefined' && window.matchMedia(query).matches
    ));

    useEffect(() => {
        const mediaQuery = window.matchMedia(query);
        const onChange = () => {
            setMatches(mediaQuery.matches);
        };

        onChange();
        mediaQuery.addEventListener('change', onChange);

        return () => {
            mediaQuery.removeEventListener('change', onChange);
        };
    }, [query]);

    return matches;
};

export default useMediaQuery;
