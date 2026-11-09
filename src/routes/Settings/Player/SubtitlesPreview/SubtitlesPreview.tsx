// Copyright (C) 2017-2026 Smart code 203358507

import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import styles from './SubtitlesPreview.less';

type Props = {
    settings: Settings,
};

const SubtitlesPreview = ({ settings }: Props) => {
    const { t } = useTranslation();

    const lineStyle = useMemo(() => ({
        '--size': Math.floor(settings.subtitlesSize / 25),
        '--outline': settings.subtitlesOutlineColor,
        color: settings.subtitlesTextColor,
        backgroundColor: settings.subtitlesBackgroundColor,
    } as React.CSSProperties), [settings.subtitlesSize, settings.subtitlesOutlineColor, settings.subtitlesTextColor, settings.subtitlesBackgroundColor]);

    return (
        <div className={styles['subtitles-preview']} role={'img'} aria-label={t('SETTINGS_SUBTITLES_PREVIEW')}>
            <img
                className={styles['image']}
                src={require('/assets/images/subtitles_preview.jpg')}
                alt={''}
                width={1280}
                height={720}
                decoding={'async'}
                loading={'lazy'}
            />
            <div className={styles['layer']} style={{ bottom: `${settings.subtitlesOffset}%` }}>
                <span className={styles['line']} style={lineStyle}>{t('SETTINGS_SUBTITLES_PREVIEW_TEXT')}</span>
            </div>
        </div>
    );
};

export default SubtitlesPreview;
