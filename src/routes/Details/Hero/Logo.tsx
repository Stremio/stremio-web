// Copyright (C) 2017-2026 Smart code 203358507

import React, { useCallback } from 'react';
import classNames from 'classnames';
import Image from 'stremio/components/Image';
import styles from './Logo.less';

type Props = {
    className?: string,
    logo: string | null,
    name: string,
    small?: boolean,
};

const Logo = ({ className, logo, name, small = false }: Props) => {
    const renderFallback = useCallback(() => (
        <div className={classNames(className, styles['name'], { [styles['small']]: small })}>{name}</div>
    ), [className, name, small]);

    return typeof logo === 'string' && logo.length > 0 ?
        <Image
            className={classNames(className, styles['logo'], { [styles['small']]: small })}
            src={logo}
            alt={name}
            title={name}
            renderFallback={renderFallback}
        />
        :
        renderFallback();
};

export default Logo;
