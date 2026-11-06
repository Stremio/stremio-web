// Copyright (C) 2017-2026 Smart code 203358507

import React from 'react';
import Image from 'stremio/components/Image';
import useMetaLinks from 'stremio/common/useMetaLinks';
import Facts from './Facts';
import Links from './Links';
import Actions from './Actions';
import styles from './Preview.less';

type Handlers = {
    onToggleLibrary: () => void,
    onToggleWatched: () => void,
};

type ContentProps = Handlers & {
    metaItem: MetaItemPreviewDiscover,
};

type Props = Handlers & {
    metaItem: MetaItemPreviewDiscover | null,
};

const renderNothing = () => null;

const Content = ({ metaItem, onToggleLibrary, onToggleWatched }: ContentProps) => {
    const { groups, imdb } = useMetaLinks(metaItem.links);
    const released = metaItem.released;
    const year = released instanceof Date && !Number.isNaN(released.getTime()) ? String(released.getFullYear()) : null;
    const { player, metaDetailsStreams, metaDetailsVideos } = metaItem.deepLinks;

    return (
        <React.Fragment>
            <div className={styles['body']}>
                <Image
                    className={styles['logo']}
                    src={metaItem.logo ?? undefined}
                    alt={metaItem.name}
                    title={metaItem.name}
                    renderFallback={() => <div className={styles['name']}>{metaItem.name}</div>}
                />
                <Facts className={styles['facts']} items={[metaItem.runtime, metaItem.releaseInfo || year]} imdb={imdb} />
                {
                    typeof metaItem.description === 'string' && metaItem.description.length > 0 ?
                        <p className={styles['description']}>{metaItem.description}</p>
                        :
                        null
                }
                <Links className={styles['links']} groups={groups} />
            </div>
            <Actions
                className={styles['actions']}
                trailerHref={metaItem.trailerStreams[0]?.deepLinks.player ?? null}
                showHref={player ?? metaDetailsStreams ?? metaDetailsVideos}
                inLibrary={metaItem.inLibrary}
                watched={metaItem.watched}
                onToggleLibrary={onToggleLibrary}
                onToggleWatched={onToggleWatched}
            />
        </React.Fragment>
    );
};

const Preview = ({ metaItem, onToggleLibrary, onToggleWatched }: Props) => (
    <section className={styles['preview']} aria-label={metaItem?.name}>
        <div className={styles['art']} aria-hidden={'true'}>
            <Image className={styles['image']} src={metaItem?.poster ?? undefined} alt={''} renderFallback={renderNothing} />
        </div>
        {
            metaItem !== null ?
                <Content metaItem={metaItem} onToggleLibrary={onToggleLibrary} onToggleWatched={onToggleWatched} />
                :
                null
        }
    </section>
);

export default Preview;
