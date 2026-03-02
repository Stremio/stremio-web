import React from 'react';
import classNames from 'classnames';
import { t } from 'i18next';
import styles from './Option.less';
import Icon from '@stremio/stremio-icons/react';

type Props = {
    className?: string,
    icon?: string,
    label: string,
    children: React.ReactNode,
};

const Option = ({ className, icon, label, children }: Props) => {
    return (
        <div className={classNames(className, styles['option'])}>
            <div className={styles['heading']}>
                {
                    icon &&
                        <Icon
                            className={styles['icon']}
                            name={icon}
                        />
                }
                <div className={styles['label']}>
                    {t(label)}
                </div>
            </div>
            <div className={styles['content']}>
                { children }
            </div>
        </div>
    );
};

export default Option;
