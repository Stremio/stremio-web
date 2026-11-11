// Copyright (C) 2017-2026 Smart code 203358507

import { useCallback, useEffect, useRef } from 'react';
import useModelState from 'stremio/common/useModelState';
import { useRouteActive } from 'stremio/common/useRouteFocused';

type Arm = (button: HTMLElement, keyboard: boolean) => Session | null;

type Session = {
    commit: () => void,
    cancel: () => void,
};

type Look = {
    spotlight: boolean,
    notifications: string[],
};

type SpotlightSettings = {
    boardSpotlight?: { enabled: boolean },
};

const map = (ctx: Ctx): Look => ({
    spotlight: (ctx.profile.settings as Settings & SpotlightSettings).boardSpotlight?.enabled === true,
    notifications: ctx.remoteConfig.notifications.map(({ id }) => id),
});

const useBoardTransition = (prompted: boolean) => {
    const routeActive = useRouteActive();
    const { spotlight, notifications } = useModelState({ model: 'ctx', action: null, map }) as Look;
    const arm = useRef<Arm | null>(null);
    const pending = useRef<{ id: string, session: Session } | null>(null);
    const available = prompted && !spotlight;

    useEffect(() => {
        if (available && arm.current === null) {
            // @ts-expect-error: nodenext rejects the extensionless path that webpack resolves.
            import('./Transition')
                .then((transition: { default: Arm }) => {
                    arm.current = transition.default;
                })
                .catch(() => null);
        }
    }, [available]);

    useEffect(() => {
        if (pending.current === null) {
            return;
        }

        const { id, session } = pending.current;
        if (!routeActive) {
            pending.current = null;
            session.cancel();
        } else if (spotlight) {
            session.commit();
        } else if (!notifications.includes(id)) {
            pending.current = null;
            session.cancel();
        }
    }, [routeActive, spotlight, notifications]);

    useEffect(() => {
        return () => {
            pending.current?.session.cancel();
        };
    }, []);

    return useCallback((id: string, button: HTMLElement, keyboard: boolean) => {
        pending.current?.session.cancel();
        const session = available && arm.current !== null ? arm.current(button, keyboard) : null;
        pending.current = session !== null ? { id, session } : null;
    }, [available]);
};

export default useBoardTransition;
