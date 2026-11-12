// Copyright (C) 2017-2026 Smart code 203358507

import React from 'react';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';
import Icon from '@stremio/stremio-icons/react';
import Button from 'stremio/components/Button';
import ToggleButton from 'stremio/components/ToggleButton';
import { Tooltip } from 'stremio/common/Tooltips';
import styles from './Actions.less';

type Props = {
    className?: string,
    trailerHref: string | null,
    showHref: string | null,
    inLibrary: boolean,
    watched: boolean,
    onToggleLibrary: () => void,
    onToggleWatched: () => void,
};

const Actions = ({ className, trailerHref, showHref, inLibrary, watched, onToggleLibrary, onToggleWatched }: Props) => {
    const { t } = useTranslation();

    return (
        <div className={classNames(className, styles['actions'])}>
            {
                trailerHref !== null ?
                    <Button className={classNames(styles['button'], styles['round'])} aria-label={t('TRAILER')} href={trailerHref}>
                        <Tooltip label={t('TRAILER')} position={'top'} />
                        <Icon className={styles['icon']} name={'trailer'} />
                    </Button>
                    :
                    null
            }
            <div className={styles['group']} role={'group'}>
                <ToggleButton
                    className={styles['toggle']}
                    variant={'library'}
                    on={inLibrary}
                    label={inLibrary ? t('REMOVE_FROM_LIB') : t('ADD_TO_LIB')}
                    onClick={onToggleLibrary}
                />
                <ToggleButton
                    className={styles['toggle']}
                    variant={'watched'}
                    on={watched}
                    label={watched ? t('CTX_MARK_UNWATCHED') : t('CTX_MARK_WATCHED')}
                    onClick={onToggleWatched}
                />
            </div>
            {
                showHref !== null ?
                    <Button className={classNames(styles['button'], styles['show'])} title={t('SHOW')} href={showHref}>
                        <Icon className={styles['icon']} name={'play'} />
                        <div className={styles['label']}>{t('SHOW')}</div>
                    </Button>
                    :
                    null
            }
        </div>
    );
};

export default Actions;
