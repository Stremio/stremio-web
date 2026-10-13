// Copyright (C) 2017-2026 Smart code 203358507

import React, { useCallback, useEffect, useState } from 'react';
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

const ALPHA_THRESHOLD = 16;

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
        };
        image.src = src;
    });
    promise.catch(() => inks.delete(src));
    inks.set(src, promise);
    return promise;
};

const Logo = ({ className, logo, name, small = false }: Props) => {
    const [ink, setInk] = useState<{ src: string, ink: Ink } | null>(null);
    const [broken, setBroken] = useState<string | null>(null);

    useEffect(() => {
        if (typeof logo !== 'string' || logo.length === 0) {
            return;
        }

        let cancelled = false;
        measureInk(logo)
            .then((ink) => {
                if (!cancelled) {
                    setInk({ src: logo, ink });
                }
            })
            .catch(() => null);
        return () => {
            cancelled = true;
        };
    }, [logo]);

    const onError = useCallback(() => setBroken(logo), [logo]);

    if (typeof logo !== 'string' || logo.length === 0 || broken === logo) {
        return <div className={classNames(className, styles['name'], { [styles['small']]: small })}>{name}</div>;
    }

    const style = ink !== null && ink.src === logo ?
        {
            '--logo-ratio': ink.ink.ratio,
            '--logo-root': 1 / Math.sqrt(ink.ink.ratio),
            '--logo-scale': ink.ink.scale,
            '--logo-shift-x': ink.ink.shiftX,
            '--logo-center-y': ink.ink.centerY,
        } as React.CSSProperties
        :
        undefined;

    return (
        <div className={classNames(className, styles['logo'], { [styles['small']]: small })} style={style} title={name}>
            <Image className={styles['image']} src={logo} alt={name} onError={onError} />
        </div>
    );
};

export default Logo;
