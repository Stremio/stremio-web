// Copyright (C) 2017-2026 Smart code 203358507

import React, { useCallback, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import type { EPGProgram } from 'stremio/common/EPG';
import Message from '../../Message';
import getProgrammeKey from '../getProgrammeKey';
import Agenda from './Agenda';
import Timeline from './Timeline';
import type { GuideView } from './useGuide';
import { getScrollParent } from './scroll';

type Props = {
    view: GuideView,
    programmes: EPGProgram[],
    now: number,
    selectedKey: string | null,
    nowToken: number,
    fitToken: number,
    scale: number,
    isMobile: boolean,
    onSelect: (programme: EPGProgram) => void,
    onScale: (scale: number) => void,
    onCurrentVisible: (visible: boolean) => void,
};

const GuideBody = ({ view, programmes, now, selectedKey, nowToken, fitToken, scale, isMobile, onSelect, onScale, onCurrentVisible }: Props) => {
    const { t } = useTranslation();
    const containerRef = useRef<HTMLDivElement>(null);
    const current = programmes.find((programme) => programme.startTime.getTime() <= now && programme.endTime.getTime() > now);
    const currentKey = current !== undefined ? getProgrammeKey(current) : null;

    useEffect(() => {
        const container = containerRef.current;
        const item = container?.querySelector<HTMLElement>('[aria-current="true"]');
        if (!isMobile || !item) {
            onCurrentVisible(true);
            return;
        }

        const top = parseFloat(window.getComputedStyle(item).scrollMarginTop) || 0;
        const observer = new IntersectionObserver(([entry]) => onCurrentVisible(entry.isIntersecting), {
            root: getScrollParent(container),
            rootMargin: `-${top}px 0px 0px 0px`,
        });
        observer.observe(item);
        return () => observer.disconnect();
    }, [view, currentKey, isMobile, onCurrentVisible]);

    const onKeySelect = useCallback((key: string) => {
        const programme = programmes.find((programme) => getProgrammeKey(programme) === key);
        if (programme) {
            onSelect(programme);
        }
    }, [programmes, onSelect]);

    if (programmes.length === 0) {
        return <Message label={t('LIVE_TV_NO_SCHEDULE')} />;
    }

    const body = view === 'agenda' ?
        <Agenda
            programmes={programmes}
            now={now}
            selectedKey={selectedKey}
            nowToken={nowToken}
            isMobile={isMobile}
            onSelect={onKeySelect}
        />
        :
        <Timeline
            programmes={programmes}
            now={now}
            selectedKey={selectedKey}
            nowToken={nowToken}
            fitToken={fitToken}
            scale={scale}
            onSelect={onKeySelect}
            onScale={onScale}
        />;

    return <div ref={containerRef}>{body}</div>;
};

export default GuideBody;
