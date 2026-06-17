import { useMemo } from 'react';
import { useCore } from 'stremio/core';
import { interfaceLanguages, useLanguageSorting } from 'stremio/common';

const useInterfaceOptions = (profile: Profile) => {
    const core = useCore();

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

    return {
        interfaceLanguageSelect,
        escExitFullscreenToggle,
        quitOnCloseToggle,
        hideSpoilersToggle,
        gamepadSupportToggle,
    };
};

export default useInterfaceOptions;
