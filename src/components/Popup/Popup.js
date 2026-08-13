// Copyright (C) 2017-2023 Smart code 203358507

const React = require('react');
const PropTypes = require('prop-types');
const classnames = require('classnames');
const FocusLock = require('react-focus-lock').default;
const { default: useRouteFocused } = require('stremio/common/useRouteFocused');
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

const Popup = ({ open, direction, renderLabel, renderMenu, dataset, onCloseRequest, ...props }) => {
    const routeFocused = useRouteFocused();
    const labelRef = React.useRef(null);
    const menuRef = React.useRef(null);
    const [autoDirection, setAutoDirection] = React.useState(null);
    const menuOnMouseDown = React.useCallback((event) => {
        event.nativeEvent.closePopupPrevented = true;
    }, []);
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
                            onCloseRequest(closeEvent);
                        }
                        break;
                    case 'mousedown':
                        if (event.target !== document.documentElement && !labelRef.current.contains(event.target)) {
                            onCloseRequest(closeEvent);
                        }
                        break;
                    case 'pointerdown':
                        if (event.target !== document.documentElement && !labelRef.current.contains(event.target)) {
                            onCloseRequest(closeEvent);
                        }
                        break;
                }
            }
        };
        if (routeFocused && open) {
            window.addEventListener('keydown', onCloseEvent);
            window.addEventListener('mousedown', onCloseEvent);
            window.addEventListener('pointerdown', onCloseEvent);
        }
        return () => {
            window.removeEventListener('keydown', onCloseEvent);
            window.removeEventListener('mousedown', onCloseEvent);
            window.removeEventListener('pointerdown', onCloseEvent);
        };
    }, [routeFocused, open, onCloseRequest, dataset]);
    React.useLayoutEffect(() => {
        if (open) {
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
    }, [open]);
    return renderLabel({
        ...props,
        ref: labelRef,
        className: classnames(styles['label-container'], props.className, { 'active': open }),
        children: open ?
            <FocusLock ref={menuRef} className={classnames(styles['menu-container'], { [styles[`menu-direction-${autoDirection}`]]: !direction }, { [styles[`menu-direction-${direction}`]]: direction })} autoFocus={false} lockProps={{ onMouseDown: menuOnMouseDown }}>
                {renderMenu()}
            </FocusLock>
            :
            null
    });
};

Popup.propTypes = {
    open: PropTypes.bool,
    direction: PropTypes.oneOf(['top-left', 'bottom-left', 'top-right', 'bottom-right']),
    renderLabel: PropTypes.func.isRequired,
    renderMenu: PropTypes.func.isRequired,
    dataset: PropTypes.object,
    onCloseRequest: PropTypes.func
};

module.exports = Popup;
