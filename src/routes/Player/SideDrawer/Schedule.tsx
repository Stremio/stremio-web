// Copyright (C) 2017-2026 Smart code 203358507

import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';
import { useEpgNow } from 'stremio/common/EPG';
import Logo from 'stremio/components/Logo';
import Agenda from 'stremio/routes/Details/Live/Guide/Agenda';
import Programme from 'stremio/routes/Details/Live/Programme';
import getProgrammeKey from 'stremio/routes/Details/Live/getProgrammeKey';
import useProgrammes from 'stremio/routes/Details/Live/useProgrammes';
import Message from 'stremio/routes/Details/Message';
import styles from './SideDrawer.less';

type Props = {
    metaItem: MetaItem,
};

const Schedule = ({ metaItem }: Props) => {
    const { t } = useTranslation();
    const now = useEpgNow(true);
    const [selectedKey, setSelectedKey] = useState<string | null>(null);
    const { channel, programmes, selected } = useProgrammes(metaItem, now, selectedKey);

    return (
        <React.Fragment>
            <div className={classNames(styles['info'], styles['programme'])}>
                <Logo className={styles['logo']} logo={channel.logo} name={channel.name} />
                <Programme programme={selected} now={now} compact={true} />
            </div>
            <div className={styles['videos']}>
                {
                    programmes.length > 0 ?
                        <Agenda
                            programmes={programmes}
                            now={now}
                            selectedKey={selected !== null ? getProgrammeKey(selected) : null}
                            nowToken={0}
                            isMobile={false}
                            onSelect={setSelectedKey}
                        />
                        :
                        <Message label={t('LIVE_TV_NO_SCHEDULE')} />
                }
            </div>
        </React.Fragment>
    );
};

export default Schedule;
