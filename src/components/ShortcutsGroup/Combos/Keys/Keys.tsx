import React, { Fragment, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import styles from './Keys.less';

type Props = {
    keys: string[],
};

const Keys = ({ keys }: Props) => {
    const { t } = useTranslation();

    const keyLabelMap: Record<string, string> = useMemo(() => ({
        'Shift': `⇧ ${t('SETTINGS_SHORTCUT_SHIFT')}`,
        'Space': t('SETTINGS_SHORTCUT_SPACE'),
        'Ctrl': t('SETTINGS_SHORTCUT_CTRL'),
        'Escape': t('SETTINGS_SHORTCUT_ESC'),
        'ArrowUp': '↑',
        'ArrowDown': '↓',
        'ArrowLeft': '←',
        'ArrowRight': '→',
    }), [t]);

    const isRange = useMemo(() => {
        return keys.length > 1 && keys.every((key) => !Number.isNaN(parseInt(key)));
    }, [keys]);

    const filteredKeys = useMemo(() => {
        return isRange ? [keys[0], keys[keys.length - 1]] : keys;
    }, [keys, isRange]);

    return (
        filteredKeys.map((key, index) => (
            <Fragment key={key}>
                <kbd>
                    {keyLabelMap[key] ?? key.toUpperCase()}
                </kbd>
                {
                    index < (filteredKeys.length - 1) && (
                        <div className={styles['separator']}>
                            {
                                isRange ? t('SETTINGS_SHORTCUT_TO') : '+'
                            }
                        </div>
                    )
                }
            </Fragment>
        ))
    );
};

export default Keys;
