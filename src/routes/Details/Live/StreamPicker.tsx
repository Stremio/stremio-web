// Copyright (C) 2017-2026 Smart code 203358507

import React from 'react';
import { useTranslation } from 'react-i18next';
import BottomSheet from 'stremio/components/BottomSheet';
import StreamGroups from './StreamGroups';

type Props = {
    open: boolean,
    streams: MetaDetails['streams'],
    live: boolean,
    programmeTitle: string | null,
    channelName: string,
    onClose: () => void,
};

const StreamPicker = ({ open, streams, live, programmeTitle, channelName, onClose }: Props) => {
    const { t } = useTranslation();

    return (
        <BottomSheet
            title={t('STREAMS')}
            show={open}
            onCloseRequest={onClose}
            closeOnContentClick={false}
            closeOnOrientationChange={false}
        >
            <StreamGroups
                streams={streams}
                live={live}
                programmeTitle={programmeTitle}
                channelName={channelName}
                onClose={onClose}
            />
        </BottomSheet>
    );
};

export default StreamPicker;
