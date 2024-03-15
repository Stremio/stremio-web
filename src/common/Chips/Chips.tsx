// Copyright (C) 2017-2024 Smart code 203358507

import React, { memo, useEffect, useRef, useState } from 'react';
import classNames from 'classnames';
import Chip from './Chip';
import styles from './Chips.less';

type Option = {
    label: string,
    value: string,
};

type Props = {
    options: Option[],
    selected: string[],
    onSelect: (value: string) => {},
};

const SCROLL_THRESHOLD = 1;

const Chips = memo(({ options, selected, onSelect }: Props) => {
    const ref = useRef<HTMLDivElement>(null);
    const [scrollPosition, setScrollPosition] = useState('left');

    useEffect(() => {
        const onScroll = ({ target }: Event) => {
            const { scrollLeft, scrollWidth, offsetWidth} = target as HTMLDivElement;
            const position =
                (scrollLeft - SCROLL_THRESHOLD) <= 0 ? 'left' :
                    (scrollLeft + offsetWidth + SCROLL_THRESHOLD) >= scrollWidth ? 'right' :
                        'center';
            setScrollPosition(position);
        };

        ref.current?.addEventListener('scroll', onScroll);
        return () => ref.current?.removeEventListener('scroll', onScroll);
    }, []);

    return (
        <div ref={ref} className={classNames(styles['chips'], [styles[scrollPosition]])}>
            {
                options.map(({ label, value }) => (
                    <Chip
                        key={value}
                        label={label}
                        value={value}
                        active={selected.includes(value)}
                        onSelect={onSelect}
                    />
                ))
            }
        </div>
    );
});

export default Chips;