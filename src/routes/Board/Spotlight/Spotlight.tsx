// Copyright (C) 2017-2026 Smart code 203358507

import React, { useCallback, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';
import { useCore } from 'stremio/core';
import Image from 'stremio/components/Image';
import { useRouteActive } from 'stremio/common/useRouteFocused';
import useCarousel from './useCarousel';
import Slide from './Slide';
import Pager from './Pager';
import Placeholder from './Placeholder';
import styles from './Spotlight.less';

type Props = {
    className?: string,
    items: MetaItemPreviewCatalogsWithExtra[],
};

const SWIPE_THRESHOLD = 40;

const renderNothing = () => null;

const Spotlight = ({ className, items }: Props) => {
    const { t } = useTranslation();
    const core = useCore();
    const routeActive = useRouteActive();
    const { index, paused, shown, go, togglePaused } = useCarousel(items.length);
    const swipeStart = useRef<number | null>(null);
    const stopped = paused || !routeActive;

    const onPointerDown = useCallback((event: React.PointerEvent) => {
        swipeStart.current = event.pointerType === 'touch' ? event.clientX : null;
    }, []);
    const onPointerUp = useCallback((event: React.PointerEvent) => {
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
    }, [index, go]);
    const onPointerCancel = useCallback(() => {
        swipeStart.current = null;
    }, []);

    const onSelect = useCallback((slide: number) => go(slide, true), [go]);
    const onPrevious = useCallback(() => go(index - 1, true), [index, go]);
    const onNext = useCallback(() => go(index + 1, true), [index, go]);
    const onCycle = useCallback(() => go(index + 1, false), [index, go]);

    const onToggleLibrary = useCallback((item: MetaItemPreviewCatalogsWithExtra) => {
        core.transport.dispatch({
            action: 'Ctx',
            args: item.inLibrary ?
                { action: 'RemoveFromLibrary', args: item.id }
                :
                { action: 'AddToLibrary', args: item }
        });
    }, [core]);

    return (
        <section
            className={classNames(className, styles['spotlight'])}
            aria-roledescription={'carousel'}
            aria-label={t('BOARD_SPOTLIGHT')}
            onPointerDown={onPointerDown}
            onPointerUp={onPointerUp}
            onPointerCancel={onPointerCancel}
        >
            <div className={styles['art']} aria-hidden={'true'}>
                {
                    items.map((item, slide) => (
                        shown.has(slide) ?
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
                        item={item}
                        active={slide === index}
                        onToggleLibrary={onToggleLibrary}
                    />
                ))
            }
            <Pager
                className={styles['pager']}
                labels={items.map(({ name }) => name)}
                index={index}
                stopped={stopped}
                onSelect={onSelect}
                onPrevious={onPrevious}
                onNext={onNext}
                onTogglePause={togglePaused}
                onCycle={onCycle}
            />
        </section>
    );
};

Spotlight.Placeholder = Placeholder;

export default Spotlight;
