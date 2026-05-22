// Copyright (C) 2017-2026 Smart code 203358507

import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { usePlatform, CONSTANTS } from 'stremio/common';

const OpenMediaHandler = () => {
    const navigate = useNavigate();
    const { shell } = usePlatform();

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
        return () => shell.off('open-media', onOpenMedia);
    }, [navigate, shell]);

    return null;
};

export default OpenMediaHandler;
