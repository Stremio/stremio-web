// Copyright (C) 2017-2026 Smart code 203358507

import React from 'react';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';
import Icon from '@stremio/stremio-icons/react';
import Button from 'stremio/components/Button';
import Logo from 'stremio/components/Logo';
import ToggleButton from 'stremio/components/ToggleButton';
import { Facts } from 'stremio/components/MetaPreview';
import { Tooltip } from 'stremio/common/Tooltips';
import getMetaDetailsHref from 'stremio/common/getMetaDetailsHref';
import getReleaseYear from 'stremio/common/getReleaseYear';
import useMetaLinks from 'stremio/common/useMetaLinks';
import CONSTANTS from 'stremio/common/CONSTANTS';
import styles from './Slide.less';

type Props = {
    id: string,
    item: MetaItemPreviewCatalogsWithExtra,
    active: boolean,
    onToggleLibrary: (item: MetaItemPreviewCatalogsWithExtra) => void,
};

const Slide = ({ id, item, active, onToggleLibrary }: Props) => {
    const { t } = useTranslation();
    const { groups, imdb } = useMetaLinks(item.links);
    const genres = groups.find(({ category }) => category === CONSTANTS.GENRES_LINK_CATEGORY)?.links.map(({ label }) => label).join(', ') ?? null;
    const detailsHref = getMetaDetailsHref(item.deepLinks);
    const watchHref = item.deepLinks.player ?? item.deepLinks.metaDetailsStreams ?? item.deepLinks.metaDetailsVideos;
    const trailerHref = item.trailerStreams[0]?.deepLinks.player ?? null;
    const libraryLabel = item.inLibrary ? t('REMOVE_FROM_LIB') : t('ADD_TO_LIB');

    return (
        <div id={id} className={classNames(styles['slide'], { [styles['on']]: active })} role={'tabpanel'} aria-hidden={!active}>
            <Button className={styles['title']} href={detailsHref ?? undefined} title={item.name}>
                <Logo className={styles['logo']} logo={item.logo} name={item.name} />
            </Button>
            <Facts className={styles['facts']} items={[item.releaseInfo || getReleaseYear(item.released), item.runtime]} imdb={imdb}>
                {
                    genres !== null ?
                        <div className={styles['genres']}>{genres}</div>
                        :
                        null
                }
            </Facts>
            {
                typeof item.description === 'string' && item.description.length > 0 ?
                    <p className={styles['description']}>{item.description}</p>
                    :
                    null
            }
            <div className={styles['actions']}>
                {
                    watchHref !== null ?
                        <Button className={styles['watch']} href={watchHref} title={t('BOARD_SPOTLIGHT_WATCH')}>
                            <Icon className={styles['icon']} name={'play'} />
                            <div className={styles['label']}>{t('BOARD_SPOTLIGHT_WATCH')}</div>
                        </Button>
                        :
                        null
                }
                <ToggleButton
                    className={styles['toggle']}
                    variant={'library'}
                    on={item.inLibrary}
                    label={libraryLabel}
                    onClick={() => onToggleLibrary(item)}
                />
                {
                    trailerHref !== null ?
                        <Button className={styles['round']} href={trailerHref} aria-label={t('TRAILER')}>
                            <Tooltip label={t('TRAILER')} position={'top'} />
                            <Icon className={styles['icon']} name={'trailer'} />
                        </Button>
                        :
                        null
                }
            </div>
        </div>
    );
};

export default Slide;
