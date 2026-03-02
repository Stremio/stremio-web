// Copyright (C) 2017-2023 Smart code 203358507

import React, { forwardRef } from 'react';
import classnames from 'classnames';
import { Button } from 'stremio/components';
import styles from './Toggle.less';

type Props = {
    className?: string,
    checked: boolean,
    disabled?: boolean,
    tabIndex?: number,
    children?: React.ReactNode,
};

const Toggle = forwardRef(({ className, checked, children, ...props }: Props, ref) => {
    return (
        <Button {...props} ref={ref} className={classnames(className, styles['toggle-container'], { 'checked': checked })}>
            <div className={styles['toggle']} />
            {children}
        </Button>
    );
});

Toggle.displayName = 'Toggle';

export default Toggle;
