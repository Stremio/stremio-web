// Copyright (C) 2017-2026 Smart code 203358507

import React, { useCallback, useEffect, useMemo } from 'react';
import useBinaryState from 'stremio/common/useBinaryState';
import useRouteFocused from 'stremio/common/useRouteFocused';

type FlaggedEvent = Event & {
    togglePopupPrevented?: boolean,
    buttonClickPrevented?: boolean,
};

type LabelEvent = React.SyntheticEvent & {
    nativeEvent: FlaggedEvent & {
        ctrlKey?: boolean,
        shiftKey?: boolean,
        button?: number,
        pointerType?: string,
    },
};

const useRowMenu = () => {
    const routeFocused = useRouteFocused();
    const [open, openMenu, closeMenu, toggleMenu] = useBinaryState(false);

    const onMouseUp = useCallback((event: LabelEvent) => {
        if (!event.nativeEvent.togglePopupPrevented && (event.nativeEvent.ctrlKey || event.nativeEvent.button === 2)) {
            event.preventDefault();
            openMenu();
        }
    }, [openMenu]);

    const onContextMenu = useCallback((event: LabelEvent) => {
        if (!event.nativeEvent.togglePopupPrevented && !event.nativeEvent.ctrlKey && !event.nativeEvent.shiftKey) {
            event.preventDefault();
        }
    }, []);

    const onLongPress = useCallback((event: LabelEvent) => {
        if (event.nativeEvent.pointerType !== 'mouse' && !event.nativeEvent.togglePopupPrevented) {
            toggleMenu();
        }
    }, [toggleMenu]);

    const menuProps = useMemo(() => {
        const preventToggle = (event: LabelEvent) => {
            event.nativeEvent.togglePopupPrevented = true;
        };

        return {
            onPointerDown: preventToggle,
            onClick: preventToggle,
            onContextMenu: (event: LabelEvent) => {
                preventToggle(event);
                if (!event.nativeEvent.ctrlKey && !event.nativeEvent.shiftKey) {
                    event.preventDefault();
                }
            },
            onKeyDown: (event: LabelEvent) => {
                event.nativeEvent.buttonClickPrevented = true;
            },
        };
    }, []);

    const labelProps = useMemo(() => ({ onMouseUp, onContextMenu, onLongPress }), [onMouseUp, onContextMenu, onLongPress]);

    useEffect(() => {
        if (!routeFocused) {
            closeMenu();
        }
    }, [routeFocused, closeMenu]);

    return { open, closeMenu, labelProps, menuProps };
};

export default useRowMenu;
