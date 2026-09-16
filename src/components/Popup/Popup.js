// Copyright (C) 2017-2023 Smart code 203358507

const React = require('react');
const { createPortal } = require('react-dom');
const PropTypes = require('prop-types');
const classnames = require('classnames');
const FocusLock = require('react-focus-lock').default;
const { default: useRouteFocused } = require('stremio/common/useRouteFocused');
const { getInterfaceRect } = require('stremio/common/interfaceScale');
const styles = require('./styles');

const getAnchorElement = (element) => {
    if (element === document.documentElement) {
        return element;
    }

    const style = window.getComputedStyle(element);
    if (style.overflowY.indexOf('auto') !== -1 || style.overflowY.indexOf('scroll') !== -1) {
        return element;
    }

    return getAnchorElement(element.parentElement);
};

const Popup = ({ open, direction, portal = false, autoFocus = false, menuClassName, renderLabel, renderMenu, dataset, onCloseRequest, ...props }) => {
    const routeFocused = useRouteFocused();
    const labelRef = React.useRef(null);
    const menuRef = React.useRef(null);
    const layerRef = React.useRef(null);
    const [autoDirection, setAutoDirection] = React.useState(null);
    const menuOnMouseDown = React.useCallback((event) => {
        event.nativeEvent.closePopupPrevented = true;
    }, []);
    const portalOnClick = (event) => {
        if (event.target === event.currentTarget && typeof onCloseRequest === 'function') {
            onCloseRequest({ type: 'close', nativeEvent: event.nativeEvent, dataset });
        }
    };
    React.useEffect(() => {
        const onCloseEvent = (event) => {
            if (!event.closePopupPrevented && typeof onCloseRequest === 'function') {
                const closeEvent = {
                    type: 'close',
                    nativeEvent: event,
                    dataset: dataset
                };
                switch (event.type) {
                    case 'keydown':
                        if (event.code === 'Escape') {
                            if (portal) {
                                event.preventDefault();
                                event.stopPropagation();
                            }
                            onCloseRequest(closeEvent);
                        }
                        break;
                    case 'mousedown':
                    case 'pointerdown':
                        if (event.target !== document.documentElement && !labelRef.current.contains(event.target) && !menuRef.current?.contains(event.target)) {
                            onCloseRequest(closeEvent);
                        }
                        break;
                }
            }
        };
        if (routeFocused && open) {
            window.addEventListener('keydown', onCloseEvent, portal);
            window.addEventListener('mousedown', onCloseEvent);
            window.addEventListener('pointerdown', onCloseEvent);
        }
        return () => {
            window.removeEventListener('keydown', onCloseEvent, portal);
            window.removeEventListener('mousedown', onCloseEvent);
            window.removeEventListener('pointerdown', onCloseEvent);
        };
    }, [routeFocused, open, onCloseRequest, dataset, portal]);
    React.useLayoutEffect(() => {
        if (open && !portal) {
            const autoDirection = [];
            const anchor = getAnchorElement(labelRef.current);
            const anchorRect = anchor.getBoundingClientRect();

            const labelRect = labelRef.current.getBoundingClientRect();
            const menuRect = menuRef.current.getBoundingClientRect();
            const labelPosition = {
                left: labelRect.left - anchorRect.left,
                top: labelRect.top - anchorRect.top,
                right: (anchorRect.width + anchorRect.left) - (labelRect.left + labelRect.width),
                bottom: (anchorRect.height + anchorRect.top) - (labelRect.top + labelRect.height)
            };

            if (menuRect.height <= labelPosition.bottom) {
                autoDirection.push('bottom');
            } else if (menuRect.height <= labelPosition.top) {
                autoDirection.push('top');
            } else if (labelPosition.bottom >= labelPosition.top) {
                autoDirection.push('bottom');
            } else {
                autoDirection.push('top');
            }

            if (menuRect.width <= (labelPosition.right + labelRect.width)) {
                autoDirection.push('right');
            } else if (menuRect.width <= (labelPosition.left + labelRect.width)) {
                autoDirection.push('left');
            } else if (labelPosition.right > labelPosition.left) {
                autoDirection.push('right');
            } else {
                autoDirection.push('left');
            }

            setAutoDirection(autoDirection.join('-'));
        } else {
            setAutoDirection(null);
        }
    }, [open, portal]);
    React.useLayoutEffect(() => {
        if (!open || !portal) return;

        const label = labelRef.current;
        const menu = menuRef.current;
        const layer = layerRef.current;
        const positionMenu = () => {
            const bounds = getInterfaceRect(layer);
            const padding = window.getComputedStyle(layer);
            const top = bounds.top + parseFloat(padding.paddingTop);
            const bottom = bounds.bottom - parseFloat(padding.paddingBottom);
            const left = bounds.left + parseFloat(padding.paddingLeft);
            const right = bounds.right - parseFloat(padding.paddingRight);
            const anchor = getInterfaceRect(label);
            menu.style.maxWidth = `${right - left}px`;
            const width = getInterfaceRect(menu).width;
            const height = menu.scrollHeight;
            const below = Math.max(0, bottom - anchor.bottom - 4);
            const above = Math.max(0, anchor.top - top - 4);
            const opensBelow = height <= below || (height > above && below >= above);
            const available = opensBelow ? below : above;
            const menuTop = opensBelow ? anchor.bottom + 4 : anchor.top - 4 - Math.min(height, available);
            const menuLeft = anchor.left + width <= right ? anchor.left : anchor.right - width;
            menu.style.maxHeight = `${available}px`;
            menu.style.top = `${Math.max(top, menuTop) - bounds.top}px`;
            menu.style.left = `${Math.max(left, Math.min(menuLeft, right - width)) - bounds.left}px`;
            menu.style.visibility = 'visible';
        };
        const onScroll = (event) => {
            if (!menu.contains(event.target)) positionMenu();
        };
        const observer = new ResizeObserver(positionMenu);
        observer.observe(label);
        observer.observe(menu);
        observer.observe(layer);
        window.addEventListener('resize', positionMenu);
        window.addEventListener('scroll', onScroll, true);
        positionMenu();
        return () => {
            observer.disconnect();
            window.removeEventListener('resize', positionMenu);
            window.removeEventListener('scroll', onScroll, true);
        };
    }, [open, portal]);
    const menu = open ? <FocusLock
        ref={menuRef}
        className={classnames(styles['menu-container'], menuClassName, portal ? styles['portal-menu'] : styles[`menu-direction-${direction || autoDirection}`])}
        autoFocus={autoFocus}
        returnFocus={portal ? { preventScroll: true } : false}
        lockProps={{ onMouseDown: menuOnMouseDown }}
    >
        {renderMenu()}
    </FocusLock> : null;
    const label = renderLabel({
        ...props,
        ref: labelRef,
        className: classnames(styles['label-container'], props.className, { 'active': open }),
        children: portal ? null : menu
    });
    return <>
        {label}
        {portal && open && createPortal(<div ref={layerRef} className={styles['portal-layer']} onMouseDown={menuOnMouseDown} onPointerDown={menuOnMouseDown} onClick={portalOnClick}>
            {menu}
        </div>, labelRef.current?.closest('.modal-container, .route-container') ?? document.body)}
    </>;
};

Popup.propTypes = {
    className: PropTypes.string,
    open: PropTypes.bool,
    direction: PropTypes.oneOf(['top-left', 'bottom-left', 'top-right', 'bottom-right']),
    portal: PropTypes.bool,
    autoFocus: PropTypes.bool,
    menuClassName: PropTypes.string,
    renderLabel: PropTypes.func.isRequired,
    renderMenu: PropTypes.func.isRequired,
    dataset: PropTypes.object,
    onCloseRequest: PropTypes.func
};

module.exports = Popup;
