// Copyright (C) 2017-2026 Smart code 203358507

import React from 'react';
import classNames from 'classnames';
import Logo from '../Hero/Logo';
import styles from './Channel.less';

type Props = {
    className?: string,
    name: string,
    logo: string | null,
    addonName: string,
};

const Channel = ({ className, name, logo, addonName }: Props) => (
    <div className={classNames(className, styles['channel'])}>
        <Logo className={styles['logo']} logo={logo} name={name} />
        {
            addonName.length > 0 ?
                <div className={styles['addon']}>{addonName}</div>
                :
                null
        }
    </div>
);

export default Channel;
