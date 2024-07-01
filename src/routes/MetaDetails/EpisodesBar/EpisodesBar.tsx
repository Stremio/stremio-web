// Copyright (C) 2017-2024 Smart code 203358507

import React, { MouseEvent } from 'react';
import { t } from 'i18next';
import { Multiselect, Button, Icon } from 'stremio/common';
import { CustomSelectEvent, OnSelectFunction } from './types';
import EpisodesBarPlaceholder from './EpisodesBarPlaceholder';
import classnames from 'classnames';
import styles from './styles.less';

type Props = {
    className?: string;
    episodes: number[];
    episode: number;
    onSelect?: OnSelectFunction;
};

const EpisodesBar = ({ episodes, episode, className, onSelect }: Props) => {

    const options = React.useMemo(() => {
        return episodes.map((episode) => ({
            value: String(episode),
            label: `${t('EPISODE')} ${episode}`
        }));
    }, [episodes]);

    const selected = React.useMemo(() => {
        return [String(episode)];
    }, [episode]);

    const prevNextButtonOnClick = React.useCallback((event: MouseEvent<HTMLButtonElement>) => {
        if (typeof onSelect === 'function') {
            const episodeIndex = episodes.indexOf(episode);
            const isNextAction = event.currentTarget.dataset.action === 'next';
            const valueIndex = isNextAction
                ? episodeIndex + 1 < episodes.length
                    ? episodeIndex + 1
                    : episodes.length - 1
                : episodeIndex - 1 >= 0
                ? episodeIndex - 1
                : 0;
            const value = episodes[valueIndex];

            onSelect({
                type: 'select',
                value,
                reactEvent: event,
                nativeEvent: event.nativeEvent,
            });
        }
    }, [episode, episodes, onSelect]);

    const episodesOnSelect = React.useCallback((event: CustomSelectEvent) => {
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
            <Button className={styles['prev-episode-button']} title={'Previous episode'} data-action={'prev'} onClick={prevNextButtonOnClick}>
                <Icon className={styles['icon']} name={'chevron-back'} />
                <div className={styles['label']}>Prev</div>
            </Button>
            <Multiselect
                className={styles['episodes-popup-label-container']}
                title={`${t('EPISODE')} ${episode}`}
                direction={'bottom-left'}
                options={options}
                selected={selected}
                onSelect={episodesOnSelect}
            />
            <Button className={styles['next-episode-button']} title={'Next episode'} data-action={'next'} onClick={prevNextButtonOnClick}>
                <div className={styles['label']}>Next</div>
                <Icon className={styles['icon']} name={'chevron-forward'} />
            </Button>
        </div>
    );
};

EpisodesBar.Placeholder = EpisodesBarPlaceholder;

export default EpisodesBar;