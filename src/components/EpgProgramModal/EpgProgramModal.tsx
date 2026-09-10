// Copyright (C) 2017-2026 Smart code 203358507

import React from 'react';
import { useTranslation } from 'react-i18next';
import Icon from '@stremio/stremio-icons/react';
import BottomSheet from 'stremio/components/BottomSheet';
import ActionButton from 'stremio/components/MetaPreview/ActionButton';
import Image from 'stremio/components/Image';
import ModalDialog from 'stremio/components/ModalDialog';
import useMediaQuery from 'stremio/common/useMediaQuery';
import { XSMALL_WIDTH } from 'stremio/common/screenSizes';
import { EPGProgram, formatEpgTimeRange, getEpgProgress } from 'stremio/common/EPG';
import styles from './EpgProgramModal.less';

type Props = {
    program: EPGProgram;
    now: number;
    show: boolean;
    onCloseRequest: () => void;
    channelHref?: string | null;
};

const EpgProgramModal = ({ program, now, show, onCloseRequest, channelHref }: Props) => {
    const { t, i18n } = useTranslation();
    const isMobile = useMediaQuery(`(max-width: ${XSMALL_WIDTH}px)`);
    const progress = getEpgProgress(program, now);
    const genres = program.genres?.length ? program.genres
        : program.links?.filter(({ category }) => category === 'Genres').map(({ name }) => name) ?? [];
    const dateLabel = program.startTime.toLocaleDateString(i18n.language, { weekday: 'long', month: 'short', day: 'numeric' });
    const preview = (
        <article className={styles['preview']} aria-label={program.title}>
            {program.thumbnail && <Image className={styles['backdrop']} src={program.thumbnail} alt={''} renderFallback={() => null} />}
            <div className={styles['scrim']} />
            <div className={styles['body']}>
                <div className={styles['channel']}>
                    {program.channelLogo && <Image className={styles['channel-logo']} src={program.channelLogo} alt={''} />}
                    <span>{program.channelName}</span>
                </div>
                {program.thumbnail && <Image className={styles['artwork']} src={program.thumbnail} alt={''} renderFallback={() => null} />}
                <div className={styles['information']}>
                    <div className={styles['status-line']}>
                        <span className={progress !== null ? styles['live'] : styles['status']}>
                            {progress !== null ? t('LIVE_TV_ON_NOW', { defaultValue: 'On now' })
                                : program.startTime.getTime() > now ? t('UPCOMING') : t('AIRED')}
                        </span>
                        <span>{dateLabel}</span>
                    </div>
                    <h1 className={styles['title']}>{program.title}</h1>
                    <div className={styles['time']}>
                        <Icon name={'clock'} className={styles['time-icon']} />
                        <span>{formatEpgTimeRange(program.startTime, program.endTime, i18n.language)}</span>
                        {program.runtime && <span className={styles['runtime']}>{program.runtime}</span>}
                    </div>
                    {progress !== null && <div className={styles['progress']}><div style={{ width: `${progress}%` }} /></div>}
                    {program.overview && <p className={styles['description']}>{program.overview}</p>}
                    {genres.length > 0 && <div className={styles['genres']}>{genres.map((genre) => <span key={genre}>{genre}</span>)}</div>}
                </div>
            </div>
            {channelHref && <footer className={styles['footer']}>
                <ActionButton className={styles['channel-button']} icon={'chevron-forward'} label={t('LIVE_TV_VIEW_CHANNEL', { defaultValue: 'View channel' })} variant={'wide'} href={channelHref} onClick={onCloseRequest} />
            </footer>}
        </article>
    );

    return isMobile ? (
        <BottomSheet
            className={styles['sheet']}
            show={show}
            onCloseRequest={onCloseRequest}
            closeOnContentClick={false}
            closeOnOrientationChange={false}
            flush={true}
            ariaLabel={program.title}
        >
            {preview}
        </BottomSheet>
    ) : show ? (
        <ModalDialog className={styles['modal']} onCloseRequest={onCloseRequest} role={'dialog'} aria-modal={'true'} aria-label={program.title}>
            {preview}
        </ModalDialog>
    ) : null;
};

export default EpgProgramModal;
