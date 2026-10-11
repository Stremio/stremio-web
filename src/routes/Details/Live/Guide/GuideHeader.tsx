// Copyright (C) 2017-2026 Smart code 203358507

import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
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
    isMobile: boolean,
    onViewSelect: (value: string) => void,
    onPrevious: () => void,
    onNow: () => void,
    onNext: () => void,
};

const GuideHeader = ({ view, hasProgrammes, canPrevious, canNext, isMobile, onViewSelect, onPrevious, onNow, onNext }: Props) => {
    const { t } = useTranslation();
    const options = useMemo(() => [
        { value: 'agenda', label: t('LIVE_TV_AGENDA'), icon: 'list' },
        { value: 'timeline', label: t('LIVE_TV_TIMELINE'), icon: 'grid' },
    ], [t]);

    if (isMobile) {
        return hasProgrammes ?
            <div className={styles['mobile-header']}>
                <SegmentedControl
                    className={styles['segments']}
                    options={options}
                    value={view}
                    ariaLabel={t('LIVE_TV_SCHEDULE')}
                    size={'large'}
                    onSelect={onViewSelect}
                />
                <Button className={styles['now-pill']} onClick={onNow}>
                    {t('LIVE_TV_NOW')}
                </Button>
            </div>
            :
            null;
    }

    return (
        <div className={styles['header']}>
            <div className={styles['title-row']}>
                <h2 className={styles['title']}>{t('LIVE_TV_SCHEDULE')}</h2>
                {
                    hasProgrammes ?
                        <div className={styles['controls']}>
                            <Button
                                className={styles['round']}
                                title={t('LIVE_TV_PREVIOUS_PROGRAM')}
                                aria-label={t('LIVE_TV_PREVIOUS_PROGRAM')}
                                aria-disabled={!canPrevious}
                                disabled={!canPrevious}
                                onClick={onPrevious}
                            >
                                <Icon className={styles['icon']} name={'chevron-back'} />
                            </Button>
                            <Button className={styles['now']} onClick={onNow}>
                                {t('LIVE_TV_NOW')}
                            </Button>
                            <Button
                                className={styles['round']}
                                title={t('LIVE_TV_NEXT_PROGRAM')}
                                aria-label={t('LIVE_TV_NEXT_PROGRAM')}
                                aria-disabled={!canNext}
                                disabled={!canNext}
                                onClick={onNext}
                            >
                                <Icon className={styles['icon']} name={'chevron-forward'} />
                            </Button>
                        </div>
                        :
                        null
                }
            </div>
            {
                hasProgrammes ?
                    <SegmentedControl
                        options={options}
                        value={view}
                        ariaLabel={t('LIVE_TV_SCHEDULE')}
                        onSelect={onViewSelect}
                    />
                    :
                    null
            }
        </div>
    );
};

export default GuideHeader;
