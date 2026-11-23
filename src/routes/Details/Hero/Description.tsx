// Copyright (C) 2017-2026 Smart code 203358507

import React, { useCallback, useEffect, useState } from 'react';
import classNames from 'classnames';
import styles from './Description.less';

type Props = {
    className?: string,
    text: string | null | undefined,
};

const isClamped = (element: HTMLElement) => element.scrollHeight > element.clientHeight + 1;

const Description = ({ className, text }: Props) => {
    const [expanded, setExpanded] = useState(false);
    const [clamped, setClamped] = useState(false);

    const onMouseEnter = useCallback((event: React.MouseEvent<HTMLParagraphElement>) => {
        setClamped(isClamped(event.currentTarget));
    }, []);

    const onClick = useCallback((event: React.MouseEvent<HTMLParagraphElement>) => {
        if (expanded || isClamped(event.currentTarget)) {
            setExpanded(!expanded);
        }
    }, [expanded]);

    useEffect(() => {
        setExpanded(false);
    }, [text]);

    if (typeof text !== 'string' || text.length === 0) {
        return null;
    }

    return (
        <p
            className={classNames(className, styles['description'], { [styles['expandable']]: expanded || clamped, [styles['expanded']]: expanded })}
            aria-expanded={expanded}
            onMouseEnter={onMouseEnter}
            onClick={onClick}
        >
            {text}
        </p>
    );
};

export default Description;
