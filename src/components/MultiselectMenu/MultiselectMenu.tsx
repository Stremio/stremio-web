// Copyright (C) 2017-2024 Smart code 203358507

import React from 'react';
import classNames from 'classnames';
import useBinaryState from 'stremio/common/useBinaryState';
import useOutsideClick from 'stremio/common/useOutsideClick';
import { useRouteActive } from 'stremio/common/useRouteFocused';
import Popup from 'stremio/components/Popup';
import Dropdown from './Dropdown';
import Label from './Label';
import styles from './MultiselectMenu.less';

const TYPEAHEAD_TIMEOUT = 700;

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
    const multiselectMenuRef = useOutsideClick(closeMenu);
    const dropdownRef = React.useRef<HTMLDivElement>(null);
    const searchRef = React.useRef({ prefix: '', time: 0 });
    const [level, setLevel] = React.useState<number>(0);
    const routeActive = useRouteActive();

    const selectedOption = options.find((opt) => opt.value === value);
    const labelText = typeof title === 'function' ? title() : title ?? selectedOption?.label;

    const focusLabel = React.useCallback(() => {
        multiselectMenuRef.current?.querySelector<HTMLElement>('[aria-haspopup="listbox"]')?.focus({ preventScroll: true });
    }, [multiselectMenuRef]);

    const onMenuKeyDown = React.useCallback((event: React.KeyboardEvent<HTMLDivElement>) => {
        if (!menuOpen || event.defaultPrevented || event.nativeEvent.isComposing) {
            return;
        }

        if (!portal && event.key === 'Escape') {
            event.preventDefault();
            event.stopPropagation();
            focusLabel();
            closeMenu();
            return;
        }

        if (event.ctrlKey || event.altKey || event.metaKey || Array.from(event.key).length !== 1) {
            return;
        }

        const { prefix: previousPrefix, time } = searchRef.current;
        const previous = event.timeStamp - time <= TYPEAHEAD_TIMEOUT ? previousPrefix : '';
        if (event.key === ' ' && previous.length === 0) {
            return;
        }

        event.preventDefault();
        event.stopPropagation();
        const key = event.key.toLocaleLowerCase();
        const prefix = previous === key ? key : previous + key;
        searchRef.current = { prefix, time: event.timeStamp };

        const choices = Array.from(dropdownRef.current?.querySelectorAll<HTMLElement>('[role="option"]') ?? []);
        const focused = choices.findIndex((choice) => choice === document.activeElement);
        const start = focused < 0 ? 0 : focused + (prefix === key ? 1 : 0);
        const match = [...choices.slice(start), ...choices.slice(0, start)]
            .find((choice) => choice.textContent?.trimStart().toLocaleLowerCase().startsWith(prefix));
        match?.focus();
    }, [menuOpen, portal, focusLabel, closeMenu]);

    const onOptionSelect = React.useCallback((selectedValue: string | number) => {
        if (!portal && dropdownRef.current?.contains(document.activeElement)) {
            focusLabel();
        }
        if (level) {
            setLevel(level + 1);
        } else {
            onSelect(selectedValue);
        }
        closeMenu();
    }, [portal, focusLabel, level, onSelect, closeMenu]);
    const onLabelClick = React.useCallback((event: React.MouseEvent<HTMLDivElement>) => {
        searchRef.current = { prefix: '', time: 0 };
        if (!portal && event.detail > 0 && !menuOpen) {
            event.currentTarget.focus({ preventScroll: true });
        }
        toggleMenu();
    }, [menuOpen, portal, toggleMenu]);

    React.useEffect(() => {
        if (portal && !routeActive) closeMenu();
    }, [portal, routeActive, closeMenu]);

    const containerClassName = classNames(styles['multiselect-menu'], { [styles['active']]: menuOpen }, className);
    const renderLabel = React.useCallback(({ ref, className: popupClassName }: { ref: React.Ref<HTMLDivElement>; className?: string }) => (
        <div ref={ref} className={classNames(containerClassName, popupClassName)} onKeyDown={onMenuKeyDown}>
            <Label text={labelText} icon={icon} disabled={disabled} open={menuOpen} onClick={onLabelClick} />
        </div>
    ), [containerClassName, labelText, icon, disabled, menuOpen, onLabelClick, onMenuKeyDown]);
    const renderMenu = React.useCallback(() => menuOpen ? (
        <Dropdown
            containerRef={dropdownRef}
            onKeyDown={portal ? onMenuKeyDown : undefined}
            level={level}
            setLevel={setLevel}
            options={options}
            onSelect={onOptionSelect}
            menuOpen={menuOpen}
            value={value}
        />
    ) : null, [menuOpen, level, options, onOptionSelect, value, portal, onMenuKeyDown]);

    return portal ? (
        <Popup
            open={menuOpen}
            portal={true}
            autoFocus={true}
            menuClassName={styles['menu-popup']}
            onCloseRequest={closeMenu}
            renderLabel={renderLabel}
            renderMenu={renderMenu}
        />
    ) : (
        <div className={containerClassName} ref={multiselectMenuRef} onKeyDown={onMenuKeyDown}>
            <Label text={labelText} icon={icon} disabled={disabled} open={menuOpen} onClick={onLabelClick} />
            {renderMenu()}
        </div>
    );
};

export default MultiselectMenu;
