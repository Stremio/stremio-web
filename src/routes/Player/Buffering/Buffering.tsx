import React, { forwardRef, useMemo } from 'react';
import classNames from 'classnames';
import { Image } from 'stremio/components';
import styles from './Buffering.less';

type Props = {
    className: string,
    logo: string,
    progress: number,
};

const Buffering = forwardRef<HTMLDivElement, Props>(({ className, logo, progress }, ref) => {
    const style = useMemo(() => {
        return {
            clipPath: `inset(0 ${100 - progress}% 0 0)`,
        };
    }, [progress]);

    return (
        <div ref={ref} className={classNames(className, styles['buffering'])}>
            <Image
                className={styles['logo']}
                style={style}
                src={logo}
                alt={' '}
                fallbackSrc={require('/assets/images/stremio_symbol.png')}
            />
            <Image
                className={classNames(styles['logo'], styles['background'])}
                src={logo}
                alt={' '}
                fallbackSrc={require('/assets/images/stremio_symbol.png')}
            />
        </div>
    );
});

export default Buffering;
