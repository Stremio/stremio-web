import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Icon from 'stremio-icons/dom';
import colors from 'stremio-colors';
import styles from './styles';

class PopupMenu extends Component {
    constructor(props) {
        super(props);

        this._rootRef = React.createRef();

        this.state = {
            isOpen: false
        };
    }

    shouldComponentUpdate(nextProps, nextState) {
        return nextState.isOpen !== this.state.isOpen;
    }

    componentDidMount() {
        window.addEventListener('blur', this._close);
        window.addEventListener('resize', this._close);
    }

    componentWillUnmount() {
        window.removeEventListener('blur', this._close);
        window.removeEventListener('resize', this._close);
    }

    _open = (event) => {
        event.stopPropagation();
        this.setState({ isOpen: true });
    }

    _close = (event) => {
        event.stopPropagation();
        this.setState({ isOpen: false });
    }

    renderMenu() {
        if (this.state.isOpen && this._rootRef.current) {
            const rootRect = this._rootRef.current.getBoundingClientRect();
            const menuStyles = {
                position: 'absolute',
                backgroundColor: 'blue',
                left: rootRect.x
            };

            if (rootRect.y + rootRect.height + this.props.menuHeight <= window.innerHeight) {
                menuStyles.top = rootRect.y + rootRect.height;
                menuStyles.height = this.props.menuHeight;
            } else if (this.props.menuHeight < rootRect.y) {
                menuStyles.bottom = window.innerHeight - rootRect.y;
                menuStyles.height = this.props.menuHeight;
            } else {
                menuStyles.bottom = 0;
                menuStyles.top = 0;
            }

            if (typeof this.props.menuWidth === 'number') {
                menuStyles.width = this.props.menuWidth;
            } else {
                menuStyles.width = rootRect.width;
            }

            return (
                <div className={styles['menu-layer']} onClick={this._close}>
                    <div style={menuStyles}>

                    </div>
                </div>
            );
        }

        return null;
    }

    render() {
        return (
            <div ref={this._rootRef} onClick={this._open}>
                <div className={styles['button-container']}>
                    <span className={styles['button-label']}>Click me!</span>
                    <Icon
                        icon={'ic_arrow_down'}
                        className={styles['button-icon']}
                        fill={colors.white80}
                    />
                </div>
                {this.renderMenu()}
            </div>
        );
    }
}

PopupMenu.propTypes = {
    menuHeight: PropTypes.number.isRequired,
    menuWidth: PropTypes.number
};

export default PopupMenu;
