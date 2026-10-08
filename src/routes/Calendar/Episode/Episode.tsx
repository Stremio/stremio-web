// Copyright (C) 2017-2026 Smart code 203358507

import React, { useCallback } from 'react';
import classNames from 'classnames';
import Icon from '@stremio/stremio-icons/react';
import { Button, Image } from 'stremio/components';
import styles from './Episode.less';

type Props = CalendarContentItem & {
    hideSpoilers: boolean,
    onClick?: (event: React.MouseEvent<HTMLDivElement>, target: string) => void,
};

const renderPlaceholder = () => (
    <Icon className={styles['placeholder']} name={'symbol'} />
);

const Episode = ({ name, title, season, episode, poster, background, thumbnail, deepLinks, hideSpoilers, onClick }: Props) => {
    const onEpisodeClick = useCallback((event: React.MouseEvent<HTMLDivElement>) => {
        onClick && onClick(event, deepLinks.metaDetailsStreams);
    }, [onClick, deepLinks.metaDetailsStreams]);

    const renderPoster = useCallback(() => (
        <Image className={styles['artwork']} src={poster} alt={' '} renderFallback={renderPlaceholder} />
    ), [poster]);

    const renderBackground = useCallback(() => (
        <Image className={styles['artwork']} src={background} alt={' '} renderFallback={renderPoster} />
    ), [background, renderPoster]);

    return (
        <Button className={styles['episode']} href={deepLinks.metaDetailsStreams} onClick={onEpisodeClick}>
            <div className={styles['artwork-container']}>
                <Image
                    className={classNames(styles['artwork'], { [styles['blurred']]: hideSpoilers })}
                    src={thumbnail}
                    alt={' '}
                    renderFallback={renderBackground}
                />
            </div>
            <div className={styles['info']}>
                <div className={styles['label']}>
                    S{season}E{episode}
                </div>
                <div className={styles['name']}>
                    {name}
                </div>
                {
                    title ?
                        <div className={styles['title']}>
                            {title}
                        </div>
                        :
                        null
                }
            </div>
        </Button>
    );
};

export default Episode;
