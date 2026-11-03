// Copyright (C) 2017-2026 Smart code 203358507

import React from 'react';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';
import Icon from '@stremio/stremio-icons/react';
import Button from 'stremio/components/Button';
import ToggleButton from 'stremio/components/ToggleButton';
import { Tooltip } from 'stremio/common/Tooltips';
import styles from './Actions.less';

export type ShowAction = {
    href: string,
    label?: string,
    icon?: string,
    onClick?: (event: React.MouseEvent<HTMLDivElement>) => void,
};

type Props = {
    trailerHref: string | null,
    show: ShowAction | null,
    inLibrary: boolean,
    watched: boolean,
    onToggleLibrary?: () => void,
    onToggleWatched?: () => void,
};

const Actions = ({ trailerHref, show, inLibrary, watched, onToggleLibrary, onToggleWatched }: Props) => {
    const { t } = useTranslation();
    const showLabel = show?.label ?? t('SHOW');

    return (
        <React.Fragment>
            {
                trailerHref !== null ?
                    <Button className={classNames(styles['button'], styles['round'])} aria-label={t('TRAILER')} href={trailerHref}>
                        <Tooltip label={t('TRAILER')} position={'top'} />
                        <Icon className={styles['icon']} name={'trailer'} />
                    </Button>
                    :
                    null
            }
            {
                typeof onToggleLibrary === 'function' && typeof onToggleWatched === 'function' ?
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
                    :
                    null
            }
            {
                show !== null ?
                    <Button className={classNames(styles['button'], styles['show'])} title={showLabel} href={show.href} onClick={show.onClick}>
                        <Icon className={styles['icon']} name={show.icon ?? 'play'} />
                        <div className={styles['label']}>{showLabel}</div>
                    </Button>
                    :
                    null
            }
        </React.Fragment>
    );
};

export default Actions;
