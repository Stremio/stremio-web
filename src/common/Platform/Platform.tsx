import React, { createContext, useContext } from 'react';
import useShell from './useShell';

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
        if (shell.active) {
            shell.send('open-external', url);
        } else {
            window.open(url, '_blank');
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