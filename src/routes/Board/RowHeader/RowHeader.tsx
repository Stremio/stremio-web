// Copyright (C) 2017-2026 Smart code 203358507

import React from 'react';
import { useTranslation } from 'react-i18next';
import classnames from 'classnames';
import Icon from '@stremio/stremio-icons/react';
import { Button } from 'stremio/components';
import styles from './RowHeader.less';

type Props = {
    className?: string,
    title: string | null,
    source?: string | null,
    href?: string | null,
    canScrollBack?: boolean,
    canScrollForward?: boolean,
    onScrollBack?: () => void,
    onScrollForward?: () => void,
};

const RowHeader = ({ className, title, source, href, canScrollBack = false, canScrollForward = false, onScrollBack, onScrollForward }: Props) => {
    const { t } = useTranslation();

    return (
        <div className={classnames(className, styles['row-header'])}>
            <div className={styles['title']} title={title ?? undefined}>{title}</div>
            {
                typeof source === 'string' && source.length > 0 ?
                    <div className={styles['source']} title={source}>{source}</div>
                    :
                    null
            }
            <div className={styles['spacer']} />
            {
                canScrollBack || canScrollForward ?
                    <div className={styles['arrows']}>
                        <Button className={classnames(styles['arrow'], { 'disabled': !canScrollBack })} tabIndex={-1} onClick={onScrollBack}>
                            <Icon className={styles['arrow-icon']} name={'chevron-back'} />
                        </Button>
                        <Button className={classnames(styles['arrow'], { 'disabled': !canScrollForward })} tabIndex={-1} onClick={onScrollForward}>
                            <Icon className={styles['arrow-icon']} name={'chevron-forward'} />
                        </Button>
                    </div>
                    :
                    null
            }
            {
                typeof href === 'string' ?
                    <Button className={styles['see-all']} href={href} title={t('BUTTON_SEE_ALL')} tabIndex={-1}>
                        <div className={styles['see-all-label']}>{t('BUTTON_SEE_ALL')}</div>
                        <Icon className={styles['see-all-icon']} name={'chevron-forward'} />
                    </Button>
                    :
                    null
            }
        </div>
    );
};

export default RowHeader;
