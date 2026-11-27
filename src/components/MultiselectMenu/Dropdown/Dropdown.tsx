// Copyright (C) 2017-2024 Smart code 203358507

import React, { useRef, useEffect, useCallback } from 'react';
import { Button } from 'stremio/components';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';
import Option from './Option';
import Icon from '@stremio/stremio-icons/react';
import { getInterfaceRect } from 'stremio/common/interfaceScale';
import styles from './Dropdown.less';

const TYPEAHEAD_TIMEOUT_MS = 700;

type Props = {
    options: MultiselectMenuOption[];
    value?: any;
    menuOpen: boolean | (() => void);
    level: number;
    setLevel: (level: number) => void;
    onSelect: (value: any) => void;
};

const Dropdown = ({ level, setLevel, options, onSelect, value, menuOpen }: Props) => {
    const { t } = useTranslation();
    const optionsRef = useRef(new Map<MultiselectMenuOption['value'], HTMLButtonElement>());
    const containerRef = useRef<HTMLDivElement>(null);
    const searchRef = useRef({ text: '', lastKeyTime: 0 });
    const selectedOptionValue = options.find((opt) => opt.value === value)?.value;

    const handleSetOptionRef = useCallback((optionValue: MultiselectMenuOption['value']) => (node: HTMLButtonElement | null) => {
        if (node) {
            optionsRef.current.set(optionValue, node);
        } else {
            optionsRef.current.delete(optionValue);
        }
    }, []);

    const handleBackClick = useCallback(() => {
        setLevel(level - 1);
    }, [setLevel, level]);

    useEffect(() => {
        const container = containerRef.current;
        if (!menuOpen || selectedOptionValue === undefined || !container) return;
        const selectedNode = optionsRef.current.get(selectedOptionValue);
        if (!selectedNode) return;
        const listBounds = getInterfaceRect(container);
        const optionBounds = getInterfaceRect(selectedNode);
        if (optionBounds.top < listBounds.top || optionBounds.bottom > listBounds.bottom) {
            container.scrollBy({ top: optionBounds.top - listBounds.top, behavior: 'smooth' });
        }
    }, [menuOpen, selectedOptionValue]);

    useEffect(() => {
        const container = containerRef.current;
        if (!menuOpen || !container) return;

        const onKeyDown = (event: KeyboardEvent) => {
            if (event.defaultPrevented || event.isComposing || event.ctrlKey || event.altKey || event.metaKey ||
                !container.getClientRects().length) {
                return;
            }

            const focused = document.activeElement;
            const trigger = container.parentElement?.querySelector('[aria-haspopup="listbox"][aria-expanded="true"]');
            if (focused !== document.body && !container.contains(focused) && focused !== trigger) return;

            const backspace = event.key === 'Backspace';
            if (!backspace && Array.from(event.key).length !== 1) return;
            const { text, lastKeyTime } = searchRef.current;
            const previous = event.timeStamp - lastKeyTime <= TYPEAHEAD_TIMEOUT_MS ? text : '';
            if (event.key === ' ' && previous.length === 0) return;

            event.preventDefault();
            event.stopPropagation();
            const query = backspace ? Array.from(previous).slice(0, -1).join('') : previous + event.key.toLocaleLowerCase();
            searchRef.current = { text: query, lastKeyTime: event.timeStamp };
            if (query.length === 0) return;

            const characters = Array.from(query);
            const cycling = !backspace && characters.every((character) => character === characters[0]);
            const prefix = cycling ? characters[0] : query;
            const choices = options.filter((option) => optionsRef.current.has(option.value));
            const current = choices.findIndex((option) => optionsRef.current.get(option.value) === focused);
            const start = current < 0 ? 0 : current + Number(cycling);
            const match = [...choices.slice(start), ...choices.slice(0, start)]
                .find((option) => option.label.trimStart().toLocaleLowerCase().startsWith(prefix));
            if (match) optionsRef.current.get(match.value)?.focus();
        };

        window.addEventListener('keydown', onKeyDown, true);
        return () => window.removeEventListener('keydown', onKeyDown, true);
    }, [menuOpen, options]);

    return (
        <div
            className={classNames(styles['dropdown'], { [styles['open']]: menuOpen })}
            role={'listbox'}
            ref={containerRef}
        >
            {level > 0 ?
                <Button className={styles['back-button']} onClick={handleBackClick}>
                    <Icon name={'caret-left'} className={styles['back-button-icon']} />
                    {t('BACK')}
                </Button>
                : null
            }
            {options
                .filter((option: MultiselectMenuOption) => !option.hidden)
                .map((option: MultiselectMenuOption) => (
                    <Option
                        key={option.value}
                        ref={handleSetOptionRef(option.value)}
                        option={option}
                        onSelect={onSelect}
                        selectedValue={value}
                    />
                ))
            }
        </div>
    );
};

export default Dropdown;
