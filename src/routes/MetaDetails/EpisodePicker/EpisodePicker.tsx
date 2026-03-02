// Copyright (C) 2017-2025 Smart code 203358507

import React, { useCallback, useMemo, useState, ChangeEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, NumberInput } from 'stremio/components';
import styles from './EpisodePicker.less';

type Props = {
    className?: string,
    seriesId: string;
    onSubmit: (season: number, episode: number) => void;
};

const EpisodePicker = ({ className, onSubmit }: Props) => {
    const { t } = useTranslation();

    const { initialSeason, initialEpisode } = useMemo(() => {
        const splitPath = window.location.hash.split('/');
        if (splitPath[splitPath.length - 1] === '') {
            splitPath.pop();
        }
        const videoId = decodeURIComponent(splitPath[splitPath.length - 1]);
        const [, pathSeason, pathEpisode] = videoId ? videoId.split(':') : [];
        return {
            initialSeason: parseInt(pathSeason) || 0,
            initialEpisode: parseInt(pathEpisode) || 1
        };
    }, []);

    const [season, setSeason] = useState(initialSeason);
    const [episode, setEpisode] = useState(initialEpisode);

    const handleSeasonChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
        setSeason(parseInt(event.target.value));
    }, []);

    const handleEpisodeChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
        setEpisode(parseInt(event.target.value));
    }, []);

    const handleSubmit = () => {
        onSubmit(season, episode);
    };

    const disabled = season === initialSeason && episode === initialEpisode;

    return (
        <div className={className}>
            <NumberInput
                min={0}
                label={t('SEASON')}
                defaultValue={season}
                onChange={handleSeasonChange}
                showButtons
            />
            <NumberInput
                min={1}
                label={t('EPISODE')}
                defaultValue={episode}
                onChange={handleEpisodeChange}
                showButtons
            />
            <Button
                className={styles['button-container']}
                onClick={handleSubmit}
                disabled={disabled}
            >
                <div className={styles['label']}>{t('SIDEBAR_SHOW_STREAMS')}</div>
            </Button>
        </div>
    );
};

export default EpisodePicker;
