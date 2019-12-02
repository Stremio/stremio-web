const React = require('react');
const PropTypes = require('prop-types');
const classnames = require('classnames');
const FocusLock = require('react-focus-lock').default;
const styles = require('./styles');

const Popup = ({ open, direction, renderLabel, renderMenu, dataset, onCloseRequest, ...props }) => {
    const labelRef = React.useRef(null);
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
        ...props,
        ref: labelRef,
        className: styles['label-container'],
        children: open ?
            <FocusLock className={classnames(styles['menu-container'], styles[`menu-direction-${['top', 'bottom'].includes(direction) ? direction : autoDirection}`])} autoFocus={false} lockProps={{ onMouseDown: menuOnMouseDown }}>
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
    dataset: PropTypes.objectOf(String),
    onCloseRequest: PropTypes.func
};

module.exports = Popup;
