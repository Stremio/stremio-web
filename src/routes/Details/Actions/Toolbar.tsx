// Copyright (C) 2017-2026 Smart code 203358507

import React from 'react';
import classNames from 'classnames';
import Groups from './Groups';
import type { GroupsProps } from './Groups';
import styles from './Toolbar.less';

type Props = GroupsProps & {
    className?: string,
};

const Toolbar = ({ className, inLibrary, onToggleLibrary, watched, onToggleWatched, ratingInfo = null }: Props) => (
    <div className={classNames(className, styles['toolbar'])}>
        <Groups
            className={styles['group']}
            inLibrary={inLibrary}
            onToggleLibrary={onToggleLibrary}
            watched={watched}
            onToggleWatched={onToggleWatched}
            ratingInfo={ratingInfo}
        />
    </div>
);

export default Toolbar;
