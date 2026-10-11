// Copyright (C) 2017-2026 Smart code 203358507

import React from 'react';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';
import Button from 'stremio/components/Button';
import { useTranslate } from 'stremio/common';
import type { MetaLinkGroup } from './useMetaLinks';
import styles from './Links.less';

type Props = {
    className?: string,
    groups: MetaLinkGroup[],
};

const Links = ({ className, groups }: Props) => {
    const { t } = useTranslation();
    const { stringWithPrefix } = useTranslate();

    if (groups.length === 0) {
        return null;
    }

    return (
        <div className={classNames(className, styles['links'])}>
            {
                groups.map(({ category, links }) => (
                    <React.Fragment key={category}>
                        <div className={styles['label']}>{stringWithPrefix(category.toUpperCase(), 'LINKS_')}</div>
                        <div className={styles['pills']}>
                            {
                                links.map(({ label, href }, index) => (
                                    <Button key={index} className={styles['pill']} title={label} href={href}>
                                        {t(label)}
                                    </Button>
                                ))
                            }
                        </div>
                    </React.Fragment>
                ))
            }
        </div>
    );
};

export default Links;
