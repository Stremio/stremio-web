// Copyright (C) 2017-2026 Smart code 203358507

import { useCallback, useState } from 'react';
import type { EPGProgram } from 'stremio/common/EPG';

export type GuideView = 'agenda' | 'timeline';

type Options = {
    programmes: EPGProgram[],
    selected: EPGProgram | null,
    isMobile: boolean,
    onSelect: (programme: EPGProgram | null) => void,
};

const useGuide = ({ programmes, selected, isMobile, onSelect }: Options) => {
    const [view, setView] = useState<GuideView>(isMobile ? 'agenda' : 'timeline');
    const [nowToken, setNowToken] = useState(0);
    const selectedIndex = selected !== null ? programmes.indexOf(selected) : -1;
    const canPrevious = selectedIndex > 0;
    const canNext = selectedIndex >= 0 && selectedIndex < programmes.length - 1;

    const onViewSelect = useCallback((value: string) => {
        if (value === 'agenda' || value === 'timeline') {
            setView(value);
        }
    }, []);

    const onPrevious = useCallback(() => {
        onSelect(programmes[selectedIndex - 1] ?? null);
    }, [programmes, selectedIndex, onSelect]);

    const onNext = useCallback(() => {
        onSelect(programmes[selectedIndex + 1] ?? null);
    }, [programmes, selectedIndex, onSelect]);

    const onNow = useCallback(() => {
        onSelect(null);
        setNowToken((token) => token + 1);
    }, [onSelect]);

    return { view, nowToken, canPrevious, canNext, onViewSelect, onPrevious, onNext, onNow };
};

export default useGuide;
