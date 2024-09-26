import React, { createContext, useContext } from 'react';
import useShell from './useShell';
import { WHITELISTED_HOSTS } from 'stremio/common/CONSTANTS';

interface PlatformContext {
    openExternal: (url: string) => void,
};

const PlatformContext = createContext<PlatformContext | null>(null);

type Props = {
    children: JSX.Element,
};

const PlatformProvider = ({ children }: Props) => {
    const shell = useShell();

    const openExternal = (url: string) => {
        let finalUrl = url;
        try {
            const parsedUrl = new URL(url);
            const hostname = parsedUrl.hostname;
            const isWhitelisted = WHITELISTED_HOSTS.some((host: string) => hostname === host || hostname.endsWith('.' + host));
            if (!isWhitelisted) {
                finalUrl = 'https://www.stremio.com/warning#' + encodeURIComponent(url);
            }
        } catch (e) {
            finalUrl = 'https://www.stremio.com/warning#' + encodeURIComponent(url);
        }

        if (shell.active) {
            shell.send('open-external', finalUrl);
        } else {
            window.open(finalUrl, '_blank');
        }
    };

    return (
        <PlatformContext.Provider value={{ openExternal }}>
            {children}
        </PlatformContext.Provider>
    );
};

const usePlatform = () => {
    return useContext(PlatformContext);
};

export {
    PlatformProvider,
    usePlatform,
};
