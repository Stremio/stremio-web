import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { useServices } from 'stremio/services';
import useProfile from '../useProfile';

type Activity = {
    state: string,
    details?: string | null,
    image?: string | null,
    startTimestamp?: number | null,
};

type DiscordContextValue = {
    available: boolean,
    connected: boolean,
    enabled: boolean,
    setActivity: (activity: Activity | null) => void,
};

const DiscordContext = createContext<DiscordContextValue | null>(null);

const sameActivity = (first: Activity | null, second: Activity | null) => {
    return first?.state === second?.state &&
        first?.details === second?.details &&
        first?.image === second?.image &&
        first?.startTimestamp === second?.startTimestamp;
};

type Props = {
    children: React.ReactNode,
};

const DiscordProvider = ({ children }: Props) => {
    const { discord } = useServices();
    const profile = useProfile();
    const enabled = profile.settings?.discordRpcEnabled === true;
    const [available, setAvailable] = useState(discord?.available === true);
    const [connected, setConnected] = useState(false);
    const [activity, setActivityState] = useState<Activity | null>(null);
    const sentActivity = useRef<Activity | null>(null);
    const connectRequested = useRef(false);

    useEffect(() => {
        if (!discord) return;

        const onStatusChanged = (isConnected: boolean) => {
            connectRequested.current = false;
            setConnected(isConnected);
        };
        const onAvailabilityChanged = (isAvailable: boolean) => {
            setAvailable(isAvailable);
        };

        discord.on('statusChanged', onStatusChanged);
        discord.on('availabilityChanged', onAvailabilityChanged);
        setAvailable(discord.available === true);

        return () => {
            discord.off('statusChanged', onStatusChanged);
            discord.off('availabilityChanged', onAvailabilityChanged);
        };
    }, [discord]);

    useEffect(() => {
        if (!discord || !available) {
            connectRequested.current = false;
            setConnected(false);
            sentActivity.current = null;
            return;
        }

        if (enabled) {
            if (!connected && !connectRequested.current) {
                connectRequested.current = true;
                discord.connect();
            }
        } else {
            connectRequested.current = false;
            if (connected) {
                discord.disconnect();
            }
            sentActivity.current = null;
        }
    }, [available, connected, discord, enabled]);

    useEffect(() => {
        if (!discord || !available || !enabled || !connected) return;

        if (activity === null) {
            if (sentActivity.current !== null) {
                discord.clearActivity();
                sentActivity.current = null;
            }
            return;
        }

        if (sameActivity(sentActivity.current, activity)) return;

        discord.setActivity(
            activity.state,
            activity.details || '',
            activity.image || null,
            activity.startTimestamp || null
        );
        sentActivity.current = activity;
    }, [activity, available, connected, discord, enabled]);

    const setActivity = useCallback((nextActivity: Activity | null) => {
        setActivityState((currentActivity) => sameActivity(currentActivity, nextActivity) ? currentActivity : nextActivity);
    }, []);

    const value = useMemo(() => ({
        available,
        connected,
        enabled,
        setActivity,
    }), [available, connected, enabled, setActivity]);

    return (
        <DiscordContext.Provider value={value}>
            {children}
        </DiscordContext.Provider>
    );
};

const useDiscord = () => {
    const value = useContext(DiscordContext);
    if (value === null) {
        throw new Error('useDiscord must be used inside DiscordProvider');
    }
    return value;
};

export {
    DiscordProvider,
    useDiscord,
};
