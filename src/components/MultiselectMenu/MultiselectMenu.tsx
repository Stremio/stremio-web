// Copyright (C) 2017-2024 Smart code 203358507

import React from 'react';
import { Button } from 'stremio/components';
import useBinaryState from 'stremio/common/useBinaryState';
import Dropdown from './Dropdown';
import classNames from 'classnames';
import Icon from '@stremio/stremio-icons/react';
import styles from './MultiselectMenu.less';
import useOutsideClick from 'stremio/common/useOutsideClick';

type Props = {
    className?: string,
    title?: string | (() => string | null);
    options: MultiselectMenuOption[];
    value?: any;
    disabled?: boolean,
    onSelect: (value: any) => void;
};

const MultiselectMenu = ({ className, title, options, value, disabled, onSelect }: Props) => {
    const [menuOpen, , closeMenu, toggleMenu] = useBinaryState(false);
    const multiselectMenuRef = useOutsideClick(() => closeMenu());
    const [level, setLevel] = React.useState<number>(0);

    const selectedOption = options.find((opt) => opt.value === value);

    const onOptionSelect = (selectedValue: string | number) => {
        level ? setLevel(level + 1) : onSelect(selectedValue), closeMenu();
    };

    return (
        <div className={classNames(styles['multiselect-menu'], { [styles['active']]: menuOpen }, className)} ref={multiselectMenuRef}>
            <Button
                className={classNames(styles['multiselect-button'], { [styles['open']]: menuOpen })}
                disabled={disabled}
                onClick={toggleMenu}
                tabIndex={0}
                aria-haspopup='listbox'
                aria-expanded={menuOpen}
            >
                <div className={styles['label']}>
                    {
                        typeof title === 'function'
                            ? title()
                            : title ?? selectedOption?.label
                    }
                </div>
                <Icon name={'caret-down'} className={classNames(styles['icon'], { [styles['open']]: menuOpen })} />
            </Button>
            {
                menuOpen ?
                    <Dropdown
                        level={level}
                        setLevel={setLevel}
                        options={options}
                        onSelect={onOptionSelect}
                        menuOpen={menuOpen}
                        value={value}
                    />
                    : null
            }
        </div>
    );
};

export default MultiselectMenu;
