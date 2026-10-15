// Copyright (C) 2017-2026 Smart code 203358507

import React from 'react';
import classNames from 'classnames';
import Icon from '@stremio/stremio-icons/react';
import Button from 'stremio/components/Button';
import styles from './PlayButton.less';

type Props = {
    className?: string,
    icon?: string,
    label: string,
    sublabel?: string | null,
    href?: string | null,
    target?: '_blank',
    download?: string,
    disabled?: boolean,
    onClick?: () => void,
};

const PlayButton = ({ className, icon = 'play', label, sublabel = null, href = null, target, download, disabled = false, onClick }: Props) => (
    <Button
        className={classNames(className, styles['play-button'], { [styles['disabled']]: disabled })}
        title={label}
        href={href ?? undefined}
        target={target}
        download={download}
        disabled={disabled}
        onClick={onClick}
    >
        <Icon className={styles['icon']} name={icon} />
        <div className={styles['label']}>{label}</div>
        {
            typeof sublabel === 'string' && sublabel.length > 0 ?
                <React.Fragment>
                    <div className={styles['separator']} />
                    <div className={styles['sublabel']}>{sublabel}</div>
                </React.Fragment>
                :
                null
        }
    </Button>
);

export default PlayButton;
