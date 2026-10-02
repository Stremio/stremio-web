// Copyright (C) 2017-2026 Smart code 203358507

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import classnames from 'classnames';
import Icon from '@stremio/stremio-icons/react';
import { Button, Image } from 'stremio/components';
import { useRouteActive } from 'stremio/common/useRouteFocused';
import getMetaDetailsHref from 'stremio/common/getMetaDetailsHref';
import styles from './BoardHero.less';

const MAX_SLIDES = 5;
const ROTATE_INTERVAL = 8000;
const GENRES_LINK_CATEGORY = 'Genres';

type Catalogs = Catalog<Loadable<MetaItemPreviewCatalogsWithExtra[]>, DiscoverDeepLinks>[] | null;

type Props = {
    className?: string,
    slides: MetaItemPreviewCatalogsWithExtra[],
};

// Uses the first catalog, in board order, that has backdrops. Waits while an earlier
// catalog is still loading so the hero doesn't switch sources as catalogs arrive.
export const pickSlides = (catalogs: Catalogs): MetaItemPreviewCatalogsWithExtra[] => {
    for (const { content } of catalogs ?? []) {
        if (content?.type === 'Err') {
            continue;
        }

        if (content?.type !== 'Ready') {
            return [];
        }

        const slides = content.content
            .filter(({ background }) => typeof background === 'string' && background.length > 0)
            .slice(0, MAX_SLIDES);

        if (slides.length > 0) {
            return slides;
        }
    }

    return [];
};

const BoardHero = ({ className, slides }: Props) => {
    const { t } = useTranslation();
    const routeActive = useRouteActive();
    const [selected, setSelected] = useState(0);
    const [paused, setPaused] = useState(false);

    const slide = slides[Math.min(selected, slides.length - 1)] ?? null;

    const genres = useMemo(() => {
        return (slide?.links ?? [])
            .filter(({ category }) => category === GENRES_LINK_CATEGORY)
            .slice(0, 3)
            .map(({ name }) => name);
    }, [slide]);

    const detailsHref = useMemo(() => {
        return slide ? getMetaDetailsHref(slide.deepLinks, slide.type === 'series') : null;
    }, [slide]);

    const trailerHref = useMemo(() => {
        return slide?.trailerStreams?.[0]?.deepLinks?.player ?? null;
    }, [slide]);

    const onMouseEnter = useCallback(() => setPaused(true), []);
    const onMouseLeave = useCallback(() => setPaused(false), []);

    useEffect(() => {
        setSelected((selected) => selected >= slides.length ? 0 : selected);
    }, [slides.length]);

    useEffect(() => {
        if (!routeActive || paused || slides.length < 2) {
            return;
        }

        const timeout = setTimeout(() => {
            setSelected((selected) => (selected + 1) % slides.length);
        }, ROTATE_INTERVAL);

        return () => clearTimeout(timeout);
    }, [routeActive, paused, selected, slides.length]);

    const renderLogoFallback = useCallback(() => (
        <div className={styles['title']}>{slide?.name}</div>
    ), [slide]);

    if (slide === null) {
        return null;
    }

    return (
        <div
            className={classnames(className, styles['board-hero'])}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
            onFocus={onMouseEnter}
            onBlur={onMouseLeave}
        >
            {
                slides.map((item, index) => (
                    <div key={item.id} className={classnames(styles['backdrop'], { [styles['active']]: index === selected })}>
                        <Image className={styles['backdrop-image']} src={item.background ?? undefined} alt={' '} />
                    </div>
                ))
            }
            <div className={styles['shade']} />
            <div key={slide.id} className={styles['content']}>
                <div className={styles['logo-container']}>
                    {
                        typeof slide.logo === 'string' && slide.logo.length > 0 ?
                            <Image className={styles['logo']} src={slide.logo} alt={slide.name} renderFallback={renderLogoFallback} />
                            :
                            renderLogoFallback()
                    }
                </div>
                <div className={styles['meta-info']}>
                    {
                        typeof slide.releaseInfo === 'string' && slide.releaseInfo.length > 0 ?
                            <div className={styles['meta-info-item']}>{slide.releaseInfo}</div>
                            :
                            null
                    }
                    {
                        typeof slide.runtime === 'string' && slide.runtime.length > 0 ?
                            <div className={styles['meta-info-item']}>{slide.runtime}</div>
                            :
                            null
                    }
                    {
                        genres.length > 0 ?
                            <div className={styles['meta-info-item']}>{genres.join(' · ')}</div>
                            :
                            null
                    }
                </div>
                {
                    typeof slide.description === 'string' && slide.description.length > 0 ?
                        <div className={styles['description']}>{slide.description}</div>
                        :
                        null
                }
                <div className={styles['actions']}>
                    {
                        detailsHref !== null ?
                            <Button className={classnames(styles['action'], styles['primary'])} href={detailsHref} title={t('WATCH_NOW')}>
                                <Icon className={styles['action-icon']} name={'play'} />
                                <div className={styles['action-label']}>{t('WATCH_NOW')}</div>
                            </Button>
                            :
                            null
                    }
                    {
                        trailerHref !== null ?
                            <Button className={styles['action']} href={trailerHref} title={t('TRAILER')}>
                                <Icon className={styles['action-icon']} name={'trailer'} />
                                <div className={styles['action-label']}>{t('TRAILER')}</div>
                            </Button>
                            :
                            null
                    }
                </div>
            </div>
            {
                slides.length > 1 ?
                    <div className={styles['indicators']}>
                        {
                            slides.map((item, index) => (
                                <Button
                                    key={item.id}
                                    className={classnames(styles['indicator'], { [styles['active']]: index === selected })}
                                    title={item.name}
                                    tabIndex={-1}
                                    onClick={() => setSelected(index)}
                                >
                                    <div className={styles['indicator-bar']} />
                                </Button>
                            ))
                        }
                    </div>
                    :
                    null
            }
        </div>
    );
};

export default BoardHero;
