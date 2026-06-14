// Copyright (C) 2017-2026 Smart code 203358507

import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router';
import { usePlatform, CONSTANTS } from 'stremio/common';

const OpenMediaHandler = () => {
    const navigate = useNavigate();
    const { shell } = usePlatform();
    const appReadySent = useRef(false);

    useEffect(() => {
        const onOpenMedia = (data: string) => {
            try {
                const { protocol, hostname, pathname, searchParams } = new URL(data);
                if (protocol === CONSTANTS.PROTOCOL) {
                    if (hostname.length) {
                        const transportUrl = `https://${hostname}${pathname}`;
                        navigate(`/addons?addon=${encodeURIComponent(transportUrl)}`);
                    } else {
                        navigate(`${pathname}?${searchParams.toString()}`);
                    }
                }
            } catch (e) {
                console.error('Failed to open media:', e);
            }
        };

        shell.on('open-media', onOpenMedia);
        if (shell.state.initialized && !appReadySent.current) {
            appReadySent.current = true;
            shell.send('app-ready');
        }

        return () => shell.off('open-media', onOpenMedia);
    }, [navigate, shell, shell.state.initialized]);

    return null;
};

export default OpenMediaHandler;
