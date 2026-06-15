// Copyright (C) 2017-2024 Smart code 203358507

import React, { useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router';
import toPath from 'stremio/common/toPath';
import Icon from '@stremio/stremio-icons/react';
import { Button } from 'stremio/components';
import useCalendarDate from '../useCalendarDate';
import styles from './Selector.less';

type Props = {
    selected: CalendarSelected,
    selectable: CalendarSelectable,
    profile: Profile,
};

const Selector = ({ selected, selectable, profile }: Props) => {
    const { toMonth } = useCalendarDate(profile);
    const navigate = useNavigate();

    const [prev, next] = useMemo(() => (
        [selectable.prev, selectable.next]
    ), [selectable]);

    const onPrev = useCallback(() => {
        navigate(toPath(prev.deepLinks.calendar));
    }, [prev]);

    const onNext = useCallback(() => {
        navigate(toPath(next.deepLinks.calendar));
    }, [next]);

    return (
        <div className={styles['selector']}>
            <Button className={styles['prev']} onClick={onPrev}>
                <Icon
                    className={styles['icon']}
                    name={'chevron-back'}
                />
                <div className={styles['label']}>
                    {toMonth(prev, 'short')}
                </div>
            </Button>
            <div className={styles['selected']}>
                <div className={styles['year']}>
                    {selected?.year}
                </div>
                <div className={styles['month']}>
                    {toMonth(selected, 'long')}
                </div>
            </div>
            <Button className={styles['next']} onClick={onNext}>
                <div className={styles['label']}>
                    {toMonth(next, 'short')}
                </div>
                <Icon
                    className={styles['icon']}
                    name={'chevron-forward'}
                />
            </Button>
        </div>
    );
};

export default Selector;
