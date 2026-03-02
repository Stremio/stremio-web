import React from 'react';
import { Button } from 'stremio/components';
import styles from './Link.less';

type Props = {
    label: string,
    href?: string,
    target?: string,
    onClick?: () => void,
};

const Link = ({ label, href, target, onClick }: Props) => {
    return (
        <Button className={styles['link']} title={label} target={target ?? '_blank'} href={href} onClick={onClick}>
            <div className={styles['label']}>{ label }</div>
        </Button>
    );
};

export default Link;
