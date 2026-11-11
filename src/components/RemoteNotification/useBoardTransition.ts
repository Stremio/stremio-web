// Copyright (C) 2017-2026 Smart code 203358507

import { useCallback, useEffect, useRef } from 'react';
import useModelState from 'stremio/common/useModelState';
import { useRouteActive } from 'stremio/common/useRouteFocused';
import { useGamepad } from 'stremio/services/GamepadContext';

type Outcome = 'revealed' | 'dropped';

type Session = {
    commit: () => void,
    cancel: () => void,
};

type Arm = (button: HTMLElement, options: {
    keyboard: boolean,
    gamepad: ReturnType<typeof useGamepad>,
    onEnd: (outcome: Outcome) => void,
}) => Session | null;

type Look = {
    spotlight: boolean | null,
    notifications: string[],
};

type SpotlightSettings = {
    boardSpotlight?: { enabled?: unknown },
};

const map = (ctx: Ctx): Look => {
    const enabled = (ctx.profile.settings as Settings & SpotlightSettings).boardSpotlight?.enabled;
    return {
        spotlight: typeof enabled === 'boolean' ? enabled : null,
        notifications: ctx.remoteConfig.notifications.map(({ id }) => id),
    };
};

const useBoardTransition = (offered: boolean, onEnd: (outcome: Outcome) => void) => {
    const routeActive = useRouteActive();
    const gamepad = useGamepad();
    const { spotlight, notifications } = useModelState({ model: 'ctx', action: null, map }) as Look;
    const arm = useRef<Arm | null>(null);
    const pending = useRef<{ id: string, session: Session } | null>(null);
    const available = offered && spotlight === false;

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
            session.cancel();
        } else if (spotlight === true) {
            session.commit();
        } else if (!notifications.includes(id)) {
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
        const session = available && arm.current !== null ?
            arm.current(button, {
                keyboard,
                gamepad,
                onEnd: (outcome) => {
                    if (pending.current?.session === session) {
                        pending.current = null;
                    }

                    onEnd(outcome);
                },
            })
            :
            null;
        pending.current = session !== null ? { id, session } : null;
        return session !== null;
    }, [available, gamepad, onEnd]);
};

export type { Outcome, Arm, Session };

export default useBoardTransition;
