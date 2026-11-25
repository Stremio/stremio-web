import React, { forwardRef, memo, MouseEvent, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';
import { languages } from 'stremio/common';
import { Button } from 'stremio/components';
import { getAudioTrackDetails } from './audioTrackDetails';
import styles from './AudioMenu.less';

// Names a track title may use for its own language, e.g. "fre", "French", "Français".
const getLanguageNames = (lang: string) => {
    const language = languages.find(lang);
    return [lang, language?.name, language?.local];
};

type Props = {
    className: string,
    selectedAudioTrackId: string | null,
    audioTracks: AudioTrack[],
    onAudioTrackSelected: (id: string) => void,
};

const AudioMenu = memo(forwardRef<HTMLDivElement, Props>(({ className, selectedAudioTrackId, audioTracks, onAudioTrackSelected }: Props, ref) => {
    const { t } = useTranslation();

    const onAudioTrackClick = useCallback(({ currentTarget }: MouseEvent) => {
        const id = currentTarget.getAttribute('data-id')!;
        onAudioTrackSelected && onAudioTrackSelected(id);
    }, [onAudioTrackSelected]);

    const onMouseDown = (event: MouseEvent) => {
        // @ts-expect-error: Property 'audioMenuClosePrevented' does not exist on type 'MouseEvent'.
        event.nativeEvent.audioMenuClosePrevented = true;
    };

    return (
        <div ref={ref} className={classNames(className, styles['audio-menu'])} onMouseDown={onMouseDown}>
            <div className={styles['container']}>
                <div className={styles['header']}>
                    { t('AUDIO_TRACKS') }
                </div>
                <div className={styles['list']}>
                    {
                        audioTracks.map(({ id, label, lang, format }, index) => {
                            const details = getAudioTrackDetails({ label, format }, getLanguageNames(lang));
                            return (
                                <Button
                                    key={index}
                                    title={details || languages.label(lang)}
                                    className={classNames(styles['option'], { 'selected': selectedAudioTrackId === id })}
                                    data-id={id}
                                    onClick={onAudioTrackClick}
                                >
                                    <div className={styles['info']}>
                                        <div className={styles['lang']}>
                                            {languages.label(lang)}
                                        </div>
                                        <div className={styles['label']}>
                                            {details}
                                        </div>
                                    </div>
                                    {
                                        selectedAudioTrackId === id ?
                                            <div className={styles['icon']} />
                                            :
                                            null
                                    }
                                </Button>
                            );
                        })
                    }
                </div>
            </div>
        </div>
    );
}));

export default AudioMenu;
