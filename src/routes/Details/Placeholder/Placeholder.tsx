// Copyright (C) 2017-2026 Smart code 203358507

import React from 'react';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';
import styles from './Placeholder.less';

type Variant = 'hero' | 'episode' | 'live' | 'dock' | 'control' | 'guide' | 'videos' | 'streams' | 'agenda' | 'timeline';

type Props = {
    className?: string,
    variant: Variant,
};

const ROWS = [0, 1, 2, 3, 4, 5];
const LINK_ROWS = [2, 3, 1];

const Bone = ({ className }: { className: string }) => (
    <div className={classNames(styles['bone'], styles[className])} />
);

const renderLines = () => (
    <div className={styles['lines']}>
        <Bone className={'line'} />
        <Bone className={'line'} />
        <Bone className={'short'} />
    </div>
);

const renderFacts = () => (
    <div className={styles['facts']}>
        <Bone className={'fact'} />
        <Bone className={'fact'} />
        <Bone className={'fact'} />
    </div>
);

const renderArt = () => (
    <div className={styles['art']}>
        <Bone className={'logo'} />
    </div>
);

const renderContent = (variant: Variant) => {
    switch (variant) {
        case 'hero':
        case 'episode':
            return (
                <React.Fragment>
                    {renderArt()}
                    {
                        variant === 'episode' ?
                            <React.Fragment>
                                <Bone className={'still'} />
                                <Bone className={'title'} />
                            </React.Fragment>
                            :
                            null
                    }
                    {renderFacts()}
                    {renderLines()}
                    {
                        variant === 'hero' ?
                            <div className={styles['links']}>
                                {
                                    LINK_ROWS.map((pills, row) => (
                                        <div key={row} className={styles['link-row']}>
                                            <Bone className={'label'} />
                                            {ROWS.slice(0, pills).map((pill) => <Bone key={pill} className={'pill'} />)}
                                        </div>
                                    ))
                                }
                            </div>
                            :
                            null
                    }
                    <div className={styles['spacer']} />
                    <div className={styles['actions']}>
                        <Bone className={'action'} />
                        <Bone className={'group'} />
                        <Bone className={'circle'} />
                    </div>
                </React.Fragment>
            );
        case 'live':
            return (
                <React.Fragment>
                    {renderArt()}
                    <div className={styles['channel']}>
                        <Bone className={'mark'} />
                        <div className={styles['lines']}>
                            <Bone className={'name'} />
                            <Bone className={'addon'} />
                        </div>
                    </div>
                    <div className={styles['spacer']} />
                    <Bone className={'status'} />
                    <Bone className={'title'} />
                    {renderLines()}
                    <div className={styles['link-row']}>
                        <Bone className={'label'} />
                        <Bone className={'pill'} />
                    </div>
                    <div className={styles['playback']}>
                        <Bone className={'watch'} />
                        <Bone className={'action'} />
                        <Bone className={'circle'} />
                    </div>
                    <Bone className={'guide-title'} />
                </React.Fragment>
            );
        case 'dock':
            return <Bone className={'group'} />;
        case 'control':
            return <Bone className={'bar'} />;
        case 'guide':
            return (
                <React.Fragment>
                    <div className={styles['guide-row']}>
                        <Bone className={'heading'} />
                        <Bone className={'round'} />
                        <Bone className={'now'} />
                        <Bone className={'round'} />
                    </div>
                    <div className={styles['guide-row']}>
                        <Bone className={'bar'} />
                        <Bone className={'round'} />
                        <Bone className={'round'} />
                        <Bone className={'round'} />
                    </div>
                </React.Fragment>
            );
        case 'timeline':
            return ROWS.slice(0, 3).map((row) => (
                <div key={row} className={styles['slot']}>
                    <Bone className={'hour'} />
                    <Bone className={'tile'} />
                </div>
            ));
        default:
            return (
                <React.Fragment>
                    {
                        variant === 'videos' ?
                            <Bone className={'search'} />
                            :
                            <Bone className={'section'} />
                    }
                    {
                        ROWS.map((row) => (
                            <div key={row} className={styles['item']}>
                                {
                                    variant === 'agenda' ?
                                        <Bone className={'time'} />
                                        :
                                        null
                                }
                                {
                                    variant !== 'streams' ?
                                        <Bone className={'thumbnail'} />
                                        :
                                        null
                                }
                                <div className={styles['lines']}>
                                    <Bone className={'line'} />
                                    <Bone className={'short'} />
                                </div>
                                {
                                    variant === 'streams' ?
                                        <Bone className={'circle'} />
                                        :
                                        null
                                }
                            </div>
                        ))
                    }
                </React.Fragment>
            );
    }
};

const Placeholder = ({ className, variant }: Props) => {
    const { t } = useTranslation();

    return (
        <div className={classNames(className, styles['placeholder'], styles[variant])} role={'status'} aria-label={t('STREAM_LOADING')}>
            {renderContent(variant)}
        </div>
    );
};

export default Placeholder;
