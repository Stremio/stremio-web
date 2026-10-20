// Copyright (C) 2017-2026 Smart code 203358507

import React from 'react';
import classNames from 'classnames';
import Icon from '@stremio/stremio-icons/react';
import Button from 'stremio/components/Button';
import type { MetaLink } from './useMetaLinks';
import styles from './Facts.less';

type Props = {
    className?: string,
    items: (string | null | undefined)[],
    imdb?: MetaLink | null,
};

const Facts = ({ className, items, imdb = null }: Props) => {
    const facts = items.filter((item): item is string => typeof item === 'string' && item.length > 0);
    if (facts.length === 0 && imdb === null) {
        return null;
    }

    return (
        <div className={classNames(className, styles['facts'])}>
            {
                facts.map((fact, index) => (
                    <div key={index} className={styles['fact']}>{fact}</div>
                ))
            }
            {
                imdb !== null ?
                    <Button className={styles['imdb']} title={imdb.label} href={imdb.href} target={'_blank'}>
                        <div className={styles['rating']}>{imdb.label}</div>
                        <Icon className={styles['icon']} name={'imdb'} />
                    </Button>
                    :
                    null
            }
        </div>
    );
};

export default Facts;
