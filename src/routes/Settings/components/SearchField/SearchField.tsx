// Copyright (C) 2017-2026 Smart code 203358507

import React from 'react';
import classNames from 'classnames';
import { useTranslation } from 'react-i18next';
import { SearchBar } from 'stremio/components';
import styles from './SearchField.less';

type Props = {
    className?: string,
    value: string,
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void,
};

const SearchField = ({ className, value, onChange }: Props) => {
    const { t } = useTranslation();

    return (
        <SearchBar
            className={classNames(className, styles['search-field'])}
            title={t('SETTINGS_SEARCH')}
            value={value}
            onChange={onChange}
        />
    );
};

export default SearchField;
