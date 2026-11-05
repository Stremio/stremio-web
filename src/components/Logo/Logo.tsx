// Copyright (C) 2017-2026 Smart code 203358507

import React, { useCallback, useEffect, useRef, useState } from 'react';
import classNames from 'classnames';
import Image from 'stremio/components/Image';
import styles from './Logo.less';

type Props = {
    className?: string,
    logo: string | null,
    name: string,
    small?: boolean,
};

type Ink = {
    ratio: number,
    scale: number,
    shiftX: number,
    centerY: number,
};

type Metrics = {
    src: string,
    ratio: number,
    ink: Ink | null,
};

const ALPHA_THRESHOLD = 16;
const DEFAULT_RATIO = 2.58;
const REVEAL_TIMEOUT = 500;

const inks = new Map<string, Promise<Ink>>();

const measureInk = (src: string): Promise<Ink> => {
    const cached = inks.get(src);
    if (cached) {
        return cached;
    }

    const promise = new Promise<Ink>((resolve, reject) => {
        const image = new window.Image();
        image.crossOrigin = 'anonymous';
        image.onerror = () => reject(new Error(src));
        image.onload = () => {
            try {
                const { naturalWidth: width, naturalHeight: height } = image;
                const canvas = document.createElement('canvas');
                canvas.width = width;
                canvas.height = height;
                const context = canvas.getContext('2d', { willReadFrequently: true });
                if (!context) {
                    reject(new Error(src));
                    return;
                }

                context.drawImage(image, 0, 0);
                const { data } = context.getImageData(0, 0, width, height);
                let left = width;
                let right = -1;
                let top = height;
                let bottom = -1;
                for (let y = 0; y < height; y++) {
                    for (let x = 0; x < width; x++) {
                        if (data[(y * width + x) * 4 + 3] > ALPHA_THRESHOLD) {
                            left = Math.min(left, x);
                            right = Math.max(right, x);
                            top = Math.min(top, y);
                            bottom = Math.max(bottom, y);
                        }
                    }
                }

                if (right < left || bottom < top) {
                    reject(new Error(src));
                    return;
                }

                const inkWidth = right - left + 1;
                const inkHeight = bottom - top + 1;
                resolve({ ratio: inkWidth / inkHeight, scale: width / inkWidth, shiftX: left / width, centerY: (top + inkHeight / 2) / height });
            } catch (error) {
                reject(error);
            }
        };
        image.src = src;
    });
    promise.catch(() => inks.delete(src));
    inks.set(src, promise);
    return promise;
};

const Logo = ({ className, logo, name, small = false }: Props) => {
    const [metrics, setMetrics] = useState<Metrics | null>(null);
    const [loaded, setLoaded] = useState<string | null>(null);
    const [settled, setSettled] = useState<string | null>(null);
    const [expired, setExpired] = useState<string | null>(null);
    const [broken, setBroken] = useState<string | null>(null);
    const revealTimeout = useRef<number | null>(null);

    useEffect(() => {
        if (typeof logo !== 'string' || logo.length === 0) {
            return;
        }

        let cancelled = false;
        const keep = (current: string | null) => current === logo ? current : null;

        setMetrics((current) => current !== null && current.src === logo ? current : null);
        setLoaded(keep);
        setSettled(keep);
        setExpired(keep);
        measureInk(logo)
            .then((ink) => {
                if (!cancelled) {
                    setMetrics({ src: logo, ratio: ink.ratio, ink });
                }
            })
            .catch(() => null)
            .then(() => {
                if (!cancelled) {
                    setSettled(logo);
                }
            });
        return () => {
            cancelled = true;
            if (revealTimeout.current !== null) {
                window.clearTimeout(revealTimeout.current);
                revealTimeout.current = null;
            }
        };
    }, [logo]);

    const onLoad = useCallback((event: React.SyntheticEvent<HTMLImageElement>) => {
        const { naturalWidth, naturalHeight } = event.currentTarget;
        if (naturalWidth > 0 && naturalHeight > 0) {
            setMetrics((current) => current !== null && current.src === logo ? current : { src: logo as string, ratio: naturalWidth / naturalHeight, ink: null });
        }

        setLoaded(logo);
        if (revealTimeout.current === null) {
            revealTimeout.current = window.setTimeout(() => setExpired(logo), REVEAL_TIMEOUT);
        }
    }, [logo]);

    const onError = useCallback(() => setBroken(logo), [logo]);

    if (typeof logo !== 'string' || logo.length === 0 || broken === logo) {
        return <div className={classNames(className, styles['name'], { [styles['small']]: small })}>{name}</div>;
    }

    const revealed = (loaded === logo && settled === logo) || expired === logo;
    const resolved = metrics !== null && metrics.src === logo ? metrics : null;
    const ratio = resolved !== null ? resolved.ratio : DEFAULT_RATIO;
    const ink = resolved !== null ? resolved.ink : null;
    const style = {
        '--logo-ratio': ratio,
        '--logo-root': 1 / Math.sqrt(ratio),
        ...(ink !== null ?
            {
                '--logo-scale': ink.scale,
                '--logo-shift-x': ink.shiftX,
                '--logo-center-y': ink.centerY,
            }
            :
            null
        ),
    } as React.CSSProperties;

    return (
        <div className={classNames(className, styles['logo'], { [styles['inked']]: ink !== null, [styles['revealed']]: revealed, [styles['small']]: small })} style={style} title={name}>
            <Image className={styles['image']} src={logo} alt={name} onLoad={onLoad} onError={onError} />
        </div>
    );
};

export default Logo;
