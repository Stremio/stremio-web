// Copyright (C) 2017-2026 Smart code 203358507

import React, { useCallback, useMemo, useState } from 'react';
import { useNavigate } from 'react-router';
import classNames from 'classnames';
import { useTranslation } from 'react-i18next';
import { useGoBack, toPath } from 'stremio-router';
import Icon from '@stremio/stremio-icons/react';
import Button from 'stremio/components/Button';
import SegmentedControl from 'stremio/components/SegmentedControl';
import { useProfile } from 'stremio/common';
import { getEpisodeLabel } from '../format';
import Panel from '../Panel';
import Placeholder from '../Placeholder';
import Message from '../Message';
import EpisodePicker from '../EpisodePicker';
import Stream from './Stream';
import useStreamsByAddon from './useStreamsByAddon';
import styles from './Streams.less';

type Props = {
    streams: MetaDetails['streams'],
    video: Video | null,
    type: string,
    canMarkWatched: boolean,
    onEpisodeSearch: (season: number, episode: number) => void,
};

const ALL_ADDONS_KEY = 'ALL';

const Streams = ({ streams, video, type, canMarkWatched, onEpisodeSearch }: Props) => {
    const { t } = useTranslation();
    const profile = useProfile();
    const navigate = useNavigate();
    const goBack = useGoBack();
    const { groups, loadingCount, total } = useStreamsByAddon(streams);
    const [selectedAddon, setSelectedAddon] = useState(ALL_ADDONS_KEY);
    const effectiveSelectedAddon = groups.some(({ addon }) => addon.transportUrl === selectedAddon) ? selectedAddon : ALL_ADDONS_KEY;

    const showInstallAddons = !profile || profile.auth === null || (profile.auth?.user?.isNewUser === true && !video?.upcoming);

    const onBack = useCallback(() => {
        if (video && typeof video.deepLinks.metaDetailsVideos === 'string') {
            const query = typeof video.season === 'number' ? `?${new URLSearchParams({ season: String(video.season) })}` : '';
            navigate(toPath(`${video.deepLinks.metaDetailsVideos}${query}`), { replace: true });
        } else {
            goBack();
        }
    }, [video, navigate, goBack]);

    const options = useMemo(() => {
        return [
            { value: ALL_ADDONS_KEY, label: t('ALL_ADDONS'), count: total },
            ...groups.map(({ addon, streams }) => ({
                value: addon.transportUrl,
                label: addon.manifest.name,
                count: streams.length,
            })),
        ];
    }, [groups, total, t]);

    const visibleGroups = useMemo(() => {
        return effectiveSelectedAddon === ALL_ADDONS_KEY ?
            groups
            :
            groups.filter(({ addon }) => addon.transportUrl === effectiveSelectedAddon);
    }, [groups, effectiveSelectedAddon]);

    const loadingLabel = `${loadingCount} ${t('MOBILE_ADDONS_LOADING')}`;
    const episodeTitle = useMemo(() => {
        if (!video) {
            return null;
        }

        const episodeLabel = getEpisodeLabel(video);
        return [episodeLabel, video.title].filter((part) => typeof part === 'string' && part.length > 0).join(' · ');
    }, [video]);

    const installAddons = showInstallAddons ?
        <Button className={styles['install-button']} title={t('ADDON_CATALOGUE_MORE')} href={'#/addons'}>
            <Icon className={styles['install-icon']} name={'addons'} />
            <div className={styles['install-label']}>{t('ADDON_CATALOGUE_MORE')}</div>
        </Button>
        :
        null;

    const episodePicker = type === 'series' ?
        <EpisodePicker className={styles['episode-picker']} seriesId={video?.id ?? ''} onSubmit={onEpisodeSearch} />
        :
        null;

    const header = (
        <React.Fragment>
            {
                video || loadingCount > 0 ?
                    <div className={styles['title-row']}>
                        {
                            video ?
                                <React.Fragment>
                                    <Button className={styles['back-button']} title={t('BACK')} onClick={onBack}>
                                        <Icon className={styles['back-icon']} name={'chevron-back'} />
                                    </Button>
                                    <div className={styles['title']} title={episodeTitle ?? undefined}>{episodeTitle}</div>
                                </React.Fragment>
                                :
                                <div className={styles['title']} />
                        }
                        {
                            loadingCount > 0 ?
                                <div className={styles['loading-text']}>{loadingLabel}</div>
                                :
                                null
                        }
                    </div>
                    :
                    null
            }
            {
                streams.length > 1 ?
                    <SegmentedControl
                        className={styles['addons']}
                        options={options}
                        value={effectiveSelectedAddon}
                        ariaLabel={t('STREAMS')}
                        size={'large'}
                        onSelect={setSelectedAddon}
                    />
                    :
                    null
            }
            <div className={classNames(styles['loading-line'], { [styles['active']]: loadingCount > 0 })} role={'status'} aria-label={loadingCount > 0 ? loadingLabel : undefined} aria-hidden={loadingCount === 0} />
        </React.Fragment>
    );

    return (
        <Panel className={styles['streams']} ariaLabel={t('STREAMS')} header={header} resetKey={effectiveSelectedAddon}>
            {
                streams.length === 0 ?
                    <div className={styles['message']}>
                        {episodePicker}
                        <Message label={t('ERR_NO_ADDONS_FOR_STREAMS')} />
                    </div>
                    :
                    total === 0 && loadingCount === 0 ?
                        <div className={styles['message']}>
                            {episodePicker}
                            {
                                video?.upcoming ?
                                    <div className={styles['upcoming']}>{t('UPCOMING')}...</div>
                                    :
                                    null
                            }
                            <Message label={t('NO_STREAM')}>
                                {installAddons}
                            </Message>
                        </div>
                        :
                        total === 0 ?
                            <Placeholder variant={'list'} />
                            :
                            <div className={styles['groups']}>
                                {
                                    visibleGroups.map(({ addon, streams }) => (
                                        <section key={addon.transportUrl} className={styles['group']} aria-label={addon.manifest.name}>
                                            {
                                                effectiveSelectedAddon === ALL_ADDONS_KEY ?
                                                    <p className={styles['group-label']}>{addon.manifest.name}</p>
                                                    :
                                                    null
                                            }
                                            {
                                                streams.map((stream, index) => (
                                                    <Stream
                                                        key={index}
                                                        stream={stream}
                                                        addonName={addon.manifest.name}
                                                        videoId={video?.id}
                                                        videoReleased={video?.released}
                                                        canMarkWatched={canMarkWatched}
                                                    />
                                                ))
                                            }
                                        </section>
                                    ))
                                }
                                {installAddons}
                            </div>
            }
        </Panel>
    );
};

export default Streams;
