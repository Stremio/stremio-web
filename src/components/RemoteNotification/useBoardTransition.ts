// Copyright (C) 2017-2026 Smart code 203358507

import { useCallback, useEffect, useRef, useState } from 'react';
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
    proceed: () => void,
}) => Session | null;

type Prime = (button: HTMLElement | null) => void;

type Transition = {
    arm: Arm,
    prime: Prime,
};

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
    const [transition, setTransition] = useState<Transition | null>(null);
    const [target, setTarget] = useState<HTMLElement | null>(null);
    const pending = useRef<{ id: string, session: Session } | null>(null);
    const available = offered && spotlight === false;

    useEffect(() => {
        if (available && transition === null) {
            // @ts-expect-error: nodenext rejects the extensionless path that webpack resolves.
            import('./Transition')
                .then(({ arm, prime }: Transition) => setTransition({ arm, prime }))
                .catch(() => null);
        }
    }, [available, transition]);

    useEffect(() => {
        if (!available || transition === null || target === null) {
            return;
        }

        transition.prime(target);
        return () => {
            transition.prime(null);
        };
    }, [available, transition, target]);

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

    const arm = useCallback((id: string, button: HTMLElement, keyboard: boolean, proceed: () => void) => {
        pending.current?.session.cancel();
        pending.current = null;
        if (!available || transition === null) {
            return false;
        }

        const session = transition.arm(button, {
            keyboard,
            gamepad,
            proceed,
            onEnd: (outcome) => {
                if (pending.current?.session === session) {
                    pending.current = null;
                }

                onEnd(outcome);
            },
        });
        pending.current = session !== null ? { id, session } : null;
        return session !== null;
    }, [available, transition, gamepad, onEnd]);

    return [arm, setTarget] as const;
};

export type { Outcome, Arm, Prime, Session };

export default useBoardTransition;
