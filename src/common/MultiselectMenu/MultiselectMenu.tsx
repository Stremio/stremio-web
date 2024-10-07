// Copyright (C) 2017-2024 Smart code 203358507

import React from 'react';
import Button from 'stremio/common/Button';
import useBinaryState from 'stremio/common/useBinaryState';
import Dropdown from './Dropdown';
import classNames from 'classnames';
import Icon from '@stremio/stremio-icons/react';
import styles from './MultiselectMenu.less';
import useOutsideClick from 'stremio/common/useOutsideClick';

type Props = {
    className?: string,
    title?: string;
    options: MultiselectMenuOption[];
    selectedOption?: MultiselectMenuOption;
    onSelect: (value: number) => void;
};

const MultiselectMenu = ({ className, title, options, selectedOption, onSelect }: Props) => {
    const [menuOpen, , closeMenu, toggleMenu] = useBinaryState(false);
    const multiselectMenuRef = useOutsideClick(() => closeMenu());
    const [level, setLevel] = React.useState<number>(0);

    const onOptionSelect = (value: number) => {
        level ? setLevel(level + 1) : onSelect(value), closeMenu();
    };

    return (
        <div className={classNames(styles['multiselect-menu'], className)} ref={multiselectMenuRef}>
            <Button
                className={classNames(styles['multiselect-button'], { [styles['open']]: menuOpen })}
                onClick={toggleMenu}
                tabIndex={0}
                aria-haspopup='listbox'
                aria-expanded={menuOpen}
            >
                {title}
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
                        selectedOption={selectedOption}
                    />
                    : null
            }
        </div>
    );
};

export default MultiselectMenu;
