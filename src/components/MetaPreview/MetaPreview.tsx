// Copyright (C) 2017-2026 Smart code 203358507

import React from 'react';
import classNames from 'classnames';
import Image from 'stremio/components/Image';
import useMetaLinks from 'stremio/common/useMetaLinks';
import Facts from './Facts';
import Links from './Links';
import Actions from './Actions';
import type { ShowAction } from './Actions';
import styles from './MetaPreview.less';

type Props = {
    className?: string,
    name: string,
    logo?: string | null,
    background?: string | null,
    runtime?: string | null,
    releaseInfo?: string | null,
    released?: Date | string | null,
    description?: string | null,
    links?: Link[] | null,
    trailerHref?: string | null,
    show?: ShowAction | null,
    inLibrary?: boolean,
    watched?: boolean,
    onToggleLibrary?: () => void,
    onToggleWatched?: () => void,
    metadata?: React.ReactNode,
    children?: React.ReactNode,
};

const renderNothing = () => null;

const getYear = (released: Date | string | null): string | null => {
    const date = typeof released === 'string' ? new Date(released) : released;
    return date !== null && !Number.isNaN(date.getTime()) ? String(date.getFullYear()) : null;
};

const MetaPreview = ({
    className,
    name,
    logo = null,
    background = null,
    runtime = null,
    releaseInfo = null,
    released = null,
    description = null,
    links = null,
    trailerHref = null,
    show = null,
    inLibrary = false,
    watched = false,
    onToggleLibrary,
    onToggleWatched,
    metadata,
    children,
}: Props) => {
    const { groups, imdb } = useMetaLinks(links);
    const toggles = typeof onToggleLibrary === 'function' && typeof onToggleWatched === 'function';

    return (
        <div className={classNames(className, styles['meta-preview'])}>
            {
                typeof background === 'string' && background.length > 0 ?
                    <div className={styles['art']} aria-hidden={'true'}>
                        <Image className={styles['image']} src={background} alt={''} renderFallback={renderNothing} />
                    </div>
                    :
                    null
            }
            <div className={styles['body']}>
                <Image
                    className={styles['logo']}
                    src={logo ?? undefined}
                    alt={name}
                    title={name}
                    renderFallback={() => <div className={styles['name']}>{name}</div>}
                />
                {metadata ?? <Facts className={styles['facts']} items={[runtime, releaseInfo || getYear(released)]} imdb={imdb} />}
                {
                    typeof description === 'string' && description.length > 0 ?
                        <p className={styles['description']}>{description}</p>
                        :
                        null
                }
                <Links className={styles['links']} groups={groups} />
                {children}
            </div>
            {
                trailerHref !== null || show !== null || toggles ?
                    <div className={styles['actions']}>
                        <Actions
                            trailerHref={trailerHref}
                            show={show}
                            inLibrary={inLibrary}
                            watched={watched}
                            onToggleLibrary={onToggleLibrary}
                            onToggleWatched={onToggleWatched}
                        />
                    </div>
                    :
                    null
            }
        </div>
    );
};

export default MetaPreview;
