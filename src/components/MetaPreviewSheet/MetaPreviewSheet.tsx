// Copyright (C) 2017-2026 Smart code 203358507

import React from 'react';
import BottomSheet from 'stremio/components/BottomSheet';
import styles from './MetaPreviewSheet.less';

type Props = {
    children: React.ReactNode;
    show: boolean;
    onCloseRequest: () => void;
    onExited?: () => void;
    ariaLabel: string;
};

const MetaPreviewSheet = ({ children, show, onCloseRequest, onExited, ariaLabel }: Props) => (
    <BottomSheet
        className={styles['sheet']}
        show={show}
        onCloseRequest={onCloseRequest}
        onExited={onExited}
        closeOnContentClick={false}
        closeOnOrientationChange={false}
        flush={true}
        ariaLabel={ariaLabel}
    >
        {children}
    </BottomSheet>
);

export default MetaPreviewSheet;
