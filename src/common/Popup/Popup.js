const React = require('react');
const PropTypes = require('prop-types');
const classnames = require('classnames');
const FocusLock = require('react-focus-lock').default;
const styles = require('./styles');

const Popup = ({ open, direction, renderLabel, renderMenu, dataset, onCloseRequest, ...props }) => {
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
                    case 'resize':
                        onCloseRequest(closeEvent);
                        break;
                    case 'keydown':
                        if (event.key === 'Escape') {
                            onCloseRequest(closeEvent);
                        }
                        break;
                    case 'mousedown':
                        if (event.target !== document.documentElement && !labelRef.current.contains(event.target)) {
                            onCloseRequest(closeEvent);
                        }
                        break;
                }
            }
        };
        if (open) {
            window.addEventListener('resize', onCloseEvent);
            window.addEventListener('keydown', onCloseEvent);
            window.addEventListener('mousedown', onCloseEvent);
        }
        return () => {
            window.removeEventListener('resize', onCloseEvent);
            window.removeEventListener('keydown', onCloseEvent);
            window.removeEventListener('mousedown', onCloseEvent);
        };
    }, [open, onCloseRequest, dataset]);
    React.useLayoutEffect(() => {
        if (open) {
            const autoDirection = [];
            const documentRect = document.documentElement.getBoundingClientRect();
            const labelRect = labelRef.current.getBoundingClientRect();
            const menuRect = menuRef.current.getBoundingClientRect();
            const labelPosition = {
                left: labelRect.left - documentRect.left,
                top: labelRect.top - documentRect.top,
                right: (documentRect.width + documentRect.left) - (labelRect.left + labelRect.width),
                bottom: (documentRect.height + documentRect.top) - (labelRect.top + labelRect.height)
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
        className: styles['label-container'],
        children: open ?
            <FocusLock ref={menuRef} className={classnames(styles['menu-container'], styles[`menu-direction-${autoDirection}`], styles[`menu-direction-${direction}`])} autoFocus={false} lockProps={{ onMouseDown: menuOnMouseDown }}>
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
    dataset: PropTypes.objectOf(PropTypes.string),
    onCloseRequest: PropTypes.func
};

module.exports = Popup;
