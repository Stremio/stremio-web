// Copyright (C) 2017-2026 Smart code 203358507

import React from 'react';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';
import Button from 'stremio/components/Button';
import useTranslate from 'stremio/common/useTranslate';
import type { MetaLinkGroup } from 'stremio/common/useMetaLinks';
import styles from './Links.less';

type Props = {
    className?: string,
    groups: MetaLinkGroup[],
};

const Links = ({ className, groups }: Props) => {
    const { t } = useTranslation();
    const { stringWithPrefix } = useTranslate();

    return (
        <React.Fragment>
            {
                groups.map(({ category, links }) => (
                    <div key={category} className={classNames(className, styles['links'])}>
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
                    </div>
                ))
            }
        </React.Fragment>
    );
};

export default Links;
