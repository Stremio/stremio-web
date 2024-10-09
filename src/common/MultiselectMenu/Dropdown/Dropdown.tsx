// Copyright (C) 2017-2024 Smart code 203358507

import React from 'react';
import Button from 'stremio/common/Button';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';
import Option from './Option';
import Icon from '@stremio/stremio-icons/react';
import styles from './Dropdown.less';

type Props = {
    options: MultiselectMenuOption[];
    selectedOption?: MultiselectMenuOption | null;
    menuOpen: boolean | (() => void);
    level: number;
    setLevel: (level: number) => void;
    onSelect: (value: number) => void;
};

const Dropdown = ({ level, setLevel, options, onSelect, selectedOption, menuOpen }: Props) => {
    const { t } = useTranslation();

    const onBackButtonClick = () => {
        setLevel(level - 1);
    };

    return (
        <div className={classNames(styles['dropdown'], { [styles['open']]: menuOpen })} role={'listbox'}>
            {
                level > 0 ?
                    <Button className={styles['back-button']} onClick={onBackButtonClick}>
                        <Icon name={'caret-left'} className={styles['back-button-icon']} />
                        {t('BACK')}
                    </Button>
                    : null
            }
            {
                options
                    .filter((option: MultiselectMenuOption) => !option.hidden)
                    .map((option: MultiselectMenuOption, index) => (
                        <Option
                            key={index}
                            option={option}
                            onSelect={onSelect}
                            selectedOption={selectedOption}
                        />
                    ))

            }
        </div>
    );
};

export default Dropdown;
