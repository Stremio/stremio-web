// Copyright (C) 2017-2026 Smart code 203358507

import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import styles from './SubtitlesPreview.less';

const isTransparent = (color: string) => {
    const hex = color.replace('#', '');
    return hex.length === 8 && hex.endsWith('00');
};

type Props = {
    settings: Settings,
};

const SubtitlesPreview = ({ settings }: Props) => {
    const { t } = useTranslation();

    const style = useMemo(() => {
        const outline = settings.subtitlesOutlineColor;
        return {
            color: settings.subtitlesTextColor,
            backgroundColor: settings.subtitlesBackgroundColor,
            fontSize: `${Math.round(1.25 * settings.subtitlesSize) / 100}rem`,
            marginBottom: `${0.75 + settings.subtitlesOffset * 0.06}rem`,
            textShadow: isTransparent(outline) ? 'none' : `0 0 2px ${outline}, 0 0 2px ${outline}, 0 1px 3px ${outline}`,
        };
    }, [settings.subtitlesTextColor, settings.subtitlesBackgroundColor, settings.subtitlesOutlineColor, settings.subtitlesSize, settings.subtitlesOffset]);

    return (
        <div className={styles['subtitles-preview']} role={'img'} aria-label={t('SETTINGS_SUBTITLES_PREVIEW')}>
            <div className={styles['line']} style={style}>
                {t('SETTINGS_SUBTITLES_PREVIEW_TEXT')}
            </div>
        </div>
    );
};

export default SubtitlesPreview;
