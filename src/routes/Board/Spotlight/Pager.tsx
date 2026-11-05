// Copyright (C) 2017-2026 Smart code 203358507

import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';
import Icon from '@stremio/stremio-icons/react';
import Button from 'stremio/components/Button';
import styles from './Pager.less';

type Props = {
    className?: string,
    labels: string[],
    index: number,
    stopped: boolean,
    onSelect: (slide: number) => void,
    onPrevious: () => void,
    onNext: () => void,
    onTogglePause: () => void,
    onCycle: () => void,
};

const Pager = ({ className, labels, index, stopped, onSelect, onPrevious, onNext, onTogglePause, onCycle }: Props) => {
    const { t } = useTranslation();

    const onSegmentClick = useCallback((event: React.MouseEvent<HTMLDivElement>) => {
        onSelect(Number(event.currentTarget.dataset.slide));
    }, [onSelect]);

    return (
        <div className={classNames(className, styles['pager'], { [styles['stopped']]: stopped })}>
            <Button className={styles['control']} aria-label={t('BOARD_SPOTLIGHT_PREVIOUS')} onClick={onPrevious}>
                <Icon className={styles['icon']} name={'chevron-back'} />
            </Button>
            <div className={styles['segments']} role={'tablist'}>
                {
                    labels.map((label, slide) => (
                        <Button
                            key={slide}
                            className={classNames(styles['segment'], { [styles['on']]: slide === index })}
                            role={'tab'}
                            aria-selected={slide === index}
                            aria-label={label}
                            data-slide={slide}
                            onClick={onSegmentClick}
                        >
                            <div className={styles['bar']}>
                                <div className={styles['fill']} onAnimationEnd={slide === index ? onCycle : undefined} />
                            </div>
                        </Button>
                    ))
                }
            </div>
            <Button className={styles['control']} aria-label={t('BOARD_SPOTLIGHT_NEXT')} onClick={onNext}>
                <Icon className={styles['icon']} name={'chevron-forward'} />
            </Button>
            <Button className={styles['control']} aria-label={stopped ? t('BOARD_SPOTLIGHT_RESUME') : t('BOARD_SPOTLIGHT_PAUSE')} aria-pressed={stopped} onClick={onTogglePause}>
                <Icon className={styles['icon']} name={stopped ? 'play' : 'pause'} />
            </Button>
        </div>
    );
};

export default Pager;
