const React = require('react');
const classnames = require('classnames');
const PropTypes = require('prop-types');
const { Modal } = require('stremio-router');
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
        <React.Fragment>
            <Button className={className} title={selectedColor} onClick={toggleMenu} style={{ backgroundColor: selectedColor }}></Button>
            {menuOpen ? <Modal className={classnames(styles['color-input-modal'])}>
                <div className={classnames(styles['color-input-container'])}>
                    <Button onClick={closeMenu}>
                        <Icon className={classnames(styles['x-icon'])} icon={'ic_x'} />
                    </Button>
                    <h1>Choose a color:</h1>
                    <ColorPicker className={classnames(styles['color-input'])} value={color} onChange={setColor} />
                    <Button className={classnames(styles['button'])} onClick={updateColorsAndCloseMenu}>Select</Button>
                </div>
            </Modal> : null}
        </React.Fragment>
    );
};


ColorInput.propTypes = {
    className: PropTypes.string,
    defaultValue: PropTypes.string,
    onChange: PropTypes.func
};

module.exports = ColorInput;