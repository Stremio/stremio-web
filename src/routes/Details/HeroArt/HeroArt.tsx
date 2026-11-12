// Copyright (C) 2017-2026 Smart code 203358507

import React from 'react';
import classNames from 'classnames';
import Image from 'stremio/components/Image';
import Logo from 'stremio/components/Logo';
import styles from './HeroArt.less';

type Props = {
    className?: string,
    art: string | null,
    still?: string | null,
    logo: string | null,
    name: string,
    label?: string | null,
    title?: string | null,
    blurred?: boolean,
};

const renderFallback = () => null;

const HeroArt = ({ className, art, still = null, logo, name, label = null, title = null, blurred = false }: Props) => (
    <React.Fragment>
        <div className={styles['bar']} aria-hidden={'true'}>
            <div className={styles['bar-content']}>
                <div className={styles['bar-title']}>
                    {
                        typeof title === 'string' ?
                            <div className={styles['bar-text']}>{title}</div>
                            :
                            null
                    }
                    <Logo className={classNames({ [styles['hidden']]: typeof title === 'string' })} logo={logo} name={name} small={true} />
                </div>
            </div>
        </div>
        <header className={classNames(className, styles['hero-art'])} aria-hidden={'true'}>
            <div className={styles['pin']}>
                <div className={styles['art']}>
                    {
                        typeof art === 'string' && art.length > 0 ?
                            <Image className={styles['image']} src={art} alt={''} renderFallback={renderFallback} />
                            :
                            null
                    }
                    {
                        typeof still === 'string' && still.length > 0 ?
                            <Image className={classNames(styles['image'], styles['still'], { [styles['blurred']]: blurred })} src={still} alt={''} renderFallback={renderFallback} />
                            :
                            null
                    }
                    <div className={styles['scrim']} />
                </div>
            </div>
        </header>
        <div className={styles['copy']}>
            {
                typeof title === 'string' ?
                    <React.Fragment>
                        {
                            typeof label === 'string' && label.length > 0 ?
                                <div className={styles['label']}>{label}</div>
                                :
                                null
                        }
                        <h1 className={styles['title']}>{title}</h1>
                    </React.Fragment>
                    :
                    null
            }
            <Logo className={classNames({ [styles['hidden']]: typeof title === 'string' })} logo={logo} name={name} />
        </div>
    </React.Fragment>
);

export default HeroArt;
