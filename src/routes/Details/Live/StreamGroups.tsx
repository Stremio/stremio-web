// Copyright (C) 2017-2026 Smart code 203358507

import React from 'react';
import { useTranslation } from 'react-i18next';
import { Stream } from '../Streams';
import LiveFlag from './LiveFlag';
import styles from './StreamGroups.less';

type Props = {
    streams: MetaDetails['streams'],
    live: boolean,
    programmeTitle: string | null,
    channelName: string,
    onClose: () => void,
};

const StreamGroups = ({ streams, live, programmeTitle, channelName, onClose }: Props) => {
    const { t } = useTranslation();
    const subtitle = [programmeTitle, channelName].filter((part) => typeof part === 'string' && part.length > 0).join(' · ');

    return (
        <div className={styles['stream-groups']}>
            <div className={styles['subtitle']}>
                {
                    live ?
                        <LiveFlag />
                        :
                        null
                }
                <div className={styles['subtitle-text']}>{subtitle}</div>
            </div>
            <div className={styles['groups']} aria-label={t('STREAMS')}>
                {
                    streams.map((resource) => (
                        resource.content.type === 'Ready' && resource.content.content.length > 0 ?
                            <div key={resource.addon.transportUrl} className={styles['group']}>
                                <div className={styles['group-label']}>
                                    <div className={styles['addon-name']}>{resource.addon.manifest.name}</div>
                                    <div>{resource.content.content.length}</div>
                                </div>
                                {
                                    resource.content.content.map((stream, index) => (
                                        <Stream
                                            key={index}
                                            card={true}
                                            stream={stream}
                                            addonName={resource.addon.manifest.name}
                                            onPlay={onClose}
                                        />
                                    ))
                                }
                            </div>
                            :
                            null
                    ))
                }
            </div>
        </div>
    );
};

export default StreamGroups;
