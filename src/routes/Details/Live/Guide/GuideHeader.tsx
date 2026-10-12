// Copyright (C) 2017-2026 Smart code 203358507

import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';
import Icon from '@stremio/stremio-icons/react';
import Button from 'stremio/components/Button';
import SegmentedControl from 'stremio/components/SegmentedControl';
import type { GuideView } from './useGuide';
import styles from './GuideHeader.less';

type Props = {
    view: GuideView,
    hasProgrammes: boolean,
    canPrevious: boolean,
    canNext: boolean,
    canZoomIn: boolean,
    canZoomOut: boolean,
    isMobile: boolean,
    onViewSelect: (value: string) => void,
    onPrevious: () => void,
    onNow: () => void,
    onNext: () => void,
    onZoomIn: () => void,
    onZoomOut: () => void,
    onFit: () => void,
};

const GuideHeader = ({ view, hasProgrammes, canPrevious, canNext, canZoomIn, canZoomOut, isMobile, onViewSelect, onPrevious, onNow, onNext, onZoomIn, onZoomOut, onFit }: Props) => {
    const { t } = useTranslation();
    const options = useMemo(() => [
        { value: 'agenda', label: t('LIVE_TV_AGENDA'), icon: 'list' },
        { value: 'timeline', label: t('LIVE_TV_TIMELINE'), icon: 'grid' },
    ], [t]);

    if (!hasProgrammes) {
        return isMobile ?
            null
            :
            <div className={styles['header']}>
                <div className={styles['title-row']}>
                    <h2 className={styles['title']}>{t('LIVE_TV_SCHEDULE')}</h2>
                </div>
            </div>;
    }

    const zoom = view === 'timeline' ?
        <div className={styles['controls']} role={'group'} aria-label={t('LIVE_TV_TIMELINE')}>
            <Button
                className={classNames(styles['round'], { [styles['inactive']]: !canZoomOut })}
                title={t('LIVE_TV_ZOOM_OUT')}
                aria-label={t('LIVE_TV_ZOOM_OUT')}
                aria-disabled={!canZoomOut}
                onClick={canZoomOut ? onZoomOut : undefined}
            >
                <Icon className={styles['icon']} name={'remove'} />
            </Button>
            <Button className={styles['round']} title={t('LIVE_TV_FIT_SELECTED')} aria-label={t('LIVE_TV_FIT_SELECTED')} onClick={onFit}>
                <Icon className={styles['icon']} name={'aspect-ratio'} />
            </Button>
            <Button
                className={classNames(styles['round'], { [styles['inactive']]: !canZoomIn })}
                title={t('LIVE_TV_ZOOM_IN')}
                aria-label={t('LIVE_TV_ZOOM_IN')}
                aria-disabled={!canZoomIn}
                onClick={canZoomIn ? onZoomIn : undefined}
            >
                <Icon className={styles['icon']} name={'add'} />
            </Button>
        </div>
        :
        null;

    if (isMobile) {
        return (
            <div className={styles['mobile-header']}>
                <Button className={styles['now-pill']} onClick={onNow}>
                    {t('LIVE_TV_NOW')}
                </Button>
                <div className={styles['mobile-row']}>
                    <SegmentedControl
                        className={styles['segments']}
                        options={options}
                        value={view}
                        ariaLabel={t('LIVE_TV_SCHEDULE')}
                        size={'large'}
                        onSelect={onViewSelect}
                    />
                    {zoom}
                </div>
            </div>
        );
    }

    return (
        <div className={styles['header']}>
            <div className={styles['title-row']}>
                <h2 className={styles['title']}>{t('LIVE_TV_SCHEDULE')}</h2>
                <div className={styles['groups']}>
                    <div className={styles['controls']} role={'group'} aria-label={t('LIVE_TV_NOW')}>
                        <Button
                            className={classNames(styles['round'], { [styles['inactive']]: !canPrevious })}
                            title={t('LIVE_TV_PREVIOUS_PROGRAM')}
                            aria-label={t('LIVE_TV_PREVIOUS_PROGRAM')}
                            aria-disabled={!canPrevious}
                            onClick={canPrevious ? onPrevious : undefined}
                        >
                            <Icon className={styles['icon']} name={'chevron-back'} />
                        </Button>
                        <Button className={styles['now']} onClick={onNow}>
                            {t('LIVE_TV_NOW')}
                        </Button>
                        <Button
                            className={classNames(styles['round'], { [styles['inactive']]: !canNext })}
                            title={t('LIVE_TV_NEXT_PROGRAM')}
                            aria-label={t('LIVE_TV_NEXT_PROGRAM')}
                            aria-disabled={!canNext}
                            onClick={canNext ? onNext : undefined}
                        >
                            <Icon className={styles['icon']} name={'chevron-forward'} />
                        </Button>
                    </div>
                </div>
            </div>
            <div className={styles['view-row']}>
                <SegmentedControl
                    className={styles['segments']}
                    options={options}
                    value={view}
                    ariaLabel={t('LIVE_TV_SCHEDULE')}
                    onSelect={onViewSelect}
                />
                {zoom}
            </div>
        </div>
    );
};

export default GuideHeader;
