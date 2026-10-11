// Copyright (C) 2017-2026 Smart code 203358507

import React from 'react';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';
import Icon from '@stremio/stremio-icons/react';
import Button from 'stremio/components/Button';
import ModalDialog from 'stremio/components/ModalDialog';
import SharePrompt from 'stremio/components/SharePrompt';
import useRating from 'stremio/components/MetaPreview/Ratings/useRating';
import { Tooltip } from 'stremio/common/Tooltips';
import useBinaryState from 'stremio/common/useBinaryState';
import PlayButton from './PlayButton';
import ToggleButton from './ToggleButton';
import RateButton from './RateButton';
import styles from './Actions.less';

export type PrimaryAction = {
    icon?: string,
    label: string,
    sublabel?: string | null,
    href?: string | null,
    disabled?: boolean,
};

type Props = {
    className?: string,
    primary: PrimaryAction | null,
    trailerHref?: string | null,
    inLibrary: boolean,
    onToggleLibrary: () => void,
    watched?: boolean,
    onToggleWatched?: () => void,
    ratingInfo?: Loadable<RatingInfo> | null,
    shareUrl?: string | null,
};

const Actions = ({ className, primary, trailerHref = null, inLibrary, onToggleLibrary, watched, onToggleWatched, ratingInfo = null, shareUrl = null }: Props) => {
    const { t } = useTranslation();
    const [shareOpen, openShare, closeShare] = useBinaryState(false);
    const { onLiked, onLoved, liked, loved } = useRating(ratingInfo ?? undefined);

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
                        disabled={primary.disabled}
                    />
                    :
                    null
            }
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
                <div className={styles['group']} role={'group'}>
                    <ToggleButton
                        variant={'library'}
                        on={inLibrary}
                        label={inLibrary ? t('REMOVE_FROM_LIB') : t('ADD_TO_LIB')}
                        onClick={onToggleLibrary}
                    />
                    {
                        typeof onToggleWatched === 'function' ?
                            <ToggleButton
                                variant={'watched'}
                                on={watched === true}
                                label={watched ? t('CTX_MARK_UNWATCHED') : t('CTX_MARK_WATCHED')}
                                onClick={onToggleWatched}
                            />
                            :
                            null
                    }
                </div>
                {
                    ratingInfo !== null ?
                        <div className={styles['group']} role={'group'}>
                            <RateButton
                                icon={liked ? 'thumbs-up' : 'thumbs-up-outline'}
                                on={liked}
                                disabled={ratingInfo.type !== 'Ready'}
                                label={liked ? t('RATING_UNLIKE') : t('RATING_LIKE')}
                                onClick={onLiked}
                            />
                            <RateButton
                                icon={loved ? 'heart' : 'heart-outline'}
                                on={loved}
                                disabled={ratingInfo.type !== 'Ready'}
                                label={loved ? t('RATING_UNLOVE') : t('RATING_LOVE')}
                                onClick={onLoved}
                            />
                        </div>
                        :
                        null
                }
                {
                    typeof shareUrl === 'string' ?
                        <Button className={classNames(styles['button'], styles['round'])} aria-label={t('CTX_SHARE')} onClick={openShare}>
                            <Tooltip label={t('CTX_SHARE')} position={'top'} />
                            <Icon className={styles['icon']} name={'share'} />
                        </Button>
                        :
                        null
                }
            </div>
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
