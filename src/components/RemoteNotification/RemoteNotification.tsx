// Copyright (C) 2017-2026 Smart code 203358507

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router';
import useEvents from 'stremio/components/EventModal/useEvents';
import useRemoteConfig from 'stremio/common/RemoteConfig/useRemoteConfig';
import { useRouteActive } from 'stremio/common/useRouteFocused';
import { usePlatform } from 'stremio/common/Platform';
import useBoardTransition from './useBoardTransition';
import type { Outcome } from './useBoardTransition';
import useMedia from './useMedia';
import type { Catalogs, Media } from './useMedia';
import Prompt from './Prompt';

type Props = {
    catalogs: Catalogs,
};

type Shown = {
    key: string,
    notification: RemoteNotification,
    media: Media,
};

type Phase = 'open' | 'held' | 'closing';

const PROMPT_TEMPLATE = 'prompt';
const SPOTLIGHT_TEMPLATE = 'spotlight-intro';
const DEEP_LINK_PREFIX = 'stremio:///';
const SETTLE = 600;

const RemoteNotification = ({ catalogs }: Props) => {
    const platform = usePlatform();
    const navigate = useNavigate();
    const routeActive = useRouteActive();
    const { events } = useEvents();
    const { remoteConfig, pull, notificationShown, notificationAction, dismissNotification } = useRemoteConfig();
    const [shown, setShown] = useState<Shown | null>(null);
    const [phase, setPhase] = useState<Phase>('open');
    const reportedRef = useRef<string | null>(null);

    const legacyModalPending = events.modal.type === 'Loading' || (events.modal.type === 'Ready' && events.modal.content !== null);

    const notification = useMemo(() => {
        if (!routeActive || legacyModalPending) {
            return null;
        }

        return remoteConfig.notifications.find(({ template }) => template === PROMPT_TEMPLATE || template === SPOTLIGHT_TEMPLATE) ?? null;
    }, [routeActive, legacyModalPending, remoteConfig.notifications]);

    const key = notification !== null ? `${notification.id}:${notification.rev}` : null;
    const media = useMedia(notification, catalogs, notification?.template === SPOTLIGHT_TEMPLATE);
    const next = useRef<Shown | null>(null);
    next.current = key !== null && notification !== null && media !== null ? { key, notification, media } : null;
    const ready = next.current !== null;
    const shownKey = shown?.key ?? null;

    const onTransitionEnd = useCallback((outcome: Outcome) => {
        if (outcome === 'revealed') {
            setShown(null);
            setPhase('open');
        } else {
            setPhase((phase) => phase === 'held' ? 'open' : phase);
        }
    }, []);

    const armTransition = useBoardTransition(shown !== null, onTransitionEnd);

    useEffect(() => {
        if (routeActive) {
            pull();
        }
    }, [routeActive, pull]);

    useEffect(() => {
        if (!ready || shownKey !== null) {
            return;
        }

        const timeout = window.setTimeout(() => {
            setShown(next.current);
            setPhase('open');
        }, SETTLE);
        return () => {
            window.clearTimeout(timeout);
        };
    }, [ready, shownKey]);

    useEffect(() => {
        if (shown !== null && reportedRef.current !== shown.key) {
            reportedRef.current = shown.key;
            notificationShown(shown.notification.id);
        }
    }, [shown, notificationShown]);

    useEffect(() => {
        if (shownKey !== null && shownKey !== key && phase === 'open') {
            setPhase('closing');
        }
    }, [shownKey, key, phase]);

    const onCloseRequest = useCallback(() => {
        if (shown !== null && phase === 'open') {
            dismissNotification(shown.notification.id);
        }
    }, [shown, phase, dismissNotification]);

    const onAction = useCallback((button: RemoteNotificationButton, event: React.MouseEvent<HTMLElement>) => {
        if (shown === null || phase !== 'open') {
            return;
        }
        if (armTransition(shown.notification.id, event.currentTarget, event.detail === 0)) {
            setPhase('held');
        }
        if (button.openUrl !== null) {
            platform.openExternal(button.openUrl);
        }
        if (button.navigate !== null && button.navigate.startsWith(DEEP_LINK_PREFIX)) {
            navigate(`/${button.navigate.slice(DEEP_LINK_PREFIX.length)}`);
        }

        notificationAction(shown.notification.id, button.id);
    }, [shown, phase, platform, navigate, notificationAction, armTransition]);

    const onExited = useCallback(() => {
        setShown(null);
        setPhase('open');
    }, []);

    if (shown === null) {
        return null;
    }

    return (
        <Prompt
            notification={shown.notification}
            media={shown.media}
            closing={phase === 'closing'}
            held={phase === 'held'}
            onAction={onAction}
            onCloseRequest={onCloseRequest}
            onExited={onExited}
        />
    );
};

export default RemoteNotification;
