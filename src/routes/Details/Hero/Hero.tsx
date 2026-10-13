// Copyright (C) 2017-2026 Smart code 203358507

import React from 'react';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';
import { useProfile } from 'stremio/common';
import { formatDate, getMinutesLeft, hidesSpoiler, parseDate } from '../format';
import useMetaLinks from './useMetaLinks';
import Logo from './Logo';
import Still from './Still';
import Facts from './Facts';
import Description from './Description';
import Links from './Links';
import styles from './Hero.less';

type Props = {
    className?: string,
    metaItem: MetaItemMetaDetails,
    video: Video | null,
    streams?: boolean,
    libraryItem: LibraryItem | null,
    compact?: boolean,
    children?: React.ReactNode,
};

const Hero = ({ className, metaItem, video, streams = false, libraryItem, compact = false, children }: Props) => {
    const { t, i18n } = useTranslation();
    const profile = useProfile();
    const { groups, imdb } = useMetaLinks(metaItem.links);
    const released = parseDate(metaItem.released);
    const minutesLeft = video !== null ? getMinutesLeft(libraryItem, video.id) : null;

    return (
        <div className={classNames(className, styles['hero'], { [styles['compact']]: compact })}>
            {
                video === null ?
                    <React.Fragment>
                        {
                            !compact ?
                                <Logo className={styles['logo']} logo={metaItem.logo} name={metaItem.name} small={streams} />
                                :
                                null
                        }
                        <Facts
                            className={styles['facts']}
                            items={[
                                metaItem.releaseInfo || (released !== null ? String(released.getFullYear()) : null),
                                metaItem.runtime,
                            ]}
                            imdb={imdb}
                        />
                        <Description className={styles['description']} text={metaItem.description} />
                        {
                            !compact ?
                                <Links className={styles['links']} groups={groups} />
                                :
                                null
                        }
                    </React.Fragment>
                    :
                    <React.Fragment>
                        {
                            !compact ?
                                <React.Fragment>
                                    <Logo className={styles['logo']} logo={metaItem.logo} name={metaItem.name} small={true} />
                                    <Still className={styles['still']} thumbnail={video.thumbnail} blurred={hidesSpoiler(video, profile.settings.hideSpoilers)} />
                                    <h1 className={styles['title']}>{video.title || video.id}</h1>
                                </React.Fragment>
                                :
                                null
                        }
                        <Facts
                            className={styles['facts']}
                            items={[
                                formatDate(video.released, i18n.language),
                                metaItem.runtime,
                                minutesLeft !== null ? t('CONTINUE_WATCHING_TIME_LEFT', { minutes: minutesLeft }) : null,
                            ]}
                        />
                        <Description className={styles['description']} text={video.overview || metaItem.description} />
                    </React.Fragment>
            }
            <div className={styles['spacer']} />
            {children}
        </div>
    );
};

export default Hero;
