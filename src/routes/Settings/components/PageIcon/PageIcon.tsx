// Copyright (C) 2017-2026 Smart code 203358507

import React from 'react';
import Icon from '@stremio/stremio-icons/react';

const STROKE: React.CSSProperties = { stroke: 'currentcolor', strokeLinecap: 'round', strokeLinejoin: 'round', strokeWidth: 32, fill: 'none' };
const FILL: React.CSSProperties = { fill: 'currentcolor' };

const KEYBOARD_KEYS = [152, 222, 292, 362]
    .flatMap((x) => [212, 270].map((y) => `M${x + 22} ${y}a22 22 0 1 1-44 0a22 22 0 1 1 44 0Z`))
    .join('');

const LOCAL_ICONS: Record<string, { d: string, style: React.CSSProperties }[]> = {
    account: [
        { d: 'M456 256a200 200 0 1 1-400 0a200 200 0 1 1 400 0Z', style: STROKE },
        { d: 'M324 212a68 68 0 1 1-136 0a68 68 0 1 1 136 0Z', style: STROKE },
        { d: 'M134 398c24-42 70-66 122-66s98 24 122 66', style: STROKE },
    ],
    keyboard: [
        { d: 'M96 128h320a48 48 0 0 1 48 48v160a48 48 0 0 1-48 48H96a48 48 0 0 1-48-48V176a48 48 0 0 1 48-48Z', style: STROKE },
        { d: KEYBOARD_KEYS, style: FILL },
        { d: 'M176 330h160', style: STROKE },
    ],
};

type Props = {
    className?: string,
    name: string,
};

const PageIcon = ({ className, name }: Props) => {
    const paths = LOCAL_ICONS[name];

    if (!paths) {
        return (
            <Icon className={className} name={name} />
        );
    }

    return (
        <svg className={className} viewBox={'0 0 512 512'}>
            {
                paths.map(({ d, style }) => (
                    <path key={d} d={d} style={style} />
                ))
            }
        </svg>
    );
};

export default PageIcon;
