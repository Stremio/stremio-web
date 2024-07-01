// Copyright (C) 2017-2024 Smart code 203358507

import React from 'react';
import type { MouseEvent } from 'react';
import classnames from 'classnames';
import { t } from 'i18next';
import Icon from '@stremio/stremio-icons/react';
import { Button, Multiselect } from 'stremio/common';
import SeasonsBarPlaceholder from './SeasonsBarPlaceholder';
import styles from './styles.less';

type OnSelectFunction = (event: OnSelectEvent) => void;

type CustomSelectEvent = {
    value: number | string;
    reactEvent: React.SyntheticEvent;
    nativeEvent: Event;
    currentTarget: {
        dataset: {
            action: string;
        };
    };
};

type OnSelectEvent = {
    type: string;
    value: number;
    reactEvent: React.SyntheticEvent;
    nativeEvent: Event;
};

type Props = {
    className?: string;
    seasons: number[];
    season: number;
    onSelect?: OnSelectFunction;
};

const SeasonsBar = ({ className, seasons, season, onSelect }: Props) => {
    const options = React.useMemo(() => {
        return seasons.map((season) => ({
            value: String(season),
            label: season > 0 ? `${t('SEASON')} ${season}` : t('SPECIAL')
        }));
    }, [seasons]);

    const selected = React.useMemo(() => {
        return [String(season)];
    }, [season]);

    const prevNextButtonOnClick = React.useCallback((event: MouseEvent<HTMLButtonElement>) => {
        if (typeof onSelect === 'function') {
            const seasonIndex = seasons.indexOf(season);
            const isNextAction = event.currentTarget.dataset.action === 'next';
            const valueIndex = isNextAction
                ? seasonIndex + 1 < seasons.length
                    ? seasonIndex + 1
                    : seasons.length - 1
                : seasonIndex - 1 >= 0
                ? seasonIndex - 1
                : 0;
            const value = seasons[valueIndex];

            onSelect({
                type: 'select',
                value,
                reactEvent: event,
                nativeEvent: event.nativeEvent,
            });
        }
    }, [season, seasons, onSelect]);

    const seasonOnSelect = React.useCallback((event: CustomSelectEvent) => {
        const value = Number(event.value);
        if (typeof onSelect === 'function') {
            onSelect({
                type: 'select',
                value,
                reactEvent: event.reactEvent,
                nativeEvent: event.nativeEvent,
            });
        }
    }, [onSelect]);
    return (
        <div className={classnames(className, styles['seasons-bar-container'])}>
            <Button className={styles['prev-season-button']} title={'Previous season'} data-action={'prev'} onClick={prevNextButtonOnClick}>
                <Icon className={styles['icon']} name={'chevron-back'} />
                <div className={styles['label']}>Prev</div>
            </Button>
            <Multiselect
                className={styles['seasons-popup-label-container']}
                title={season > 0 ? `${t('SEASON')} ${season}` : t('SPECIAL')}
                direction={'bottom-left'}
                options={options}
                selected={selected}
                onSelect={seasonOnSelect}
            />
            <Button className={styles['next-season-button']} title={'Next season'} data-action={'next'} onClick={prevNextButtonOnClick}>
                <div className={styles['label']}>Next</div>
                <Icon className={styles['icon']} name={'chevron-forward'} />
            </Button>
        </div>
    );
};

SeasonsBar.Placeholder = SeasonsBarPlaceholder;

export default SeasonsBar;
