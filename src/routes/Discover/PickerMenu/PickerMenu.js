const React = require('react');
const PropTypes = require('prop-types');
const classnames = require('classnames');
const Icon = require('stremio-icons/dom');
const { Button, Popup, useBinaryState } = require('stremio/common');
require('./styles');

const PickerMenu = ({ className, name = '', value = '', options = [], onSelect }) => {
    const [menuOpen, openMenu, closeMenu, toggleMenu] = useBinaryState(false);
    const optionOnClick = React.useCallback((event) => {
        if (typeof onSelect === 'function') {
            onSelect(event);
        }

        if (!event.nativeEvent.closeMenuPrevented) {
            closeMenu();
        }
    }, [onSelect]);
    return (
        <Popup
            open={menuOpen}
            menuMatchLabelWidth={true}
            onCloseRequest={closeMenu}
            renderLabel={(ref) => (
                <Button ref={ref} className={classnames(className, 'picker-label-container', { 'active': menuOpen })} title={name} onClick={toggleMenu}>
                    <div className={'label'}>{typeof value === 'string' && value.length > 0 ? value : name}</div>
                    <Icon className={'icon'} icon={'ic_arrow_down'} />
                </Button>
            )}
            renderMenu={() => (
                <div className={'discover-picker-menu-container'}>
                    {
                        Array.isArray(options) ?
                            options.map(({ label, value }) => (
                                <Button key={value} className={'picker-option-container'} title={label} data-name={name} data-value={value} onClick={optionOnClick}>
                                    <div className={'picker-option-label'}>{label}</div>
                                </Button>
                            ))
                            :
                            null
                    }
                </div>
            )}
        />
    );
};

PickerMenu.propTypes = {
    className: PropTypes.string,
    name: PropTypes.string,
    value: PropTypes.string,
    options: PropTypes.arrayOf(PropTypes.shape({
        label: PropTypes.string,
        value: PropTypes.string
    })),
    onSelect: PropTypes.func
};

module.exports = PickerMenu;
