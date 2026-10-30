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

export const MIN_SCALE = 0.03;
export const MAX_SCALE = 0.3;
const ZOOM_STEP = 1.5;

const clampScale = (scale: number) => Math.min(MAX_SCALE, Math.max(MIN_SCALE, scale));

const useGuide = ({ programmes, selected, isMobile, onSelect }: Options) => {
    const [view, setView] = useState<GuideView>(isMobile ? 'agenda' : 'timeline');
    const [nowToken, setNowToken] = useState(0);
    const [fitToken, setFitToken] = useState(0);
    const [scale, setScale] = useState(isMobile ? 0.0625 : 0.072);
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

    const onZoomIn = useCallback(() => {
        setScale((scale) => clampScale(scale * ZOOM_STEP));
    }, []);

    const onZoomOut = useCallback(() => {
        setScale((scale) => clampScale(scale / ZOOM_STEP));
    }, []);

    const onFit = useCallback(() => {
        setFitToken((token) => token + 1);
    }, []);

    const onScale = useCallback((value: number) => {
        setScale(clampScale(value));
    }, []);

    return {
        view,
        nowToken,
        fitToken,
        scale,
        canPrevious,
        canNext,
        canZoomIn: scale < MAX_SCALE,
        canZoomOut: scale > MIN_SCALE,
        onViewSelect,
        onPrevious,
        onNext,
        onNow,
        onZoomIn,
        onZoomOut,
        onFit,
        onScale,
    };
};

export default useGuide;
