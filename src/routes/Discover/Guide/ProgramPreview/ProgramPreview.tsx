// Copyright (C) 2017-2026 Smart code 203358507

import React from 'react';
import { useTranslation } from 'react-i18next';
import { EPGProgram, formatEpgTimeRange, getEpgProgress } from 'stremio/common/EPG';
import MetaPreview, { Links } from 'stremio/components/MetaPreview';
import styles from './ProgramPreview.less';

type Props = {
    className?: string,
    program: EPGProgram,
    now: number,
    channelHref: string | null,
    onShowClick?: (event: React.MouseEvent<HTMLDivElement>) => void,
};

const ProgramPreview = ({ className, program, now, channelHref, onShowClick }: Props) => {
    const { t, i18n } = useTranslation();
    const live = getEpgProgress(program, now) !== null;
    const date = program.startTime.toLocaleDateString(i18n.language, { weekday: 'long', month: 'short', day: 'numeric' });
    const genres = program.genres?.length ?
        program.genres
        :
        program.links?.filter(({ category }) => category === 'Genres').map(({ name }) => name) ?? [];

    return (
        <MetaPreview
            className={className}
            name={program.channelName}
            title={program.title}
            logo={program.channelLogo}
            background={program.background ?? program.thumbnail}
            runtime={program.runtime}
            releaseInfo={program.releaseInfo}
            released={program.released}
            ratings={program.ratings}
            description={program.overview}
            metadata={
                <div className={styles['status']}>
                    {
                        live ?
                            <span className={styles['live']}>{t('PLAYER_LIVE')}</span>
                            :
                            <span className={styles['aired']}>{program.startTime.getTime() > now ? t('UPCOMING') : t('AIRED')}</span>
                    }
                    <span>{`${date} · ${formatEpgTimeRange(program.startTime, program.endTime, i18n.language)}`}</span>
                </div>
            }
            show={
                channelHref ?
                    {
                        href: channelHref,
                        label: t('LIVE_TV_VIEW_CHANNEL', { defaultValue: 'View channel' }),
                        icon: 'chevron-forward',
                        onClick: onShowClick,
                    }
                    :
                    null
            }
        >
            {
                genres.length > 0 ?
                    <Links className={styles['genres']} groups={[{ category: 'Genres', links: genres.map((label) => ({ label })) }]} />
                    :
                    null
            }
        </MetaPreview>
    );
};

export default ProgramPreview;
