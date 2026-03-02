import React from 'react';
import { useTranslation } from 'react-i18next';
import Keys from './Keys';
import styles from './Combos.less';

type Props = {
    combos: string[][],
};

const Combos = ({ combos }: Props) => {
    const { t } = useTranslation();

    return (
        <div className={styles['combos']}>
            {
                combos.map((keys, index) => (
                    <div className={styles['combo']} key={index}>
                        <Keys keys={keys} />
                        {
                            index < (combos.length - 1) && (
                                <div className={styles['separator']}>
                                    { t('SETTINGS_SHORTCUT_OR') }
                                </div>
                            )
                        }
                    </div>
                ))
            }
        </div>
    );
};

export default Combos;
