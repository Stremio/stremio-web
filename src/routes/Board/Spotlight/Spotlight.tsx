// Copyright (C) 2017-2026 Smart code 203358507

import React, { useId, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';
import { useCore } from 'stremio/core';
import Image from 'stremio/components/Image';
import { useRouteActive } from 'stremio/common/useRouteFocused';
import useMediaQuery from 'stremio/common/useMediaQuery';
import screenSizes from 'stremio/common/screen-sizes.less';
import useCarousel from './useCarousel';
import Slide from './Slide';
import Pager from './Pager';
import styles from './Spotlight.less';

type Props = {
    className?: string,
    items: MetaItemPreviewCatalogsWithExtra[],
    sentinelRef?: React.Ref<HTMLDivElement>,
};

const SWIPE_THRESHOLD = 40;
const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)';
const MOBILE_QUERY = `(max-width: ${screenSizes.xxsmall})`;

const renderNothing = () => null;

const Spotlight = ({ className, items, sentinelRef }: Props) => {
    const { t } = useTranslation();
    const core = useCore();
    const id = useId();
    const routeActive = useRouteActive();
    const isMobile = useMediaQuery(MOBILE_QUERY);
    const [reducedMotion] = useState(() => window.matchMedia(REDUCED_MOTION_QUERY).matches);
    const ids = useMemo(() => items.map((item) => item.id), [items]);
    const { index, paused, shown, go, pause, togglePaused } = useCarousel(ids, reducedMotion);
    const swipeStart = useRef<number | null>(null);
    const stopped = paused || isMobile || !routeActive;

    const onPointerDown = (event: React.PointerEvent) => {
        swipeStart.current = event.pointerType === 'touch' ? event.clientX : null;
    };
    const onPointerUp = (event: React.PointerEvent) => {
        if (swipeStart.current === null) {
            return;
        }

        const distance = event.clientX - swipeStart.current;
        swipeStart.current = null;
        if (distance <= -SWIPE_THRESHOLD) {
            go(index + 1, true);
        } else if (distance >= SWIPE_THRESHOLD) {
            go(index - 1, true);
        }
    };
    const onPointerCancel = () => {
        swipeStart.current = null;
    };

    const onToggleLibrary = (item: MetaItemPreviewCatalogsWithExtra) => {
        core.transport.dispatch({
            action: 'Ctx',
            args: item.inLibrary ?
                { action: 'RemoveFromLibrary', args: item.id }
                :
                { action: 'AddToLibrary', args: item }
        });
    };

    return (
        <section
            className={classNames(className, styles['spotlight'])}
            aria-roledescription={'carousel'}
            aria-label={t('BOARD_SPOTLIGHT')}
            onFocus={pause}
            onPointerDown={onPointerDown}
            onPointerUp={onPointerUp}
            onPointerCancel={onPointerCancel}
        >
            <div className={styles['art']} aria-hidden={'true'}>
                {
                    items.map((item, slide) => (
                        shown.has(item.id) ?
                            <div key={item.id} className={classNames(styles['backdrop'], { [styles['on']]: slide === index })}>
                                <Image className={styles['image']} src={item.background ?? undefined} alt={''} renderFallback={renderNothing} />
                            </div>
                            :
                            null
                    ))
                }
                <div className={styles['scrim']} />
            </div>
            {
                items.map((item, slide) => (
                    <Slide
                        key={item.id}
                        id={`${id}-${slide}`}
                        item={item}
                        active={slide === index}
                        onToggleLibrary={onToggleLibrary}
                    />
                ))
            }
            <Pager
                className={styles['pager']}
                id={id}
                labels={items.map(({ name }) => name)}
                index={index}
                stopped={stopped}
                onSelect={(slide) => go(slide, true)}
                onPrevious={() => go(index - 1, true)}
                onNext={() => go(index + 1, true)}
                onTogglePause={togglePaused}
                onCycle={() => go(index + 1, false)}
            />
            <div ref={sentinelRef} className={styles['sentinel']} aria-hidden={'true'} />
        </section>
    );
};

export default Spotlight;
