// Copyright (C) 2017-2026 Smart code 203358507

import React, { useCallback, useMemo } from 'react';
import classNames from 'classnames';
import { useTranslation } from 'react-i18next';
import Icon from '@stremio/stremio-icons/react';
import Button from 'stremio/components/Button';
import { useCore } from 'stremio/core';
import PlayButton from '../Actions/PlayButton';
import ToggleButton from '../Actions/ToggleButton';
import styles from './Playback.less';

type Props = {
    className?: string,
    streams: MetaDetails['streams'],
    streamsOpen: boolean,
    inLibrary: boolean,
    onStreamsToggle: () => void,
    onToggleLibrary: () => void,
};

const Playback = ({ className, streams, streamsOpen, inLibrary, onStreamsToggle, onToggleLibrary }: Props) => {
    const { t } = useTranslation();
    const core = useCore();

    const readyStreams = useMemo(() => {
        return streams.flatMap((resource) => {
            return resource.content.type === 'Ready' ?
                resource.content.content.map((stream) => ({ stream, addonName: resource.addon.manifest.name }))
                :
                [];
        });
    }, [streams]);
    const loading = useMemo(() => streams.some((resource) => resource.content.type === 'Loading'), [streams]);
    const watchStream = useMemo(() => {
        return readyStreams.find(({ stream }) => stream.lastUsed === true) ?? readyStreams[0] ?? null;
    }, [readyStreams]);

    const sublabel = watchStream !== null ? [watchStream.addonName, watchStream.stream.name].filter((part) => part.length > 0).join(' · ') : null;

    const onWatchClick = useCallback(() => {
        if (watchStream !== null) {
            core.transport.analytics({ event: 'StreamClicked', args: { stream: watchStream.stream } });
        }
    }, [core.transport, watchStream]);

    return (
        <div className={classNames(className, styles['playback'])}>
            {
                watchStream !== null ?
                    <PlayButton
                        className={styles['primary']}
                        label={t('LIVE_TV_WATCH_LIVE')}
                        sublabel={sublabel}
                        href={watchStream.stream.deepLinks?.player}
                        onClick={onWatchClick}
                    />
                    :
                    loading ?
                        <div className={classNames(styles['pill'], styles['status'], styles['primary'])} role={'status'}>
                            <div className={styles['spinner']} aria-hidden={'true'} />
                            {t('STREAM_LOADING')}
                        </div>
                        :
                        <div className={classNames(styles['pill'], styles['status'], styles['primary'])} role={'status'}>
                            {t('NO_STREAM')}
                        </div>
            }
            <div className={styles['secondary']}>
                {
                    watchStream === null && !loading ?
                        <Button className={styles['pill']} href={'#/addons'}>
                            <Icon className={styles['icon']} name={'addons'} />
                            {t('ADDON_CATALOGUE_MORE')}
                        </Button>
                        :
                        null
                }
                {
                    readyStreams.length > 0 ?
                        <Button className={classNames(styles['pill'], { [styles['open']]: streamsOpen })} role={'button'} aria-expanded={streamsOpen} onClick={onStreamsToggle}>
                            {t('STREAMS')}
                            <div className={styles['count']}>{readyStreams.length}</div>
                        </Button>
                        :
                        loading ?
                            <div className={classNames(styles['pill'], styles['status'])} aria-disabled={'true'}>
                                {t('STREAMS')}
                                <div className={classNames(styles['count'], styles['pending'])} />
                            </div>
                            :
                            null
                }
                <ToggleButton
                    className={styles['library']}
                    variant={'library'}
                    on={inLibrary}
                    label={inLibrary ? t('REMOVE_FROM_LIB') : t('ADD_TO_LIB')}
                    onClick={onToggleLibrary}
                />
            </div>
        </div>
    );
};

export default Playback;
