import { useEffect, useMemo } from 'react';
import { useCore } from 'stremio/core';
import { interfaceLanguages, useHeroCardSettings, useLanguageSorting, useModelState } from 'stremio/common';
import { INTERFACE_SCALES } from 'stremio/common/CONSTANTS';
import { normalizeInterfaceScale } from 'stremio/common/interfaceScale';

const useInterfaceOptions = (profile: Profile) => {
    const core = useCore();
    const [heroCardSettings, updateHeroCardSettings] = useHeroCardSettings();
    const installedAddonsAction = useMemo(() => ({
        action: 'Load',
        args: {
            model: 'InstalledAddonsWithFilters',
            args: {
                request: {
                    type: null
                }
            }
        }
    }), []);
    const installedAddons = useModelState({
        model: 'installed_addons',
        action: installedAddonsAction
    });

    const interfaceLanguageOptions = useMemo(() =>
        interfaceLanguages.map(({ name, codes }) => ({
            value: codes[0],
            label: name,
        })),
    []);

    const { sortedOptions } = useLanguageSorting(interfaceLanguageOptions);

    const interfaceLanguageSelect = useMemo(() => ({
        options: sortedOptions,
        value:
            interfaceLanguages.find(({ codes }) => codes[1] === profile.settings.interfaceLanguage)?.codes?.[0] ||
            profile.settings.interfaceLanguage,
        onSelect: (value: string) => {
            core.transport.dispatch({
                action: 'Ctx',
                args: {
                    action: 'UpdateSettings',
                    args: {
                        ...profile.settings,
                        interfaceLanguage: value
                    }
                }
            });
        }
    }), [profile.settings, sortedOptions]);

    const interfaceSize = useMemo(() => ({
        min: INTERFACE_SCALES[0],
        max: INTERFACE_SCALES[INTERFACE_SCALES.length - 1],
        step: 25,
        value: normalizeInterfaceScale(profile.settings.interfaceScale),
        options: INTERFACE_SCALES,
        onChange: (value: number) => {
            core.transport.dispatch({
                action: 'Ctx',
                args: {
                    action: 'UpdateSettings',
                    args: {
                        ...profile.settings,
                        interfaceScale: normalizeInterfaceScale(value)
                    }
                }
            });
        }
    }), [profile.settings, core.transport]);

    const escExitFullscreenToggle = useMemo(() => ({
        checked: profile.settings.escExitFullscreen,
        onClick: () => {
            core.transport.dispatch({
                action: 'Ctx',
                args: {
                    action: 'UpdateSettings',
                    args: {
                        ...profile.settings,
                        escExitFullscreen: !profile.settings.escExitFullscreen
                    }
                }
            });
        }
    }), [profile.settings]);

    const quitOnCloseToggle = useMemo(() => ({
        checked: profile.settings.quitOnClose,
        onClick: () => {
            core.transport.dispatch({
                action: 'Ctx',
                args: {
                    action: 'UpdateSettings',
                    args: {
                        ...profile.settings,
                        quitOnClose: !profile.settings.quitOnClose
                    }
                }
            });
        }
    }), [profile.settings]);

    const hideSpoilersToggle = useMemo(() => ({
        checked: profile.settings.hideSpoilers,
        onClick: () => {
            core.transport.dispatch({
                action: 'Ctx',
                args: {
                    action: 'UpdateSettings',
                    args: {
                        ...profile.settings,
                        hideSpoilers: !profile.settings.hideSpoilers
                    }
                }
            });
        }
    }), [profile.settings]);

    const gamepadSupportToggle = useMemo(() => ({
        checked: profile.settings.gamepadSupport,
        onClick: () => {
            core.transport.dispatch({
                action: 'Ctx',
                args: {
                    action: 'UpdateSettings',
                    args: {
                        ...profile.settings,
                        gamepadSupport: !profile.settings.gamepadSupport
                    }
                }
            });
        }
    }), [profile.settings]);

    const heroCardCatalogSelect = useMemo(() => {
        const options = [
            {
                label: 'Continue Watching',
                value: 'continue_watching'
            }
        ];

        if (Array.isArray(installedAddons?.catalog)) {
            installedAddons.catalog
                .filter((addon: Addon) => addon.installed)
                .forEach((addon: Addon) => {
                    const catalogs = Array.isArray(addon.manifest?.catalogs) ? addon.manifest.catalogs : [];
                    const addonKey = typeof addon.manifest?.id === 'string' && addon.manifest.id.length > 0 ?
                        addon.manifest.id
                        :
                        addon.transportUrl;
                    catalogs.forEach((catalog: AddonManifestCatalog) => {
                        options.push({
                            label: `${addon.manifest.name}: ${catalog.name || catalog.id}`,
                            value: `${addonKey}|${catalog.type}|${catalog.id}`
                        });
                    });
                });
        }

        const optionsWithoutDuplicates = options.filter((option, index, allOptions) => {
            return allOptions.findIndex(({ value }) => value === option.value) === index;
        });

        // Keep a previously stored selection visible even if that addon is no longer installed.
        if (heroCardSettings.catalog !== '' && !optionsWithoutDuplicates.some(({ value }) => value === heroCardSettings.catalog)) {
            optionsWithoutDuplicates.push({
                label: 'Saved catalog',
                value: heroCardSettings.catalog
            });
        }

        return {
            options: optionsWithoutDuplicates,
            value: heroCardSettings.catalog,
            onSelect: (value: string) => {
                updateHeroCardSettings({ catalog: value });
            }
        };
    }, [installedAddons, heroCardSettings.catalog, updateHeroCardSettings]);

    // Migrate selections stored before catalogs were keyed by addon manifest id.
    useEffect(() => {
        const catalog = heroCardSettings.catalog;

        if (catalog.indexOf('://') < 0 || !Array.isArray(installedAddons?.catalog)) {
            return;
        }

        const addon = installedAddons.catalog.find((installedAddon: Addon) => {
            return installedAddon.installed &&
                typeof installedAddon.transportUrl === 'string' &&
                catalog.startsWith(`${installedAddon.transportUrl}|`);
        });

        if (!addon) {
            return;
        }

        const addonKey = typeof addon.manifest?.id === 'string' && addon.manifest.id.length > 0 ?
            addon.manifest.id
            : addon.transportUrl;

        updateHeroCardSettings({
            catalog: `${addonKey}|${catalog.slice(addon.transportUrl.length + 1)}`
        });
    }, [installedAddons, heroCardSettings.catalog, updateHeroCardSettings]);

    const heroCardToggle = {
        checked: heroCardSettings.enabled,
        onClick: () => {
            updateHeroCardSettings({ enabled: !heroCardSettings.enabled });
        }
    };

    return {
        interfaceLanguageSelect,
        interfaceSize,
        escExitFullscreenToggle,
        quitOnCloseToggle,
        hideSpoilersToggle,
        gamepadSupportToggle,
        heroCardToggle,
        heroCardCatalogSelect,
    };
};

export default useInterfaceOptions;
