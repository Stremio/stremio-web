// Copyright (C) 2017-2024 Smart code 203358507

import React from 'react';
import classNames from 'classnames';
import useBinaryState from 'stremio/common/useBinaryState';
import useOutsideClick from 'stremio/common/useOutsideClick';
import Popup from 'stremio/components/Popup';
import Dropdown from './Dropdown';
import Label from './Label';
import styles from './MultiselectMenu.less';

type Props = {
    className?: string,
    title?: string | (() => string | null),
    icon?: string,
    options: MultiselectMenuOption[],
    value?: any,
    disabled?: boolean,
    portal?: boolean,
    onSelect: (value: any) => void,
};

const MultiselectMenu = ({ className, title, icon, options, value, disabled, portal = false, onSelect }: Props) => {
    const [menuOpen, , closeMenu, toggleMenu] = useBinaryState(false);
    const [autoFocus, setAutoFocus] = React.useState(false);
    const multiselectMenuRef = useOutsideClick(closeMenu);
    const [level, setLevel] = React.useState<number>(0);

    const selectedOption = options.find((opt) => opt.value === value);
    const labelText = typeof title === 'function' ? title() : title ?? selectedOption?.label;

    const onOptionSelect = React.useCallback((selectedValue: string | number) => {
        if (level) {
            setLevel(level + 1);
        } else {
            onSelect(selectedValue);
        }
        closeMenu();
    }, [level, onSelect, closeMenu]);
    const onLabelClick = React.useCallback((event: React.MouseEvent<HTMLDivElement>) => {
        setAutoFocus(event.detail === 0);
        toggleMenu();
    }, [toggleMenu]);

    const containerClassName = classNames(styles['multiselect-menu'], { [styles['active']]: menuOpen }, className);
    const renderLabel = React.useCallback(({ ref, className: popupClassName }: { ref: React.Ref<HTMLDivElement>; className?: string }) => (
        <div ref={ref} className={classNames(containerClassName, popupClassName)}>
            <Label text={labelText} icon={icon} disabled={disabled} open={menuOpen} onClick={onLabelClick} />
        </div>
    ), [containerClassName, labelText, icon, disabled, menuOpen, onLabelClick]);
    const renderMenu = React.useCallback(() => menuOpen ? (
        <Dropdown
            level={level}
            setLevel={setLevel}
            options={options}
            onSelect={onOptionSelect}
            menuOpen={menuOpen}
            value={value}
        />
    ) : null, [menuOpen, level, options, onOptionSelect, value]);

    return portal ? (
        <Popup
            open={menuOpen}
            portal={true}
            autoFocus={autoFocus}
            menuClassName={styles['menu-popup']}
            onCloseRequest={closeMenu}
            renderLabel={renderLabel}
            renderMenu={renderMenu}
        />
    ) : (
        <div className={containerClassName} ref={multiselectMenuRef}>
            <Label text={labelText} icon={icon} disabled={disabled} open={menuOpen} onClick={onLabelClick} />
            {renderMenu()}
        </div>
    );
};

export default MultiselectMenu;
