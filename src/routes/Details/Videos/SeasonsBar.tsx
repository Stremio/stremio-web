// Copyright (C) 2017-2026 Smart code 203358507

import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';
import Icon from '@stremio/stremio-icons/react';
import Button from 'stremio/components/Button';
import MultiselectMenu from 'stremio/components/MultiselectMenu';
import styles from './SeasonsBar.less';

type Props = {
    className?: string,
    options: { value: string, label: string }[],
    value: string | null,
    onSelect: (value: string) => void,
};

const SeasonsBar = ({ className, options, value, onSelect }: Props) => {
    const { t } = useTranslation();
    const index = options.findIndex((option) => option.value === value);
    const prevDisabled = index <= 0;
    const nextDisabled = index >= options.length - 1;

    const onPrev = useCallback(() => {
        onSelect(options[index - 1].value);
    }, [options, index, onSelect]);

    const onNext = useCallback(() => {
        onSelect(options[index + 1].value);
    }, [options, index, onSelect]);

    return (
        <div className={classNames(styles['seasons-bar'], className)}>
            <Button
                className={styles['step']}
                role={'button'}
                activateOnSpace
                title={t('PREV_SEASON')}
                aria-label={t('PREV_SEASON')}
                disabled={prevDisabled}
                tabIndex={prevDisabled ? -1 : 0}
                aria-disabled={prevDisabled}
                onClick={prevDisabled ? undefined : onPrev}
            >
                <Icon className={styles['icon']} name={'chevron-back'} />
            </Button>
            <MultiselectMenu className={styles['seasons']} options={options} value={value} portal={true} onSelect={onSelect} />
            <Button
                className={styles['step']}
                role={'button'}
                activateOnSpace
                title={t('NEXT_SEASON')}
                aria-label={t('NEXT_SEASON')}
                disabled={nextDisabled}
                tabIndex={nextDisabled ? -1 : 0}
                aria-disabled={nextDisabled}
                onClick={nextDisabled ? undefined : onNext}
            >
                <Icon className={styles['icon']} name={'chevron-forward'} />
            </Button>
        </div>
    );
};

export default SeasonsBar;
