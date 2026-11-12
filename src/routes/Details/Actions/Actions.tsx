// Copyright (C) 2017-2026 Smart code 203358507

import React from 'react';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';
import Icon from '@stremio/stremio-icons/react';
import Button from 'stremio/components/Button';
import ModalDialog from 'stremio/components/ModalDialog';
import SharePrompt from 'stremio/components/SharePrompt';
import { Tooltip } from 'stremio/common/Tooltips';
import useBinaryState from 'stremio/common/useBinaryState';
import PlayButton from './PlayButton';
import Groups from './Groups';
import type { GroupsProps } from './Groups';
import styles from './Actions.less';

export type PrimaryAction = {
    icon?: string,
    label: string,
    sublabel?: string | null,
    href?: string | null,
    target?: '_blank',
    download?: string,
    disabled?: boolean,
    onClick?: () => void,
};

type Props = GroupsProps & {
    className?: string,
    primary: PrimaryAction | null,
    trailerHref?: string | null,
    shareUrl?: string | null,
    toggles?: boolean,
};

const Actions = ({ className, primary, trailerHref = null, inLibrary, onToggleLibrary, watched, onToggleWatched, ratingInfo = null, shareUrl = null, toggles = true }: Props) => {
    const { t } = useTranslation();
    const [shareOpen, openShare, closeShare] = useBinaryState(false);
    const hasSecondary = typeof trailerHref === 'string' || toggles || typeof shareUrl === 'string';

    return (
        <div className={classNames(className, styles['actions'])}>
            {
                primary !== null ?
                    <PlayButton
                        className={styles['primary']}
                        icon={primary.icon}
                        label={primary.label}
                        sublabel={primary.sublabel}
                        href={primary.href}
                        target={primary.target}
                        download={primary.download}
                        disabled={primary.disabled}
                        onClick={primary.onClick}
                    />
                    :
                    null
            }
            {
                hasSecondary ?
                    <div className={styles['secondary']}>
                        {
                            typeof trailerHref === 'string' ?
                                <Button className={styles['button']} title={t('TRAILER')} aria-label={t('TRAILER')} href={trailerHref}>
                                    <Icon className={styles['icon']} name={'trailer'} />
                                    <div className={styles['label']}>{t('TRAILER')}</div>
                                </Button>
                                :
                                null
                        }
                        {
                            toggles ?
                                <Groups
                                    className={styles['group']}
                                    inLibrary={inLibrary}
                                    onToggleLibrary={onToggleLibrary}
                                    watched={watched}
                                    onToggleWatched={onToggleWatched}
                                    ratingInfo={ratingInfo}
                                />
                                :
                                null
                        }
                        {
                            typeof shareUrl === 'string' ?
                                <Button className={classNames(styles['button'], styles['round'])} aria-label={t('CTX_SHARE')} onClick={openShare}>
                                    <Tooltip label={t('CTX_SHARE')} position={'top'} />
                                    <Icon className={styles['icon']} name={'share'} />
                                    <div className={styles['label']}>{t('CTX_SHARE')}</div>
                                </Button>
                                :
                                null
                        }
                    </div>
                    :
                    null
            }
            {
                shareOpen && typeof shareUrl === 'string' ?
                    <ModalDialog title={t('CTX_SHARE')} onCloseRequest={closeShare}>
                        <SharePrompt className={styles['share-prompt']} url={shareUrl} />
                    </ModalDialog>
                    :
                    null
            }
        </div>
    );
};

export default Actions;
