// Copyright (C) 2017-2026 Smart code 203358507

import { useCallback, useEffect, useState } from 'react';
import { useCore } from 'stremio/core';
import { usePlatform } from 'stremio/common';
import isTraktAuthenticated from './isTraktAuthenticated';

const useTraktAuth = (profile: Profile) => {
    const core = useCore();
    const platform = usePlatform();
    const [authStarted, setAuthStarted] = useState(false);
    const authenticated = isTraktAuthenticated(profile);

    const toggle = useCallback(() => {
        if (profile.auth === null) return;

        if (!authenticated && profile.auth.user !== null && typeof profile.auth.user._id === 'string') {
            platform.openExternal(`https://www.strem.io/trakt/auth/${profile.auth.user._id}`);
            setAuthStarted(true);
        } else {
            core.transport.dispatch({
                action: 'Ctx',
                args: {
                    action: 'LogoutTrakt'
                }
            });
        }
    }, [authenticated, profile.auth]);

    useEffect(() => {
        if (authenticated && authStarted) {
            core.transport.dispatch({
                action: 'Ctx',
                args: {
                    action: 'InstallTraktAddon'
                }
            });
            setAuthStarted(false);
        }
    }, [authenticated, authStarted]);

    return { authenticated, toggle };
};

export default useTraktAuth;
