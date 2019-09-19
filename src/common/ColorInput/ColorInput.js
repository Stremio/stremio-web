const React = require('react');
const classnames = require('classnames');
const PropTypes = require('prop-types');
const Popup = require('stremio/common/Popup');
const Button = require('stremio/common/Button');
const ColorPicker = require('stremio/common/ColorPicker');
const useBinaryState = require('stremio/common/useBinaryState');
const styles = require('./styles');

const ColorInput = React.forwardRef((props, ref) => {
    const [menuOpen, openMenu, closeMenu, toggleMenu] = useBinaryState(false);
    const [color, setColor] = React.useState(props.defaultValue);
    const [chosenColor, setChosenColor] = React.useState(props.defaultValue);
    const updateolorsAndCloseMenu = () => { setChosenColor(color); props.onChange(color); closeMenu(); };
    return (
        <Popup
            open={menuOpen}
            menuMatchLabelWidth={false}
            onCloseRequest={closeMenu}
            renderLabel={(ref) => (
                <Button ref={ref} title={name} onClick={toggleMenu} style={{ backgroundColor: chosenColor }} className={props.className}></Button>
            )}
            renderMenu={() => (
                <div className={classnames(styles['color-input-container'] )}>
                    <ColorPicker value={color} onChange={setColor}  className={classnames(styles['color-input'] )} pickerOpts={{showAlpha: false}}/>
                    <div className={classnames(styles['buttons-container'])}>
                        <Button onClick={updateolorsAndCloseMenu} style={{ color: '#fff', backgroundColor: 'var(--color-primary)', padding: '1rem', marginTop: '1rem' }}>OK</Button>
                        <Button onClick={closeMenu} style={{ color: '#fff', backgroundColor: 'var(--color-secondary)', padding: '1rem', marginTop: '1rem' }}>Cancel</Button>
                    </div>
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