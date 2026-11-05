// Copyright (C) 2017-2026 Smart code 203358507

import { useCallback, useEffect, useState } from 'react';

export type HeroCardSettings = {
    enabled: boolean,
    catalog: string,
};

const STORAGE_KEY = 'heroCardSettings';
const UPDATE_EVENT = 'heroCardSettingsUpdated';

const DEFAULT_SETTINGS: HeroCardSettings = {
    enabled: false,
    catalog: 'continue_watching',
};

const readSettings = (): HeroCardSettings => {
    try {
        const stored = JSON.parse(window.localStorage.getItem(STORAGE_KEY) || 'null');
        if (stored !== null && typeof stored === 'object') {
            return {
                ...DEFAULT_SETTINGS,
                enabled: typeof stored.enabled === 'boolean' ? stored.enabled : DEFAULT_SETTINGS.enabled,
                catalog: typeof stored.catalog === 'string' ? stored.catalog : DEFAULT_SETTINGS.catalog,
            };
        }
    } catch {
        // Ignore invalid stored settings
    }

    return DEFAULT_SETTINGS;
};

const useHeroCardSettings = (): [HeroCardSettings, (settings: Partial<HeroCardSettings>) => void] => {
    const [settings, setSettings] = useState<HeroCardSettings>(readSettings);

    useEffect(() => {
        const onSettingsUpdate = () => {
            setSettings(readSettings());
        };

        window.addEventListener(UPDATE_EVENT, onSettingsUpdate);
        window.addEventListener('storage', onSettingsUpdate);

        return () => {
            window.removeEventListener(UPDATE_EVENT, onSettingsUpdate);
            window.removeEventListener('storage', onSettingsUpdate);
        };
    }, []);

    const updateSettings = useCallback((nextSettings: Partial<HeroCardSettings>) => {
        setSettings((currentSettings) => {
            const updatedSettings = {
                ...currentSettings,
                ...nextSettings,
            };

            try {
                window.localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedSettings));
                window.dispatchEvent(new Event(UPDATE_EVENT));
            } catch {
                // Ignore storage errors
            }

            return updatedSettings;
        });
    }, []);

    return [settings, updateSettings];
};

export default useHeroCardSettings;
