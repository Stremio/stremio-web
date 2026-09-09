// Copyright (C) 2017-2026 Smart code 203358507

import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useCore } from 'stremio/core';
import BottomSheet from 'stremio/components/BottomSheet';
import ActionButton from 'stremio/components/MetaPreview/ActionButton';
import ModalDialog from 'stremio/components/ModalDialog';
import useMediaQuery from 'stremio/common/useMediaQuery';
import { XSMALL_WIDTH } from 'stremio/common/screenSizes';
import Stream from '../StreamsList/Stream';
import styles from './LiveTvActions.less';

type Props = {
    streams: MetaDetails['streams'];
    inLibrary: boolean;
    onToggleLibrary: () => void;
    onShowDetails?: () => void;
};

const LiveTvActions = ({ streams, inLibrary, onToggleLibrary, onShowDetails }: Props) => {
    const { t } = useTranslation();
    const core = useCore();
    const isMobile = useMediaQuery(`(max-width: ${XSMALL_WIDTH}px)`);
    const [streamsOpen, setStreamsOpen] = useState(false);
    const readyStreams = streams.flatMap((resource) => resource.content.type === 'Ready'
        ? resource.content.content.map((stream) => ({ stream, addonName: resource.addon.manifest.name })) : []);
    const loading = streams.some((resource) => resource.content.type === 'Loading');
    const soleStream = readyStreams.length === 1 ? readyStreams[0] : null;
    const watchLabel = t('LIVE_TV_WATCH_LIVE', { defaultValue: 'Watch live' });
    const optionsLabel = t('LIVE_TV_PLAYBACK_OPTIONS', { defaultValue: 'Playback options' });
    const streamOptions = <div className={styles['stream-options']}>
        {readyStreams.map(({ stream, addonName }, index) => <Stream
            key={index}
            addonName={addonName}
            name={stream.name || addonName}
            description={stream.description}
            progress={null}
            deepLinks={stream.deepLinks}
            onClick={() => {
                setStreamsOpen(false);
                core.transport.analytics({ event: 'StreamClicked', args: { stream } });
            }}
        />)}
    </div>;

    return (
        <div className={styles['playback']}>
            {soleStream ? <Stream
                className={styles['action-button']}
                compact={true}
                addonName={soleStream.addonName}
                name={watchLabel}
                description={soleStream.addonName}
                progress={null}
                deepLinks={soleStream.stream.deepLinks}
                onClick={() => core.transport.analytics({ event: 'StreamClicked', args: { stream: soleStream.stream } })}
            /> : readyStreams.length > 1 ? <ActionButton className={styles['action-button']} icon={'play'} label={watchLabel} variant={'wide'} role={'button'} onClick={() => setStreamsOpen(true)} aria-haspopup={'dialog'} />
                : <div className={styles['stream-message']} role={'status'}>{loading ? t('STREAM_LOADING') : t('NO_STREAM')}</div>}
            <ActionButton
                className={styles['action-button']}
                icon={inLibrary ? 'remove-from-library' : 'add-to-library'}
                label={inLibrary ? t('REMOVE_FROM_LIB') : t('ADD_TO_LIB')}
                variant={'icon'}
                tooltip={true}
                role={'button'}
                onClick={onToggleLibrary}
            />
            {onShowDetails && <ActionButton className={styles['action-button']} icon={'details'} label={t('LIBRARY_DETAILS')} variant={'icon'} tooltip={true} role={'button'} onClick={onShowDetails} />}
            {isMobile ? <BottomSheet
                className={styles['streams-sheet']}
                title={optionsLabel}
                show={streamsOpen}
                onCloseRequest={() => setStreamsOpen(false)}
                closeOnContentClick={false}
                closeOnOrientationChange={false}
            >
                {streamOptions}
            </BottomSheet> : streamsOpen && <ModalDialog className={styles['streams-modal']} title={optionsLabel} onCloseRequest={() => setStreamsOpen(false)} role={'dialog'} aria-modal={'true'} aria-label={optionsLabel}>
                {streamOptions}
            </ModalDialog>}
        </div>
    );
};

export default LiveTvActions;
