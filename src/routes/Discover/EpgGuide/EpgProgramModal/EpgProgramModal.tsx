// Copyright (C) 2017-2026 Smart code 203358507

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import classnames from 'classnames';
import { default as Icon } from '@stremio/stremio-icons/react';
import { ModalDialog, Button, Image } from 'stremio/components';
import type { EPGProgram } from '../useEPG';
import type { EpgChannel } from '../EpgGuideRow';
import { programStartMs, programEndMs } from '../epgUtils';
import styles from './EpgProgramModal.less';

export type EpgProgramStreamOption = {
    id: string;
    addonName: string;
    name: string;
    peers?: number | null;
    sizeLabel?: string | null;
    playHref?: string | null;
};

type Props = {
    program: EPGProgram;
    channel: EpgChannel;
    streams?: EpgProgramStreamOption[];
    onCloseRequest: () => void;
};

function formatRuntime(program: EPGProgram): string | null {
    const start = programStartMs(program);
    const end = programEndMs(program);
    if (isNaN(start) || isNaN(end) || end <= start) {
        return null;
    }
    const mins = Math.round((end - start) / 60000);
    if (mins < 1) {
        return null;
    }
    if (mins < 60) {
        return `${mins} min`;
    }
    const h = Math.floor(mins / 60);
    const r = mins % 60;
    return r ? `${h} h ${r} min` : `${h} h`;
}

const EpgProgramModal = ({ program, channel, streams = [], onCloseRequest }: Props) => {
    const { t } = useTranslation();
    const [selectedId, setSelectedId] = useState<string | null>(null);

    useEffect(() => {
        setSelectedId(streams[0]?.id ?? null);
    }, [streams]);

    const runtimeLabel = useMemo(() => formatRuntime(program), [program]);
    const yearLabel = useMemo(() => {
        const start = programStartMs(program);
        if (isNaN(start)) {
            return null;
        }
        return String(new Date(start).getFullYear());
    }, [program]);

    const logoFallback = useCallback(
        () => <div className={styles['epg-program-logo-placeholder']}>{channel.name}</div>,
        [channel.name],
    );

    return (
        <ModalDialog
            className={styles['epg-program-modal-container']}
            title={channel.name}
            background={program.thumbnail ?? undefined}
            onCloseRequest={onCloseRequest}
        >
            <div className={styles['epg-program-modal-body']}>
                <div className={styles['epg-program-logo-wrap']}>
                    {channel.logo ? (
                        <Image
                            className={styles['epg-program-logo']}
                            src={channel.logo}
                            alt={channel.name}
                            renderFallback={logoFallback}
                        />
                    ) : (
                        logoFallback()
                    )}
                </div>

                {typeof program.title === 'string' && program.title.length > 0 ? (
                    <div className={styles['epg-program-title']}>{program.title}</div>
                ) : null}

                {(runtimeLabel || yearLabel) && (
                    <div className={styles['epg-program-meta-row']}>
                        {runtimeLabel ? <span>{runtimeLabel}</span> : null}
                        {yearLabel ? <span>{yearLabel}</span> : null}
                    </div>
                )}

                {typeof program.description === 'string' && program.description.length > 0 ? (
                    <p className={styles['epg-program-description']}>{program.description}</p>
                ) : null}

                <div className={styles['epg-program-streams']}>
                    {streams.length === 0 ? (
                        <div className={styles['epg-program-stream-empty']}>{t('NO_STREAM')}</div>
                    ) : (
                        streams.map((stream) => {
                            const active = stream.id === selectedId;
                            return (
                                <button
                                    key={stream.id}
                                    type="button"
                                    className={classnames(styles['epg-program-stream-row'], {
                                        [styles['epg-program-stream-row-active']]: active,
                                    })}
                                    onClick={() => setSelectedId(stream.id)}
                                >
                                    <div className={styles['epg-program-stream-main']}>
                                        <div className={styles['epg-program-stream-addon']}>{stream.addonName}</div>
                                        <div className={styles['epg-program-stream-name']}>{stream.name}</div>
                                        {(stream.peers !== null || stream.sizeLabel) && (
                                            <div className={styles['epg-program-stream-meta']}>
                                                {stream.peers !== null ? <span>{stream.peers}</span> : null}
                                                {stream.sizeLabel ? <span>{stream.sizeLabel}</span> : null}
                                            </div>
                                        )}
                                    </div>
                                    {active && typeof stream.playHref === 'string' && stream.playHref.length > 0 ? (
                                        <Button
                                            className={styles['epg-program-stream-play']}
                                            title={t('SHOW')}
                                            onClick={(e: React.MouseEvent) => {
                                                e.stopPropagation();
                                                window.location.href = stream.playHref as string;
                                            }}
                                        >
                                            <Icon className={styles['icon']} name={'play'} />
                                        </Button>
                                    ) : null}
                                </button>
                            );
                        })
                    )}
                </div>

                <Button
                    className={styles['epg-program-install']}
                    title={t('ADDON_CATALOGUE_MORE')}
                    href={'#/addons'}
                >
                    <Icon className={styles['epg-program-install-icon']} name={'addons'} />
                    <div className={styles['epg-program-install-label']}>{t('ADDON_CATALOGUE_MORE')}</div>
                </Button>
            </div>
        </ModalDialog>
    );
};

export default EpgProgramModal;
