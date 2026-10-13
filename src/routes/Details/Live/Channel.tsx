// Copyright (C) 2017-2026 Smart code 203358507

import React from 'react';
import classNames from 'classnames';
import Icon from '@stremio/stremio-icons/react';
import Image from 'stremio/components/Image';
import styles from './Channel.less';

type Props = {
    className?: string,
    name: string,
    logo: string | null,
    addonName: string,
};

const renderFallback = () => <Icon className={styles['fallback']} name={'tv'} />;

const Channel = ({ className, name, logo, addonName }: Props) => (
    <div className={classNames(className, styles['channel'])}>
        <div className={styles['mark']} aria-hidden={'true'}>
            {
                typeof logo === 'string' && logo.length > 0 ?
                    <Image className={styles['logo']} src={logo} alt={''} renderFallback={renderFallback} />
                    :
                    renderFallback()
            }
        </div>
        <div className={styles['name']}>{name}</div>
        {
            addonName.length > 0 ?
                <div className={styles['addon']}>{addonName}</div>
                :
                null
        }
    </div>
);

export default Channel;
