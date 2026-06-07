// Copyright (C) 2017-2026 Smart code 203358507
import { useEffect, useRef } from 'react';
import { useGamepad } from '../GamepadContext';

const FOCUSABLE = '[tabindex]:not([data-focus-guard])';

const getActiveScope = (fallback: HTMLDivElement | null): HTMLElement | null => {
    if (document.querySelector('[data-gamepad-modal="true"]')) return null;
    const modals = document.querySelectorAll<HTMLElement>('.modals-container');
    for (const modal of modals) {
        if (modal.children.length > 0) return modal;
    }
    const dropdown = fallback?.querySelector<HTMLElement>('[class*="dropdown"][class*="open"]');
    if (dropdown) return dropdown;
    return fallback;
};

const isVisible = (element: HTMLElement) => {
    const rect = element.getBoundingClientRect();
    const style = window.getComputedStyle(element);
    return rect.width > 0 && rect.height > 0 && style.visibility !== 'hidden' && style.display !== 'none';
};

const useContentGamepadNavigation = (
    sectionRef: React.RefObject<HTMLDivElement>,
    gamepadHandlerId: string,
) => {
    const gamepad = useGamepad();
    const lastFocused = useRef<HTMLElement | null>(null);
    const wasInOverlay = useRef(false);

    useEffect(() => {
        const getElements = (scope: HTMLElement | null) => Array.from(
            scope?.querySelectorAll<HTMLElement>(FOCUSABLE) || [],
        ).filter((element) => isVisible(element)
            && !element.closest('[aria-hidden="true"]')
            && !element.closest('[data-focus-guard]'));

        const focusElement = (element: HTMLElement) => {
            element.focus({ preventScroll: true });
            element.scrollIntoView({ block: 'nearest', inline: 'nearest', behavior: 'smooth' });
        };

        const handleGamepadNavigation = (direction: 'left' | 'right' | 'up' | 'down') => {
            const scope = getActiveScope(sectionRef.current);
            const inOverlay = scope !== sectionRef.current;
            if (inOverlay && !wasInOverlay.current) {
                const focused = sectionRef.current?.querySelector<HTMLElement>(':focus');
                if (focused) lastFocused.current = focused;
            }
            wasInOverlay.current = inOverlay;

            const elements = getElements(scope);
            if (elements.length === 0) return;

            const activeElement = (scope ?? document).querySelector<HTMLElement>(':focus');
            if (!activeElement || !elements.includes(activeElement)) {
                const preferred = elements.find((element) => element.hasAttribute('data-gamepad-initial-focus'));
                focusElement(preferred ?? elements[0]);
                return;
            }

            let closestElement: HTMLElement | null = null;
            const current = activeElement.getBoundingClientRect();
            const currentX = current.left + current.width / 2;
            const currentY = current.top + current.height / 2;
            let closestDistance = Infinity;

            elements.forEach((element) => {
                if (element === activeElement) return;
                const rect = element.getBoundingClientRect();
                const elementX = rect.left + rect.width / 2;
                const elementY = rect.top + rect.height / 2;
                const correctDirection = (direction === 'left' && elementX < currentX)
                    || (direction === 'right' && elementX > currentX)
                    || (direction === 'up' && elementY < currentY)
                    || (direction === 'down' && elementY > currentY);
                if (!correctDirection) return;

                const deltaX = elementX - currentX;
                const deltaY = elementY - currentY;
                const horizontal = direction === 'left' || direction === 'right';
                const primary = horizontal ? Math.abs(deltaX) : Math.abs(deltaY);
                const secondary = horizontal ? Math.abs(deltaY) : Math.abs(deltaX);
                const distance = primary + secondary * 3;
                if (distance < closestDistance) {
                    closestDistance = distance;
                    closestElement = element;
                }
            });

            if (closestElement) focusElement(closestElement);
        };

        const onSelect = () => {
            const scope = getActiveScope(sectionRef.current);
            const elements = getElements(scope);
            const activeElement = (scope ?? document).querySelector<HTMLElement>(':focus');
            if (!activeElement || !elements.includes(activeElement)) {
                if (elements.length > 0) focusElement(elements[0]);
                return;
            }
            activeElement.click();
        };

        gamepad?.on('analog', gamepadHandlerId, handleGamepadNavigation);
        gamepad?.on('buttonA', gamepadHandlerId, onSelect);
        return () => {
            gamepad?.off('analog', gamepadHandlerId);
            gamepad?.off('buttonA', gamepadHandlerId);
        };
    }, [gamepad, gamepadHandlerId, sectionRef]);
};

export default useContentGamepadNavigation;
