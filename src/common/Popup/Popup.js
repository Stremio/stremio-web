const React = require('react');
const PropTypes = require('prop-types');
const classnames = require('classnames');
const { Modal } = require('stremio-router');
const Label = require('./Label');
const Menu = require('./Menu');
const styles = require('./styles');

class Popup extends React.Component {
    constructor(props) {
        super(props);

        this.labelRef = React.createRef();
        this.menuContainerRef = React.createRef();
        this.menuScrollRef = React.createRef();
        this.menuChildrenRef = React.createRef();
        this.popupMutationObserver = this.createPopupMutationObserver();

        this.state = {
            open: false
        };
    }

    componentDidMount() {
        window.addEventListener('blur', this.close);
        window.addEventListener('resize', this.close);
        window.addEventListener('keyup', this.onKeyUp);
    }

    componentWillUnmount() {
        window.removeEventListener('blur', this.close);
        window.removeEventListener('resize', this.close);
        window.removeEventListener('keyup', this.onKeyUp);
        this.popupMutationObserver.disconnect();
    }

    shouldComponentUpdate(nextProps, nextState) {
        return nextState.open !== this.state.open ||
            nextProps.children !== this.props.children;
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.state.open !== prevState.open) {
            this.updateMenuStyles();
            if (this.state.open) {
                this.popupMutationObserver.observe(document.documentElement, {
                    childList: true,
                    attributes: true,
                    characterData: true,
                    subtree: true
                });
                if (typeof this.props.onOpen === 'function') {
                    this.props.onOpen();
                }
            } else {
                this.popupMutationObserver.disconnect();
                if (typeof this.props.onClose === 'function') {
                    this.props.onClose();
                }
            }
        }
    }

    createPopupMutationObserver = () => {
        let prevLabelRect = {};
        let prevMenuChildrenRect = {};
        return new MutationObserver(() => {
            if (this.state.open) {
                const labelRect = this.labelRef.current.getBoundingClientRect();
                const menuChildrenRect = this.menuChildrenRef.current.getBoundingClientRect();
                if (labelRect.x !== prevLabelRect.x ||
                    labelRect.y !== prevLabelRect.y ||
                    labelRect.width !== prevLabelRect.width ||
                    labelRect.height !== prevLabelRect.height ||
                    menuChildrenRect.x !== prevMenuChildrenRect.x ||
                    menuChildrenRect.y !== prevMenuChildrenRect.y ||
                    menuChildrenRect.width !== prevMenuChildrenRect.width ||
                    menuChildrenRect.height !== prevMenuChildrenRect.height) {
                    this.updateMenuStyles();
                }

                prevLabelRect = labelRect;
                prevMenuChildrenRect = menuChildrenRect;
            } else {
                prevLabelRect = {};
                prevMenuChildrenRect = {};
            }
        });
    }

    updateMenuStyles = () => {
        if (!this.state.open) {
            return;
        }

        this.menuContainerRef.current.removeAttribute('style');
        this.menuScrollRef.current.removeAttribute('style');

        const menuDirections = {};
        const documentRect = document.documentElement.getBoundingClientRect();
        const labelRect = this.labelRef.current.getBoundingClientRect();
        const menuChildredRect = this.menuChildrenRef.current.getBoundingClientRect();
        const labelPosition = {
            left: labelRect.x - documentRect.x,
            top: labelRect.y - documentRect.y,
            right: (documentRect.width + documentRect.x) - (labelRect.x + labelRect.width),
            bottom: (documentRect.height + documentRect.y) - (labelRect.y + labelRect.height)
        };

        if (menuChildredRect.height <= labelPosition.bottom) {
            this.menuContainerRef.current.style.top = `${labelPosition.top + labelRect.height}px`;
            this.menuScrollRef.current.style.maxHeight = `${labelPosition.bottom}px`;
            menuDirections.bottom = true;
        } else if (menuChildredRect.height <= labelPosition.top) {
            this.menuContainerRef.current.style.bottom = `${labelPosition.bottom + labelRect.height}px`;
            this.menuScrollRef.current.style.maxHeight = `${labelPosition.top}px`;
            menuDirections.top = true;
        } else if (labelPosition.bottom >= labelPosition.top) {
            this.menuContainerRef.current.style.top = `${labelPosition.top + labelRect.height}px`;
            this.menuScrollRef.current.style.maxHeight = `${labelPosition.bottom}px`;
            menuDirections.bottom = true;
        } else {
            this.menuContainerRef.current.style.bottom = `${labelPosition.bottom + labelRect.height}px`;
            this.menuScrollRef.current.style.maxHeight = `${labelPosition.top}px`;
            menuDirections.top = true;
        }

        if (menuChildredRect.width <= (labelPosition.right + labelRect.width)) {
            this.menuContainerRef.current.style.left = `${labelPosition.left}px`;
            this.menuScrollRef.current.style.maxWidth = `${labelPosition.right + labelRect.width}px`;
            menuDirections.right = true;
        } else if (menuChildredRect.width <= (labelPosition.left + labelRect.width)) {
            this.menuContainerRef.current.style.right = `${labelPosition.right}px`;
            this.menuScrollRef.current.style.maxWidth = `${labelPosition.left + labelRect.width}px`;
            menuDirections.left = true;
        } else if (labelPosition.right > labelPosition.left) {
            this.menuContainerRef.current.style.left = `${labelPosition.left}px`;
            this.menuScrollRef.current.style.maxWidth = `${labelPosition.right + labelRect.width}px`;
            menuDirections.right = true;
        } else {
            this.menuContainerRef.current.style.right = `${labelPosition.right}px`;
            this.menuScrollRef.current.style.maxWidth = `${labelPosition.left + labelRect.width}px`;
            menuDirections.left = true;
        }

        this.menuContainerRef.current.style.visibility = 'visible';
    }

    onKeyUp = (event) => {
        if (this.state.open && event.keyCode === 27) {
            this.close();
        }
    }

    open = () => {
        this.setState({ open: true });
    }

    close = () => {
        this.setState({ open: false });
    }

    menuContainerOnClick = (event) => {
        event.nativeEvent.closePrevented = true;
    }

    modalBackgroundOnClick = (event) => {
        if (!event.nativeEvent.closePrevented) {
            this.close();
        }
    }

    renderLabel(labelElement) {
        return React.cloneElement(labelElement, { ref: this.labelRef, onClick: this.open });
    }

    renderMenu(menuElement) {
        if (!this.state.open) {
            return React.cloneElement(menuElement, {}, null);
        }

        return React.cloneElement(menuElement, {},
            <Modal>
                <div className={classnames(styles['popup-modal-layer'], menuElement.props.className)} onClick={this.modalBackgroundOnClick}>
                    <div ref={this.menuContainerRef} className={styles['menu-container']} onClick={this.menuContainerOnClick}>
                        <div ref={this.menuScrollRef} className={styles['menu-scroll-container']} tabIndex={menuElement.props.tabIndex}>
                            <div ref={this.menuChildrenRef} className={styles['menu-scroll-content']}>
                                {menuElement.props.children}
                            </div>
                        </div>
                    </div>
                </div>
            </Modal>
        );
    }

    render() {
        if (React.Children.count(this.props.children) !== 2) {
            console.warn(new Error('Popup children should be one Popup.Label and one Popup.Menu'));
            return null;
        }

        if (!React.isValidElement(this.props.children[0]) || this.props.children[0].type !== Label) {
            console.warn(new Error('First Popup child should be of type Popup.Label'));
            return null;
        }

        if (!React.isValidElement(this.props.children[1]) || this.props.children[1].type !== Menu) {
            console.warn(new Error('Second Popup child should be of type Popup.Menu'));
            return null;
        }

        return (
            <React.Fragment>
                {this.renderLabel(this.props.children[0])}
                {this.renderMenu(this.props.children[1])}
            </React.Fragment>
        );
    }
}

Popup.Label = Label;
Popup.Menu = Menu;

Popup.propTypes = {
    onOpen: PropTypes.func,
    onClose: PropTypes.func,
    children: PropTypes.oneOfType([
        PropTypes.arrayOf(PropTypes.node),
        PropTypes.node
    ]).isRequired
};

module.exports = Popup;
