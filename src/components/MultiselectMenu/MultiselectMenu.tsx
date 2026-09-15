// Copyright (C) 2017-2024 Smart code 203358507

import React from 'react';
import { Button } from 'stremio/components';
import useBinaryState from 'stremio/common/useBinaryState';
import Dropdown from './Dropdown';
import classNames from 'classnames';
import Icon from '@stremio/stremio-icons/react';
import styles from './MultiselectMenu.less';
import useOutsideClick from 'stremio/common/useOutsideClick';
import Popup from 'stremio/components/Popup';

type Props = {
    className?: string,
    title?: string | (() => string | null);
    icon?: string;
    options: MultiselectMenuOption[];
    value?: any;
    disabled?: boolean,
    portal?: boolean;
    onSelect: (value: any) => void;
};

const MultiselectMenu = ({ className, title, icon, options, value, disabled, portal = false, onSelect }: Props) => {
    const [menuOpen, , closeMenu, toggleMenu] = useBinaryState(false);
    const [autoFocus, setAutoFocus] = React.useState(false);
    const multiselectMenuRef = useOutsideClick(closeMenu);
    const [level, setLevel] = React.useState<number>(0);

    const selectedOption = options.find((opt) => opt.value === value);
    const labelText = typeof title === 'function' ? title() : title ?? selectedOption?.label;

    const onOptionSelect = (selectedValue: string | number) => {
        level ? setLevel(level + 1) : onSelect(selectedValue), closeMenu();
    };

    const containerClassName = classNames(styles['multiselect-menu'], { [styles['active']]: menuOpen }, className);
    const label = <Button
        className={classNames(styles['multiselect-button'], { [styles['open']]: menuOpen })}
        disabled={disabled}
        onClick={(event) => {
            setAutoFocus(event.detail === 0);
            toggleMenu();
        }}
        tabIndex={0}
        aria-haspopup='listbox'
        aria-expanded={menuOpen}
        role={icon ? 'button' : undefined}
        aria-label={icon ? labelText : undefined}
        title={icon ? labelText : undefined}
    >
        <div className={styles['label']}>
            {icon ? <Icon name={icon} className={styles['label-icon']} /> : labelText}
        </div>
        {!icon && <Icon name={'caret-down'} className={classNames(styles['icon'], { [styles['open']]: menuOpen })} />}
    </Button>;
    const menu = menuOpen ? <Dropdown
        level={level}
        setLevel={setLevel}
        options={options}
        onSelect={onOptionSelect}
        menuOpen={menuOpen}
        value={value}
    /> : null;

    return portal ? <Popup
        open={menuOpen}
        portal={true}
        autoFocus={autoFocus}
        menuClassName={styles['menu-popup']}
        onCloseRequest={closeMenu}
        renderLabel={({ ref, className: popupClassName }: { ref: React.Ref<HTMLDivElement>; className: string }) => (
            <div ref={ref} className={classNames(containerClassName, popupClassName)}>{label}</div>
        )}
        renderMenu={() => menu}
    /> : (
        <div className={containerClassName} ref={multiselectMenuRef}>
            {label}
            {menu}
        </div>
    );
};

export default MultiselectMenu;
