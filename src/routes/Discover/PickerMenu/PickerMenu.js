const React = require('react');
const PropTypes = require('prop-types');
const classnames = require('classnames');
const Icon = require('stremio-icons/dom');
const { Button, Popup, useBinaryState } = require('stremio/common');
const styles = require('./styles');

const PickerMenu = ({ className, name, value, options, onSelect }) => {
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
                <Button ref={ref} className={classnames(className, styles['picker-label-container'], { 'active': menuOpen })} title={name} onClick={toggleMenu}>
                    <div className={styles['picker-label']}>{typeof value === 'string' && value.length > 0 ? value : name}</div>
                    <Icon className={styles['icon']} icon={'ic_arrow_down'} />
                </Button>
            )}
            renderMenu={() => (
                <div className={styles['picker-menu-container']}>
                    {
                        Array.isArray(options) && options.length > 0 ?
                            options.map(({ label, value }) => (
                                <Button key={value} className={styles['picker-option-container']} title={typeof label === 'string' && label.length > 0 ? label : value} data-name={name} data-value={value} onClick={optionOnClick}>
                                    <div className={styles['picker-option-label']}>{typeof label === 'string' && label.length > 0 ? label : value}</div>
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
        value: PropTypes.string.isRequired
    })),
    onSelect: PropTypes.func
};

module.exports = PickerMenu;
