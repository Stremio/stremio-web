const React = require('react');
const classnames = require('classnames');
const PropTypes = require('prop-types');
const Popup = require('stremio/common/Popup');
const Button = require('stremio/common/Button');
const ColorPicker = require('stremio/common/ColorPicker');
const useBinaryState = require('stremio/common/useBinaryState');
const Icon = require('stremio-icons/dom/Icon');
const styles = require('./styles');

const ColorInput = ({ className, defaultValue, onChange }) => {
    const [menuOpen, openMenu, closeMenu, toggleMenu] = useBinaryState(false);
    const [color, setColor] = React.useState(defaultValue);
    const [selectedColor, setSelectedColor] = React.useState(defaultValue);
    const updateColorsAndCloseMenu = React.useCallback(() => {
        setSelectedColor(color);
        onChange(color);
        closeMenu();
    }, [color, onChange]);
    return (
        <Popup
            open={menuOpen}
            menuMatchLabelWidth={false}
            onCloseRequest={closeMenu}
            // onCloseRequest={(event) => event.type === 'scroll' || closeMenu()}
            renderLabel={(ref) => (
                <Button className={className} ref={ref} title={selectedColor} onClick={toggleMenu} style={{ backgroundColor: selectedColor }}></Button>
            )}
            renderMenu={() => (
                <div className={classnames(styles['color-input-container'])}>
                    <Button onClick={closeMenu}>
                        <Icon className={classnames(styles['x-icon'])} icon={'ic_x'} />
                    </Button>
                    <h1>Choose a color:</h1>
                    <ColorPicker className={classnames(styles['color-input'])} value={color} onChange={setColor} />
                    <Button className={classnames(styles['button'])} onClick={updateColorsAndCloseMenu}>Select</Button>
                </div>
            )}
        />
    );
};


ColorInput.propTypes = {
    className: PropTypes.string,
    defaultValue: PropTypes.string,
    onChange: PropTypes.func
};

module.exports = ColorInput;