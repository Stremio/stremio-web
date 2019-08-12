const React = require('react');
const PropTypes = require('prop-types');
const { Modal } = require('stremio-router');
const styles = require('./styles');

const Popup = ({ open = false, renderLabel, renderMenu, onCloseRequest }) => {
    const labelContainerRef = React.useRef(null);
    const menuContainerRef = React.useRef(null);
    const menuContentContainerRef = React.useRef(null);
    const attachPopupLabels = React.useCallback((event) => {
        event.nativeEvent.popupLabels = [
            ...(event.nativeEvent.popupLabels || []),
            labelContainerRef.current
        ];
    }, []);
    React.useEffect(() => {
        const checkPopupLabels = (event) => {
            if (!Array.isArray(event.popupLabels) || !event.popupLabels.includes(labelContainerRef.current)) {
                onCloseRequest(event);
            }
        };
        if (open) {
            window.addEventListener('click', checkPopupLabels);
            window.addEventListener('scroll', checkPopupLabels);
            window.addEventListener('resize', onCloseRequest);
        }
        return () => {
            window.removeEventListener('click', checkPopupLabels);
            window.removeEventListener('scroll', checkPopupLabels);
            window.removeEventListener('resize', onCloseRequest);
        };
    }, [open, onCloseRequest]);
    React.useEffect(() => {
        if (!open) {
            return;
        }

        const documentRect = document.documentElement.getBoundingClientRect();
        const labelRect = labelContainerRef.current.getBoundingClientRect();
        const menuContentRect = menuContentContainerRef.current.getBoundingClientRect();
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

        if (menuContentRect.height <= labelPosition.bottom) {
            menuContainerRef.current.style.top = bottomMenuStyles.top;
            menuContainerRef.current.style.maxHeight = bottomMenuStyles.maxHeight;
        } else if (menuContentRect.height <= labelPosition.top) {
            menuContainerRef.current.style.bottom = topMenuStyles.bottom;
            menuContainerRef.current.style.maxHeight = topMenuStyles.maxHeight;
        } else if (labelPosition.bottom >= labelPosition.top) {
            menuContainerRef.current.style.top = bottomMenuStyles.top;
            menuContainerRef.current.style.maxHeight = bottomMenuStyles.maxHeight;
        } else {
            menuContainerRef.current.style.bottom = topMenuStyles.bottom;
            menuContainerRef.current.style.maxHeight = topMenuStyles.maxHeight;
        }

        if (menuContentRect.width <= (labelPosition.right + labelRect.width)) {
            menuContainerRef.current.style.left = rightMenuStyles.left;
            menuContainerRef.current.style.maxWidth = rightMenuStyles.maxWidth;
        } else if (menuContentRect.width <= (labelPosition.left + labelRect.width)) {
            menuContainerRef.current.style.right = leftMenuStyles.right;
            menuContainerRef.current.style.maxWidth = leftMenuStyles.maxWidth;
        } else if (labelPosition.right > labelPosition.left) {
            menuContainerRef.current.style.left = rightMenuStyles.left;
            menuContainerRef.current.style.maxWidth = rightMenuStyles.maxWidth;
        } else {
            menuContainerRef.current.style.right = leftMenuStyles.right;
            menuContainerRef.current.style.maxWidth = leftMenuStyles.maxWidth;
        }

        menuContainerRef.current.style.visibility = 'visible';
    }, [open]);
    return (
        <React.Fragment>
            {renderLabel({
                ref: labelContainerRef,
                onClick: attachPopupLabels
            })}
            {
                open ?
                    <Modal className={styles['popup-modal-container']}>
                        <div ref={menuContainerRef} className={styles['menu-container']} onScroll={attachPopupLabels} onClick={attachPopupLabels}>
                            {renderMenu({
                                ref: menuContentContainerRef,
                                className: styles['menu-content-container']
                            })}
                        </div>
                    </Modal>
                    :
                    null
            }
        </React.Fragment>
    );
}

Popup.propTypes = {
    open: PropTypes.bool,
    renderLabel: PropTypes.func.isRequired,
    renderMenu: PropTypes.func.isRequired,
    onCloseRequest: PropTypes.func.isRequired
};

module.exports = Popup;
