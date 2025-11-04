import React from 'react';
import classNames from 'classnames';
import { useTranslation } from 'react-i18next';
import Combos from './Combos';
import styles from './ShortcutsGroup.less';

type Props = {
    className?: string,
    label: string,
    shortcuts: Shortcut[],
};

const ShortcutsGroup = ({ className, label, shortcuts }: Props) => {
    const { t } = useTranslation();

    return (
        <div className={classNames(className, styles['shortcuts-group'])}>
            <div className={styles['title']}>
                {t(label)}
            </div>

            <div className={styles['shortcuts']}>
                {
                    shortcuts.map(({ name, label, combos }) => (
                        <div className={styles['shortcut']} key={name}>
                            <div className={styles['label']}>
                                {t(label)}
                            </div>
                            <Combos combos={combos} />
                        </div>
                    ))
                }
            </div>
        </div>
    );
};

export default ShortcutsGroup;
