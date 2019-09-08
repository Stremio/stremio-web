const React = require('react');
const PropTypes = require('prop-types');
const { Modal } = require('stremio-router');
const styles = require('./styles');

const Popup = ({ open, menuMatchLabelWidth, renderLabel, renderMenu, onCloseRequest }) => {
    const labelRef = React.useRef(null);
    const menuRef = React.useRef(null);
    const [menuStyles, setMenuStyles] = React.useState({});
    React.useEffect(() => {
        const checkCloseEvent = (event) => {
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
                case 'scroll':
                    if (event.target !== document &&
                        event.target !== document.documentElement &&
                        !labelRef.current.contains(event.target) &&
                        !menuRef.current.contains(event.target)) {
                        onCloseRequest(event);
                    }
                    break;
            }
        };
        if (open) {
            window.addEventListener('scroll', checkCloseEvent, true);
            window.addEventListener('mousedown', checkCloseEvent);
            window.addEventListener('keydown', checkCloseEvent);
            window.addEventListener('resize', checkCloseEvent);
        }
        return () => {
            window.removeEventListener('scroll', checkCloseEvent, true);
            window.removeEventListener('mousedown', checkCloseEvent);
            window.removeEventListener('keydown', checkCloseEvent);
            window.removeEventListener('resize', checkCloseEvent);
        };
    }, [open, onCloseRequest]);
    React.useEffect(() => {
        let menuStyles = {};
        if (open) {
            const documentRect = document.documentElement.getBoundingClientRect();
            const labelRect = labelRef.current.getBoundingClientRect();
            const menuRect = menuRef.current.getBoundingClientRect();
            const labelPosition = {
                left: labelRect.left - documentRect.left,
                top: labelRect.top - documentRect.top,
                right: (documentRect.width + documentRect.left) - (labelRect.left + labelRect.width),
                bottom: (documentRect.height + documentRect.top) - (labelRect.top + labelRect.height)
            };
            const matchLabelWidthMenuStyles = {
                width: `${labelRect.width}px`,
                maxWidth: `${labelRect.width}px`
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
                menuStyles = { ...menuStyles, ...bottomMenuStyles };
            } else if (menuRect.height <= labelPosition.top) {
                menuStyles = { ...menuStyles, ...topMenuStyles };
            } else if (labelPosition.bottom >= labelPosition.top) {
                menuStyles = { ...menuStyles, ...bottomMenuStyles };
            } else {
                menuStyles = { ...menuStyles, ...topMenuStyles };
            }

            if (menuRect.width <= (labelPosition.right + labelRect.width)) {
                menuStyles = { ...menuStyles, ...rightMenuStyles };
            } else if (menuRect.width <= (labelPosition.left + labelRect.width)) {
                menuStyles = { ...menuStyles, ...leftMenuStyles };
            } else if (labelPosition.right > labelPosition.left) {
                menuStyles = { ...menuStyles, ...rightMenuStyles };
            } else {
                menuStyles = { ...menuStyles, ...leftMenuStyles };
            }

            if (menuMatchLabelWidth) {
                menuStyles = { ...menuStyles, ...matchLabelWidthMenuStyles };
            }

            menuStyles = { ...menuStyles, visibility: 'visible' };
        }

        setMenuStyles(menuStyles);
    }, [open]);
    return (
        <React.Fragment>
            {renderLabel(labelRef)}
            {
                open ?
                    <Modal className={styles['popup-modal-container']}>
                        <div ref={menuRef} style={menuStyles} className={styles['menu-container']}>
                            {renderMenu()}
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
    menuMatchLabelWidth: PropTypes.bool,
    renderLabel: PropTypes.func.isRequired,
    renderMenu: PropTypes.func.isRequired,
    onCloseRequest: PropTypes.func.isRequired
};

module.exports = Popup;
