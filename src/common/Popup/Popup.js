const React = require('react');
const PropTypes = require('prop-types');
const { Modal } = require('stremio-router');
const styles = require('./styles');

const Popup = ({ open = false, renderLabel, renderMenu, onCloseRequest }) => {
    const labelRef = React.useRef(null);
    const menuRef = React.useRef(null);
    const attachPopupLabels = React.useCallback((event) => {
        event.nativeEvent.popupLabels = [
            ...(event.nativeEvent.popupLabels || []),
            labelRef.current
        ];
    }, []);
    React.useEffect(() => {
        const checkPopupLabels = (event) => {
            if (!Array.isArray(event.popupLabels) || !event.popupLabels.includes(labelRef.current)) {
                onCloseRequest(event);
            }
        };
        if (open) {
            window.addEventListener('mousedown', checkPopupLabels);
            window.addEventListener('scroll', checkPopupLabels);
            window.addEventListener('resize', onCloseRequest);
        }
        return () => {
            window.removeEventListener('mousedown', checkPopupLabels);
            window.removeEventListener('scroll', checkPopupLabels);
            window.removeEventListener('resize', onCloseRequest);
        };
    }, [open, onCloseRequest]);
    React.useEffect(() => {
        if (!open) {
            return;
        }

        const documentRect = document.documentElement.getBoundingClientRect();
        const labelRect = labelRef.current.getBoundingClientRect();
        const menuRect = menuRef.current.getBoundingClientRect();
        const labelPosition = {
            left: labelRect.left - documentRect.left,
            top: labelRect.top - documentRect.top,
            right: (documentRect.width + documentRect.left) - (labelRect.left + labelRect.width),
            bottom: (documentRect.height + documentRect.top) - (labelRect.top + labelRect.height)
        };
        const bottomMenuStyles = {
            top: `${labelPosition.top + labelRect.height}px`,
            maxHeight: `${labelPosition.bottom}px`
        };
        const topMenuStyles = {
            bottom: `${labelPosition.bottom + labelRect.height}px`,
            maxHeight: `${labelPosition.top}px`
        };
        const rightMenuStyles = {
            left: `${labelPosition.left}px`,
            maxWidth: `${labelPosition.right + labelRect.width}px`
        };
        const leftMenuStyles = {
            right: `${labelPosition.right}px`,
            maxWidth: `${labelPosition.left + labelRect.width}px`
        };

        if (menuRect.height <= labelPosition.bottom) {
            menuRef.current.style.top = bottomMenuStyles.top;
            menuRef.current.style.maxHeight = bottomMenuStyles.maxHeight;
        } else if (menuRect.height <= labelPosition.top) {
            menuRef.current.style.bottom = topMenuStyles.bottom;
            menuRef.current.style.maxHeight = topMenuStyles.maxHeight;
        } else if (labelPosition.bottom >= labelPosition.top) {
            menuRef.current.style.top = bottomMenuStyles.top;
            menuRef.current.style.maxHeight = bottomMenuStyles.maxHeight;
        } else {
            menuRef.current.style.bottom = topMenuStyles.bottom;
            menuRef.current.style.maxHeight = topMenuStyles.maxHeight;
        }

        if (menuRect.width <= (labelPosition.right + labelRect.width)) {
            menuRef.current.style.left = rightMenuStyles.left;
            menuRef.current.style.maxWidth = rightMenuStyles.maxWidth;
        } else if (menuRect.width <= (labelPosition.left + labelRect.width)) {
            menuRef.current.style.right = leftMenuStyles.right;
            menuRef.current.style.maxWidth = leftMenuStyles.maxWidth;
        } else if (labelPosition.right > labelPosition.left) {
            menuRef.current.style.left = rightMenuStyles.left;
            menuRef.current.style.maxWidth = rightMenuStyles.maxWidth;
        } else {
            menuRef.current.style.right = leftMenuStyles.right;
            menuRef.current.style.maxWidth = leftMenuStyles.maxWidth;
        }

        menuRef.current.style.visibility = 'visible';
    }, [open]);
    return renderLabel({
        ref: labelRef,
        onMouseDown: attachPopupLabels,
        onScroll: attachPopupLabels,
        children: open ?
            <Modal className={styles['popup-modal-container']}>
                <div ref={menuRef} className={styles['menu-container']}>
                    {renderMenu()}
                </div>
            </Modal>
            :
            null
    });
}

Popup.propTypes = {
    open: PropTypes.bool,
    renderLabel: PropTypes.func.isRequired,
    renderMenu: PropTypes.func.isRequired,
    onCloseRequest: PropTypes.func.isRequired
};

module.exports = Popup;
