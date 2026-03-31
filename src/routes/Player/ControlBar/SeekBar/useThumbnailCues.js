// Copyright (C) 2017-2023 Smart code 203358507

const React = require('react');
const { parseThumbnailVtt } = require('./parseThumbnailVtt');

/**
 * @param {string | null | undefined} vttUrl
 */
function useThumbnailCues(vttUrl) {
    const [cues, setCues] = React.useState(() => []);
    const [error, setError] = React.useState(() => /** @type {Error | null} */ (null));

    React.useEffect(() => {
        if (typeof vttUrl !== 'string' || vttUrl.length === 0) {
            setCues([]);
            setError(null);
            return;
        }

        let cancelled = false;
        setError(null);

        fetch(vttUrl, { credentials: 'omit' })
            .then((res) => {
                if (!res.ok) {
                    throw new Error(`Thumbnails VTT: ${res.status}`);
                }
                return res.text();
            })
            .then((text) => {
                if (cancelled) {
                    return;
                }
                setCues(parseThumbnailVtt(text));
            })
            .catch((e) => {
                if (cancelled) {
                    return;
                }
                setCues([]);
                setError(e instanceof Error ? e : new Error(String(e)));
            });

        return () => {
            cancelled = true;
        };
    }, [vttUrl]);

    return { cues, error };
}

module.exports = useThumbnailCues;
