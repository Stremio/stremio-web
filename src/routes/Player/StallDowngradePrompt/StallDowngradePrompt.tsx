import React, { forwardRef, memo } from 'react';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';
import { Button } from 'stremio/components';
import styles from './StallDowngradePrompt.less';

type Props = {
    className?: string,
    height: number,
    onSwitch: () => void,
    onDismiss: () => void,
};

const StallDowngradePrompt = memo(forwardRef<HTMLDivElement, Props>(({
    className,
    height,
    onSwitch,
    onDismiss,
}, ref) => {
    const { t } = useTranslation();

    return (
        <div ref={ref} className={classNames(className, styles['stall-prompt'])}>
            <div className={styles['message']}>
                {t('PLAYER_SMART_PLAY_LOWER_QUALITY', { defaultValue: 'Playback is buffering. Switch to a lower quality?' })}
            </div>
            <div className={styles['buttons']}>
                <Button className={styles['action']} onClick={onSwitch}>
                    {t('PLAYER_SMART_PLAY_SWITCH_QUALITY', { height, defaultValue: 'Switch to {{height}}p' })}
                </Button>
                <Button className={styles['action']} onClick={onDismiss}>
                    {t('PLAYER_SMART_PLAY_KEEP_QUALITY', { defaultValue: 'Keep current' })}
                </Button>
            </div>
        </div>
    );
}));

export default StallDowngradePrompt;
