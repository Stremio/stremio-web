const React = require('react');
const PropTypes = require('prop-types');
const classnames = require('classnames');
const Icon = require('stremio-icons/dom');
const Button = require('stremio/common/Button');
const Popup = require('stremio/common/Popup');
const useBinaryState = require('stremio/common/useBinaryState');
const styles = require('./styles');

// TODO rename to multiselect
const Dropdown = ({ className, menuClassName, menuMatchLabelWidth, name, selected, options, onSelect }) => {
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
            menuMatchLabelWidth={typeof menuMatchLabelWidth === 'boolean' ? menuMatchLabelWidth : true}
            onCloseRequest={closeMenu}
            renderLabel={(ref) => (
                <Button ref={ref} className={classnames(className, styles['dropdown-label-container'], { 'active': menuOpen })} title={name} onClick={toggleMenu}>
                    <div className={styles['label']}>
                        {
                            Array.isArray(selected) && selected.length > 0 ?
                                options.reduce((labels, { label, value }) => {
                                    if (selected.includes(value)) {
                                        labels.push(label);
                                    }

                                    return labels;
                                }, []).join(', ')
                                :
                                name
                        }
                    </div>
                    <Icon className={styles['icon']} icon={'ic_arrow_down'} />
                </Button>
            )}
            renderMenu={() => (
                <div className={classnames(menuClassName, styles['dropdown-menu-container'])}>
                    {
                        Array.isArray(options) && options.length > 0 ?
                            options.map(({ label, value }) => (
                                <Button key={value} className={classnames(styles['dropdown-option-container'], { 'selected': Array.isArray(selected) && selected.includes(value) })} title={label} data-name={name} data-value={value} onClick={optionOnClick}>
                                    <div className={styles['label']}>{label}</div>
                                    <Icon className={styles['icon']} icon={'ic_check'} />
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

Dropdown.propTypes = {
    className: PropTypes.string,
    menuClassName: PropTypes.string,
    menuMatchLabelWidth: PropTypes.bool,
    name: PropTypes.string,
    selected: PropTypes.arrayOf(PropTypes.string),
    options: PropTypes.arrayOf(PropTypes.shape({
        label: PropTypes.string.isRequired,
        value: PropTypes.string.isRequired
    })),
    onSelect: PropTypes.func
};

module.exports = Dropdown;
