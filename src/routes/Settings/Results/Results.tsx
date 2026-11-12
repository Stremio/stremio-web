// Copyright (C) 2017-2026 Smart code 203358507

import React from 'react';
import classNames from 'classnames';
import { useTranslation } from 'react-i18next';
import Icon from '@stremio/stremio-icons/react';
import { Button } from 'stremio/components';
import { Group } from '../components';
import type { SearchResult } from '../useSettingsSearch';
import styles from './Results.less';

type Props = {
    query: string,
    results: SearchResult[],
    compact: boolean,
    onSelect: (event: React.MouseEvent<HTMLDivElement>) => void,
};

const Results = ({ query, results, compact, onSelect }: Props) => {
    const { t } = useTranslation();
    const trimmed = query.trim();

    return (
        <div className={classNames(styles['results'], { [styles['compact']]: compact })}>
            {
                !compact &&
                    <div className={styles['head']}>
                        <h1 className={styles['title']}>{t('SETTINGS_SEARCH_RESULTS_TITLE')}</h1>
                    </div>
            }
            <p className={styles['count']} aria-live={'polite'}>
                {t('SETTINGS_SEARCH_RESULTS', { count: results.length, query: trimmed })}
            </p>
            <Group>
                {
                    results.length > 0 ?
                        results.map((result) => (
                            <Button
                                key={result.id}
                                className={styles['result']}
                                href={`#/settings/${result.page}`}
                                data-page={result.page}
                                data-target={result.row}
                                onClick={onSelect}
                            >
                                <div className={styles['text']}>
                                    <div className={styles['label']}>{result.label}</div>
                                    <div className={styles['crumb']}>{result.crumb}</div>
                                </div>
                                <Icon className={styles['chevron']} name={'chevron-forward'} />
                            </Button>
                        ))
                        :
                        <div className={styles['empty']}>
                            {t('SETTINGS_SEARCH_NO_RESULTS', { query: trimmed })}
                        </div>
                }
            </Group>
        </div>
    );
};

export default Results;
