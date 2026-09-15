// Copyright (C) 2017-2026 Smart code 203358507

import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useCore } from 'stremio/core';
import BottomSheet from 'stremio/components/BottomSheet';
import ActionButton from 'stremio/components/MetaPreview/ActionButton';
import StreamButton from '../StreamsList/Stream';
import actionStyles from './LiveTvActions.less';
import styles from './LiveTvPlayback.less';

type Props = {
    streams: MetaDetails['streams'];
    mobile?: boolean;
};

const LiveTvPlayback = ({ streams, mobile = false }: Props) => {
    const { t } = useTranslation();
    const core = useCore();
    const [streamsOpen, setStreamsOpen] = useState(false);
    const readyStreams = streams.flatMap((resource) => resource.content.type === 'Ready'
        ? resource.content.content.map((stream) => ({ stream, addonName: resource.addon.manifest.name })) : []);
    const loading = streams.some((resource) => resource.content.type === 'Loading');
    const soleStream = !loading && readyStreams.length === 1 ? readyStreams[0] : null;
    const watchLabel = t('LIVE_TV_WATCH_LIVE', { defaultValue: 'Watch live' });
    const optionsLabel = t('LIVE_TV_PLAYBACK_OPTIONS', { defaultValue: 'Playback options' });
    const onStreamClick = (stream: Stream) => {
        setStreamsOpen(false);
        core.transport.analytics({ event: 'StreamClicked', args: { stream } });
    };
    const streamOptions = <div className={styles['stream-options']}>
        {readyStreams.map(({ stream, addonName }, index) => <StreamButton
            key={index}
            isEpg={true}
            className={styles['stream-option']}
            addonName={addonName}
            name={!mobile && soleStream ? watchLabel : stream.name || addonName}
            description={!mobile && soleStream ? [stream.name || addonName, stream.description].filter(Boolean).join('\n') : stream.description}
            progress={null}
            deepLinks={stream.deepLinks}
            onClick={() => onStreamClick(stream)}
        />)}
        {loading && <div className={styles['stream-loading']} role={'status'} aria-label={t('STREAM_LOADING')}>
            <StreamButton.Placeholder />
            <StreamButton.Placeholder />
        </div>}
        {!loading && readyStreams.length === 0 && <div className={styles['stream-message']} role={'status'}>{t('NO_STREAM')}</div>}
    </div>;

    if (!mobile) return <aside className={styles['streams-panel']} aria-label={optionsLabel}>
        <h2>{optionsLabel}</h2>
        {streamOptions}
    </aside>;

    return <>
        {soleStream ? <StreamButton
            className={actionStyles['action-button']}
            compact={true}
            isEpg={true}
            addonName={soleStream.addonName}
            name={watchLabel}
            description={soleStream.addonName}
            progress={null}
            deepLinks={soleStream.stream.deepLinks}
            onClick={() => onStreamClick(soleStream.stream)}
        /> : <ActionButton className={actionStyles['action-button']} icon={'play'} label={watchLabel} variant={'wide'} role={'button'} onClick={() => setStreamsOpen(true)} aria-haspopup={'dialog'} />}
        <BottomSheet
            className={styles['streams-sheet']}
            title={optionsLabel}
            show={streamsOpen}
            onCloseRequest={() => setStreamsOpen(false)}
            closeOnContentClick={false}
            closeOnOrientationChange={false}
        >
            {streamOptions}
        </BottomSheet>
    </>;
};

export default LiveTvPlayback;
