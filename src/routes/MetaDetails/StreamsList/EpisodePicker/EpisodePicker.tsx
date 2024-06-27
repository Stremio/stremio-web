// Copyright (C) 2017-2024 Smart code 203358507

import { Multiselect } from 'stremio/common';
import React from 'react';
import styles from './styles.less';
import { useTranslation } from 'react-i18next';

type Props = {
    video: Video;
    metaItem: MetaItem;
    seasonOnSelect: (season: number) => void,
    season: number,
};

const EpisodePicker = (props: Props) => {
    const { t } = useTranslation();

    console.log(props.season);

    // const options = props.metaItem;;

    return (
        <div className={styles['episode-selector-container']}>
             <Multiselect
                className={styles['label-container']}
                title={props.season > 0 ? `${t('SEASON')} ${props.season}` : t('SPECIAL')}
                direction={'bottom-left'}
                // options={options}
                // selected={selectedOption}
                onSelect={props.seasonOnSelect}
            />
        </div>
    );
};

export default EpisodePicker;