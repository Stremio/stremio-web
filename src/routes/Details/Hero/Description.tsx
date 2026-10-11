// Copyright (C) 2017-2026 Smart code 203358507

import React, { useCallback, useEffect, useState } from 'react';
import classNames from 'classnames';
import styles from './Description.less';

type Props = {
    className?: string,
    text: string | null | undefined,
};

const Description = ({ className, text }: Props) => {
    const [expanded, setExpanded] = useState(false);

    const toggle = useCallback(() => {
        setExpanded((expanded) => !expanded);
    }, []);

    useEffect(() => {
        setExpanded(false);
    }, [text]);

    if (typeof text !== 'string' || text.length === 0) {
        return null;
    }

    return (
        <p
            className={classNames(className, styles['description'], { [styles['expanded']]: expanded })}
            aria-expanded={expanded}
            onClick={toggle}
        >
            {text}
        </p>
    );
};

export default Description;
