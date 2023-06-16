// Copyright (C) 2017-2023 Smart code 203358507

const React = require('react');
const PropTypes = require('prop-types');
const classnames = require('classnames');
const { useRouteFocused } = require('stremio-router');
const Popup = require('stremio/common/Popup');
const useBinaryState = require('stremio/common/useBinaryState');
const NavMenuContent = require('./NavMenuContent');

const NavMenu = (props) => {
    const routeFocused = useRouteFocused();
    const [menuOpen, , closeMenu, toggleMenu] = useBinaryState(false);
    const popupLabelOnClick = React.useCallback((event) => {
        if (!event.nativeEvent.togglePopupPrevented) {
            toggleMenu();
        }
    }, [toggleMenu]);
    const popupMenuOnClick = React.useCallback((event) => {
        event.nativeEvent.togglePopupPrevented = true;
    }, []);
    const renderLabel = React.useMemo(() => ({ ref, className, children }) => (
        props.renderLabel({
            ref,
            className: classnames(className, { 'active': menuOpen }),
            onClick: popupLabelOnClick,
            children,
        })
    ), [menuOpen, popupLabelOnClick, props.renderLabel]);
    const renderMenu = React.useCallback(() => (
        <NavMenuContent onClick={popupMenuOnClick} />
    ), []);
    React.useEffect(() => {
        if (!routeFocused) {
            closeMenu();
        }
    }, [routeFocused]);
    return (
        <Popup
            open={menuOpen}
            direction={'bottom-left'}
            onCloseRequest={closeMenu}
            renderLabel={renderLabel}
            renderMenu={renderMenu}
        />
    );
};

NavMenu.propTypes = {
    renderLabel: PropTypes.func
};

module.exports = NavMenu;
