// Copyright (C) 2017-2026 Smart code 203358507

import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import SegmentedControl from 'stremio/components/SegmentedControl';
import useMediaQuery from 'stremio/common/useMediaQuery';
import SeasonsBar from './SeasonsBar';

type Props = {
    className?: string,
    options: { value: string, label: string }[],
    value: number | null,
    size?: 'medium' | 'large',
    onSelect: (season: number) => void,
};

const SeasonPicker = ({ className, options, value, size, onSelect }: Props) => {
    const { t } = useTranslation();
    const isTouch = useMediaQuery('(hover: none) and (pointer: coarse)');
    const selected = value !== null ? String(value) : null;

    const handleSelect = useCallback((value: string) => {
        onSelect(Number(value));
    }, [onSelect]);

    return isTouch ?
        <SegmentedControl
            className={className}
            options={options}
            value={selected}
            ariaLabel={t('SEASON')}
            size={size}
            onSelect={handleSelect}
        />
        :
        <SeasonsBar
            className={className}
            options={options}
            value={selected}
            onSelect={handleSelect}
        />;
};

export default SeasonPicker;
