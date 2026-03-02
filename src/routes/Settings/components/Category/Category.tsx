import React from 'react';
import { t } from 'i18next';
import Icon from '@stremio/stremio-icons/react';
import styles from './Category.less';

type Props = {
    icon: string,
    label: string,
    children: React.ReactNode,
};

const Category = ({ icon, label, children }: Props) => {
    return (
        <div className={styles['category']}>
            <div className={styles['heading']}>
                <Icon className={styles['icon']} name={icon} />
                <div className={styles['label']}>
                    {t(label)}
                </div>
            </div>
            {children}
        </div>
    );
};

export default Category;
