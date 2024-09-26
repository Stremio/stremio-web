import React, { createContext, useContext } from 'react';
import { WHITELISTED_HOSTS } from 'stremio/common/CONSTANTS';
import useShell from './useShell';
import Bowser from 'bowser';

interface PlatformContext {
    name: string;
    isMobile: () => boolean;
    openExternal: (url: string) => void;
}

const PlatformContext = createContext<PlatformContext | null>(null);

type Props = {
    children: JSX.Element;
};

const PlatformProvider = ({ children }: Props) => {
    const shell = useShell();

    // this detects ipad properly in safari
    // while bowser does not
    const iOS = () => {
        return (
            [
                'iPad Simulator',
                'iPhone Simulator',
                'iPod Simulator',
                'iPad',
                'iPhone',
                'iPod',
            ].includes(navigator.platform) ||
            (navigator.userAgent.includes('Mac') && 'ontouchend' in document)
        );
    };

    // Edge case: iPad is included in this function
    // Keep in mind maxTouchPoints for Vision Pro might change in the future
    const isVisionProUser = () => {
        const isMacintosh = navigator.userAgent.includes('Macintosh');
        const hasFiveTouchPoints = navigator.maxTouchPoints === 5;
        return isMacintosh && hasFiveTouchPoints;
    };

    const browser = Bowser.getParser(window.navigator?.userAgent || '');
    const osName = browser.getOSName().toLowerCase();

    const name = isVisionProUser()
        ? 'visionos'
        : iOS()
            ? 'ios'
            : osName || 'unknown';

    const isMobile = () => {
        return name === 'ios' || name === 'android';
    };

    const openExternal = (url: string) => {
        try {
            const { hostname } = new URL(url);
            const isWhitelisted = WHITELISTED_HOSTS.some((host: string) =>
                hostname.endsWith(host)
            );
            const finalUrl = !isWhitelisted
                ? 'https://www.stremio.com/warning#' + encodeURIComponent(url)
                : url;

            if (shell.active) {
                shell.send('open-external', finalUrl);
            } else {
                window.open(finalUrl, '_blank');
            }
        } catch (e) {
            console.error('Failed to parse external url:', e);
        }
    };

    return (
        <PlatformContext.Provider value={{ openExternal, name, isMobile }}>
            {children}
        </PlatformContext.Provider>
    );
};

const usePlatform = () => {
    return useContext(PlatformContext);
};

export { 
    PlatformProvider,
    usePlatform
};
