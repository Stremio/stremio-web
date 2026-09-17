// Copyright (C) 2017-2026 Smart code 203358507

import React, { useCallback, useEffect, useRef, useState } from 'react';
import classNames from 'classnames';
import styles from './Logo.less';

type Props = {
    src: string | null;
    name: string;
};

const Logo = ({ src, name }: Props) => {
    const imageRef = useRef<HTMLImageElement>(null);
    const [loaded, setLoaded] = useState(false);
    const [failed, setFailed] = useState(false);

    const onLoad = useCallback((event: React.SyntheticEvent<HTMLImageElement>) => {
        setLoaded(event.currentTarget.naturalWidth > 0);
    }, []);
    const onError = useCallback(() => setFailed(true), []);

    useEffect(() => {
        const image = imageRef.current;
        if (image !== null && image.complete && image.naturalWidth > 0) {
            setLoaded(true);
        }
    }, [src]);

    return (
        <React.Fragment>
            {
                loaded ?
                    null
                    :
                    <div className={styles['name']}>{name}</div>
            }
            {
                src !== null && !failed ?
                    <img
                        ref={imageRef}
                        className={classNames(styles['logo'], { [styles['loading']]: !loaded })}
                        src={src}
                        alt={''}
                        onLoad={onLoad}
                        onError={onError}
                    />
                    :
                    null
            }
        </React.Fragment>
    );
};

export default Logo;
