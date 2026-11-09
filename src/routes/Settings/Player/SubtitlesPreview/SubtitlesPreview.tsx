// Copyright (C) 2017-2026 Smart code 203358507

import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import Button from 'stremio/components/Button';
import styles from './SubtitlesPreview.less';

const CREDIT = {
    title: 'Big Buck Bunny',
    titleHref: 'https://peach.blender.org/',
    copyright: '© 2008 Blender Foundation',
    license: 'CC BY 3.0',
    licenseHref: 'https://creativecommons.org/licenses/by/3.0/',
};

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
        <div className={styles['subtitles-preview']}>
            <div className={styles['frame']} role={'img'} aria-label={t('SETTINGS_SUBTITLES_PREVIEW')}>
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
            <div className={styles['credit']}>
                <Button className={styles['link']} href={CREDIT.titleHref} target={'_blank'}>{CREDIT.title}</Button>
                <span>{CREDIT.copyright}</span>
                <Button className={styles['link']} href={CREDIT.licenseHref} target={'_blank'}>{CREDIT.license}</Button>
            </div>
        </div>
    );
};

export default SubtitlesPreview;
