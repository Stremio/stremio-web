import React, { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';
import { SUBTITLES_RATE_PRESETS, findSubtitlesRatePreset } from '../../subtitleRate';
import styles from './RateSelect.less';

type Props = {
    className: string,
    label: string,
    value: number | null,
    disabled?: boolean,
    onChange: (value: number) => void,
};

const RateSelect = ({ className, label, value, disabled, onChange }: Props) => {
    const { t } = useTranslation();

    const preset = useMemo(() => findSubtitlesRatePreset(value), [value]);
    const isCustom = typeof value === 'number' && preset === null;
    const isDisabled = disabled || typeof value !== 'number';

    const onSelectChange = useCallback((event: React.ChangeEvent<HTMLSelectElement>) => {
        onChange(parseFloat(event.target.value));
    }, [onChange]);

    return (
        <div className={classNames(styles['rate-select'], className, { 'disabled': isDisabled })}>
            <div className={styles['header']}>
                { t(label, { defaultValue: 'FPS' }) }
            </div>
            <select
                className={styles['select']}
                value={isCustom ? 'custom' : String(preset ? preset.rate : 1)}
                disabled={isDisabled}
                onChange={onSelectChange}
            >
                { SUBTITLES_RATE_PRESETS.map(({ id, label, rate }) => (
                    <option key={id} value={String(rate)}>{ label }</option>
                )) }
                { isCustom && <option value={'custom'} disabled>{ `x${(value as number).toFixed(4)}` }</option> }
            </select>
        </div>
    );
};

export default RateSelect;
