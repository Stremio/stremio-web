const React = require('react');
const classnames = require('classnames');
const PropTypes = require('prop-types');
const Popup = require('stremio/common/Popup');
const Button = require('stremio/common/Button');
const ColorPicker = require('stremio/common/ColorPicker');
const useBinaryState = require('stremio/common/useBinaryState');
const Icon = require('stremio-icons/dom/Icon');
const styles = require('./styles');

const ColorInput = React.forwardRef((props, ref) => {
    const [menuOpen, openMenu, closeMenu, toggleMenu] = useBinaryState(false);
    const [color, setColor] = React.useState(props.defaultValue);
    const [chosenColor, setChosenColor] = React.useState(props.defaultValue);
    const updateColorsAndCloseMenu = () => { setChosenColor(color); props.onChange(color); closeMenu(); };
    return (
        <Popup
            open={menuOpen}
            menuMatchLabelWidth={false}
            onCloseRequest={closeMenu}
            // onCloseRequest={(event) => event.type === 'scroll' || closeMenu()}
            renderLabel={(ref) => (
                <Button ref={ref} title={name} onClick={toggleMenu} style={{ backgroundColor: chosenColor }} className={props.className}></Button>
            )}
            renderMenu={() => (
                <div className={classnames(styles['color-input-container'] )}>
                    <Button onClick={closeMenu}>
                        <Icon className={classnames(styles['x-icon'])} icon={'ic_x'} />
                    </Button>
                    <h1>Choose a color:</h1>
                    <ColorPicker value={color} onChange={setColor}  className={classnames(styles['color-input'])}/>
                    <Button  className={classnames(styles['button'])} onClick={updateColorsAndCloseMenu}>Select</Button>
                </div>
            )}
        />
    );
});


ColorInput.displayName = 'ColorInput';

ColorInput.propTypes = {
    className: PropTypes.string,
    defaultValue: PropTypes.string,
    onChange: PropTypes.func
};

module.exports = ColorInput;