// Copyright (C) 2017-2026 Smart code 203358507

import React from 'react';
import Logo from '../Hero/Logo';
import styles from './HeroArt.less';

type Props = {
    logo: string | null,
    name: string,
    title?: string | null,
};

const Bar = ({ logo, name, title = null }: Props) => (
    <div className={styles['bar']} aria-hidden={'true'}>
        <div className={styles['bar-content']}>
            <div className={styles['bar-title']}>
                {
                    typeof title === 'string' ?
                        title
                        :
                        <Logo className={styles['bar-logo']} logo={logo} name={name} small={true} />
                }
            </div>
        </div>
    </div>
);

export default Bar;
