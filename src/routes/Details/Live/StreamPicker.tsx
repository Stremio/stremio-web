// Copyright (C) 2017-2026 Smart code 203358507

import React from 'react';
import { useTranslation } from 'react-i18next';
import BottomSheet from 'stremio/components/BottomSheet';
import ModalDialog from 'stremio/components/ModalDialog';
import StreamGroups from './StreamGroups';
import styles from './StreamPicker.less';

type Props = {
    open: boolean,
    isMobile: boolean,
    streams: MetaDetails['streams'],
    live: boolean,
    programmeTitle: string | null,
    channelName: string,
    onClose: () => void,
};

const StreamPicker = ({ open, isMobile, streams, live, programmeTitle, channelName, onClose }: Props) => {
    const { t } = useTranslation();
    const groups = (
        <StreamGroups
            streams={streams}
            live={live}
            programmeTitle={programmeTitle}
            channelName={channelName}
            onClose={onClose}
        />
    );

    if (isMobile) {
        return (
            <BottomSheet
                title={t('STREAMS')}
                show={open}
                onCloseRequest={onClose}
                closeOnContentClick={false}
                closeOnOrientationChange={false}
            >
                {groups}
            </BottomSheet>
        );
    }

    return open ?
        <ModalDialog className={styles['modal']} title={t('STREAMS')} onCloseRequest={onClose}>
            {groups}
        </ModalDialog>
        :
        null;
};

export default StreamPicker;
