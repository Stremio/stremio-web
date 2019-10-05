const React = require('react');
const PropTypes = require('prop-types');
const Icon = require('stremio-icons/dom');
const Button = require('stremio/common/Button');
const Popup = require('stremio/common/Popup');
const useBinaryState = require('stremio/common/useBinaryState');
const ColorPicker = require('./ColorPicker');
const styles = require('./styles');

const ColorInput = ({ className, id, value, onChange, ...props }) => {
    const [popupOpen, openPopup, closePopup, togglePopup] = useBinaryState(false);
    const [selectedColor, setSelectedColor] = React.useState(value);
    React.useEffect(() => {
        setSelectedColor(value);
    }, [value]);
    const onSubmit = React.useCallback((event) => {
        if (typeof onChange === 'function') {
            event.nativeEvent.value = selectedColor;
            onChange(event);
        }

        closePopup();
    }, [selectedColor, onChange]);
    return (
        <Popup
            open={popupOpen}
            menuModalClassName={styles['color-input-modal-container']}
            menuRelativePosition={false}
            renderLabel={(ref) => (
                <Button
                    {...props}
                    ref={ref}
                    style={{ backgroundColor: value }}
                    className={className}
                    title={selectedColor}
                    onClick={togglePopup}
                />
            )}
            renderMenu={() => (
                <div className={styles['color-input-container']}>
                    <Button className={styles['close-button-container']} onClick={closePopup}>
                        <Icon className={styles['icon']} icon={'ic_x'} />
                    </Button>
                    <div className={styles['title']}>Choose a color:</div>
                    <ColorPicker className={styles['color-picker']} value={selectedColor} onChange={setSelectedColor} />
                    <Button className={styles['submit-button-container']} data-id={id} onClick={onSubmit}>Select</Button>
                </div>
            )}
            onCloseRequest={closePopup}
        />
    );
};

ColorInput.propTypes = {
    className: PropTypes.string,
    id: PropTypes.string,
    value: PropTypes.string,
    onChange: PropTypes.func
};

module.exports = ColorInput;
