// Copyright (C) 2017-2026 Smart code 203358507

import React from 'react';
import classNames from 'classnames';
import { useTranslation } from 'react-i18next';
import styles from './LiveFlag.less';

type Props = {
    className?: string,
};

const LiveFlag = ({ className }: Props) => {
    const { t } = useTranslation();

    return <div className={classNames(className, styles['live-flag'])}>{t('PLAYER_LIVE')}</div>;
};

export default LiveFlag;
