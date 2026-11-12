// Copyright (C) 2017-2026 Smart code 203358507

import React from 'react';
import classNames from 'classnames';
import Image from 'stremio/components/Image';
import styles from './Message.less';

type Props = {
    className?: string,
    label: string,
    children?: React.ReactNode,
};

const Message = ({ className, label, children }: Props) => (
    <div className={classNames(className, styles['message'])} role={'status'}>
        <Image className={styles['image']} src={require('/assets/images/empty.png')} alt={''} />
        <div className={styles['label']}>{label}</div>
        {children}
    </div>
);

export default Message;
