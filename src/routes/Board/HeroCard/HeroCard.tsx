// Copyright (C) 2017-2026 Smart code 203358507

import React, { useEffect, useMemo, useState } from 'react';
import classNames from 'classnames';
import { useTranslation } from 'react-i18next';
import Icon from '@stremio/stremio-icons/react';
import Button from 'stremio/components/Button';
import Image from 'stremio/components/Image';
import { IMDB_LINK_CATEGORY } from 'stremio/common/CONSTANTS';
import getMetaDetailsHref from 'stremio/common/getMetaDetailsHref';
import styles from './HeroCard.less';

type HeroCardLink = {
    name?: string,
    category?: string,
    url?: string,
};

type HeroCardDeepLinks = {
    player?: string | null,
    metaDetailsStreams?: string | null,
    metaDetailsVideos?: string | null,
};

export type HeroCardItem = {
    _id?: string,
    id?: string,
    type?: string,
    name?: string,
    title?: string,
    logo?: string | null,
    background?: string | null,
    poster?: string | null,
    releaseInfo?: string | null,
    runtime?: string | null,
    released?: Date | null,
    description?: string | null,
    genres?: string[] | null,
    imdbRating?: string | null,
    links?: HeroCardLink[] | null,
    deepLinks?: HeroCardDeepLinks | null,
};

type Props = {
    items: HeroCardItem[],
};

type HeroSlide = {
    key: string,
    name: string,
    background: string | null,
    poster: string | null,
    imageIsPoster: boolean,
    logo: string | null,
    description: string | null,
    year: string | null,
    runtime: string | null,
    rating: string | null,
    genres: string[],
    href: string | null,
};

const MAX_SLIDES = 5;
const ROTATE_INTERVAL = 8000;
const GENRES_CATEGORY_REGEXP = /^genres?$/i;
const IMDB_ID_REGEXP = /tt\d+/;
const METAHUB_BACKGROUND_URL = 'https://live.metahub.space/background/medium';

const asString = (value: unknown): string | null => {
    return typeof value === 'string' && value.length > 0 ? value : null;
};

const normalizeSlide = (item: HeroCardItem, index: number): HeroSlide | null => {
    if (item === null || typeof item !== 'object') {
        return null;
    }

    const name = asString(item.name) ?? asString(item.title);

    if (name === null) {
        return null;
    }

    const links = Array.isArray(item.links) ? item.links.filter((link) => link !== null && typeof link === 'object') : [];
    const imdbLink = links.find((link) => link.category === IMDB_LINK_CATEGORY);
    const linkGenres = links
        .filter((link) => typeof link.category === 'string' && GENRES_CATEGORY_REGEXP.test(link.category))
        .map((link) => asString(link.name))
        .filter((genre): genre is string => genre !== null);
    const itemGenres = Array.isArray(item.genres) ?
        item.genres.filter((genre): genre is string => typeof genre === 'string' && genre.length > 0)
        : [];
    const releasedYear = item.released instanceof Date && !isNaN(item.released.getTime()) ?
        String(item.released.getFullYear())
        : null;
    const poster = asString(item.poster);
    const imdbIdMatch = [item.id, item._id].map(asString).find((id) => id !== null && IMDB_ID_REGEXP.test(id))?.match(IMDB_ID_REGEXP);
    const imdbId = imdbIdMatch ? imdbIdMatch[0] : null;
    // Catalog previews carry no backdrop, so derive it from metahub for IMDb ids.
    const background = asString(item.background) ??
        (imdbId !== null ? `${METAHUB_BACKGROUND_URL}/${imdbId}/img` : null);
    const href = asString(item.deepLinks?.player) ?? getMetaDetailsHref(item.deepLinks, item.type === 'series');

    return {
        key: `${asString(item._id) ?? asString(item.id) ?? name}-${index}`,
        name,
        background,
        poster,
        imageIsPoster: background === null && poster !== null,
        logo: asString(item.logo),
        description: asString(item.description),
        year: asString(item.releaseInfo) ?? releasedYear,
        runtime: asString(item.runtime),
        rating: asString(imdbLink?.name) ?? asString(item.imdbRating),
        genres: linkGenres.length > 0 ? linkGenres : itemGenres,
        href,
    };
};

const HeroCard = ({ items }: Props) => {
    const { t } = useTranslation();
    const [selected, setSelected] = useState(0);
    const [paused, setPaused] = useState(false);

    const slides = useMemo(() => {
        return (Array.isArray(items) ? items : [])
            .map(normalizeSlide)
            .filter((slide): slide is HeroSlide => slide !== null)
            .slice(0, MAX_SLIDES);
    }, [items]);

    const slidesKey = useMemo(() => {
        return slides.map((slide) => slide.key).join('|');
    }, [slides]);

    const slideCount = slides.length;
    const activeIndex = slideCount > 0 ? Math.min(selected, slideCount - 1) : 0;
    const activeSlide = slideCount > 0 ? slides[activeIndex] : null;

    useEffect(() => {
        setSelected(0);
    }, [slidesKey]);

    useEffect(() => {
        if (slideCount < 2 || paused) {
            return;
        }

        const timeout = window.setTimeout(() => {
            setSelected((current) => (current + 1) % slideCount);
        }, ROTATE_INTERVAL);

        return () => window.clearTimeout(timeout);
    }, [slideCount, paused, selected]);

    if (slides.length === 0 || activeSlide === null) {
        return null;
    }

    const hasMeta = activeSlide.rating !== null ||
        activeSlide.year !== null ||
        activeSlide.runtime !== null ||
        activeSlide.genres.length > 0;

    return (
        <div
            className={styles['hero-card']}
            role={'region'}
            aria-label={activeSlide.name}
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
            onFocusCapture={() => setPaused(true)}
            onBlurCapture={() => setPaused(false)}
        >
            <div className={styles['viewport']}>
                {
                    slides.map((slide, index) => (
                        slide.background !== null || slide.poster !== null ?
                            <div key={slide.key} className={classNames(styles['backdrop'], { [styles['active']]: index === activeIndex })}>
                                <Image
                                    className={classNames(styles['background-image'], { [styles['poster-image']]: slide.imageIsPoster })}
                                    src={slide.background ?? slide.poster ?? undefined}
                                    fallbackSrc={slide.background !== null ? slide.poster ?? undefined : undefined}
                                    alt={' '}
                                    loading={'eager'}
                                    draggable={false}
                                />
                            </div>
                            :
                            null
                    ))
                }
            </div>
            <div className={styles['gradient-overlay']} />
            <div className={styles['content-overlay']}>
                <div key={activeSlide.key} className={styles['content-container']}>
                    {
                        activeSlide.logo !== null ?
                            <Image
                                className={styles['logo']}
                                src={activeSlide.logo}
                                alt={activeSlide.name}
                                draggable={false}
                                renderFallback={() => <div className={styles['title']}>{activeSlide.name}</div>}
                            />
                            :
                            <div className={styles['title']}>{activeSlide.name}</div>
                    }
                    {
                        hasMeta ?
                            <div className={styles['meta-container']}>
                                {
                                    activeSlide.rating !== null ?
                                        <div className={styles['rating-container']}>
                                            <div className={styles['imdb-badge']}>IMDb</div>
                                            <div className={styles['rating-label']}>{activeSlide.rating}</div>
                                        </div>
                                        :
                                        null
                                }
                                {
                                    activeSlide.year !== null ?
                                        <div className={styles['meta-label']}>{activeSlide.year}</div>
                                        :
                                        null
                                }
                                {
                                    activeSlide.runtime !== null ?
                                        <div className={styles['meta-label']}>{activeSlide.runtime}</div>
                                        :
                                        null
                                }
                                {
                                    activeSlide.genres.length > 0 ?
                                        <div className={classNames(styles['meta-label'], styles['genres'])}>{activeSlide.genres.join(' · ')}</div>
                                        :
                                        null
                                }
                            </div>
                            :
                            null
                    }
                    {
                        activeSlide.description !== null ?
                            <div className={styles['description']}>{activeSlide.description}</div>
                            :
                            null
                    }
                    {
                        activeSlide.href !== null ?
                            <Button className={styles['watch-button']} href={activeSlide.href} tabIndex={0}>
                                <Icon className={styles['watch-icon']} name={'play'} />
                                <div className={styles['watch-label']}>{t('WATCH_NOW')}</div>
                            </Button>
                            :
                            null
                    }
                </div>
            </div>
            {
                slides.length > 1 ?
                    <div className={styles['dots-container']}>
                        {
                            slides.map((slide, index) => (
                                <Button
                                    key={slide.key}
                                    className={classNames(styles['dot'], { [styles['active']]: index === activeIndex })}
                                    title={slide.name}
                                    tabIndex={0}
                                    onClick={() => setSelected(index)}
                                >
                                    {null}
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

export default HeroCard;
