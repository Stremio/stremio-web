const React = require('react');
const PropTypes = require('prop-types');
const classnames = require('classnames');
const FocusLock = require('react-focus-lock').default;
const styles = require('./styles');

const Popup = ({ open, direction, renderLabel, renderMenu, onCloseRequest }) => {
    const labelRef = React.useRef(null);
    const [autoDirection, setAutoDirection] = React.useState(null);
    const menuOnMouseDown = React.useCallback((event) => {
        event.nativeEvent.closePopupPrevented = true;
    }, []);
    React.useEffect(() => {
        const checkCloseEvent = (event) => {
            if (typeof onCloseRequest === 'function') {
                switch (event.type) {
                    case 'resize':
                        onCloseRequest(event);
                        break;
                    case 'keydown':
                        if (event.key === 'Escape') {
                            onCloseRequest(event);
                        }
                        break;
                    case 'mousedown':
                        if (event.target !== document.documentElement &&
                            !labelRef.current.contains(event.target) &&
                            !event.closePopupPrevented) {
                            onCloseRequest(event);
                        }
                        break;
                }
            }
        };
        if (open) {
            window.addEventListener('resize', checkCloseEvent);
            window.addEventListener('keydown', checkCloseEvent);
            window.addEventListener('mousedown', checkCloseEvent);
        }
        return () => {
            window.removeEventListener('resize', checkCloseEvent);
            window.removeEventListener('keydown', checkCloseEvent);
            window.removeEventListener('mousedown', checkCloseEvent);
        };
    }, [open, onCloseRequest]);
    React.useLayoutEffect(() => {
        if (open) {
            const documentRect = document.documentElement.getBoundingClientRect();
            const labelRect = labelRef.current.getBoundingClientRect();
            const labelOffsetTop = labelRect.top - documentRect.top;
            const labelOffsetBottom = (documentRect.height + documentRect.top) - (labelRect.top + labelRect.height);
            const autoDirection = labelOffsetBottom >= labelOffsetTop ? 'bottom' : 'top';
            setAutoDirection(autoDirection);
        } else {
            setAutoDirection(null);
        }
    }, [open]);
    return renderLabel({
        ref: labelRef,
        className: styles['label-container'],
        children: open ?
            <FocusLock className={classnames(styles['menu-container'], styles[`menu-direction-${typeof direction === 'string' ? direction : autoDirection}`])} autoFocus={false} lockProps={{ onMouseDown: menuOnMouseDown }}>
                {renderMenu()}
            </FocusLock>
            :
            null
    });
}

Popup.propTypes = {
    open: PropTypes.bool,
    direction: PropTypes.oneOf(['top', 'bottom']),
    renderLabel: PropTypes.func.isRequired,
    renderMenu: PropTypes.func.isRequired,
    onCloseRequest: PropTypes.func
};

module.exports = Popup;
