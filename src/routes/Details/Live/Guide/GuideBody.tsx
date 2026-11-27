// Copyright (C) 2017-2026 Smart code 203358507

import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import type { EPGProgram } from 'stremio/common/EPG';
import Message from 'stremio/components/Message';
import getProgrammeKey from 'stremio/common/EPG/getProgrammeKey';
import Agenda from 'stremio/components/Agenda';
import Timeline from './Timeline';
import type { GuideView } from './useGuide';

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
    onLiveVisible?: (visible: boolean) => void,
};

const GuideBody = ({ view, programmes, now, selectedKey, nowToken, fitToken, scale, isMobile, onSelect, onScale, onLiveVisible }: Props) => {
    const { t } = useTranslation();

    const onKeySelect = useCallback((key: string) => {
        const programme = programmes.find((programme) => getProgrammeKey(programme) === key);
        if (programme) {
            onSelect(programme);
        }
    }, [programmes, onSelect]);

    if (programmes.length === 0) {
        return <Message label={t('LIVE_TV_NO_SCHEDULE')} />;
    }

    return view === 'agenda' ?
        <Agenda
            programmes={programmes}
            now={now}
            selectedKey={selectedKey}
            nowToken={nowToken}
            isMobile={isMobile}
            onSelect={onKeySelect}
            onLiveVisible={onLiveVisible}
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
            onLiveVisible={onLiveVisible}
        />;
};

export default GuideBody;
