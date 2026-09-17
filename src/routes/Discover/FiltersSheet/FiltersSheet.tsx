// Copyright (C) 2017-2026 Smart code 203358507

import React from 'react';
import { useTranslation } from 'react-i18next';
import BottomSheet from 'stremio/components/BottomSheet';
import Selection from './Selection';
import { Input } from './types';
import styles from './FiltersSheet.less';

type Props = {
    inputs: Input[];
    show: boolean;
    onCloseRequest: () => void;
};

const FiltersSheet = ({ inputs, show, onCloseRequest }: Props) => {
    const { t } = useTranslation();

    return (
        <BottomSheet
            className={styles['sheet']}
            show={show}
            onCloseRequest={onCloseRequest}
            closeOnContentClick={false}
            closeOnOrientationChange={false}
            flush={true}
            ariaLabel={t('CATALOG_FILTERS')}
        >
            <Selection inputs={inputs} onCloseRequest={onCloseRequest} />
        </BottomSheet>
    );
};

export default FiltersSheet;
