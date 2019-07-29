const React = require('react');
const PropTypes = require('prop-types');
const classnames = require('classnames');
const Icon = require('stremio-icons/dom');
const { Input } = require('stremio-navigation');
const { Popup, useBinaryState } = require('stremio/common');
const styles = require('./styles');

const PickerMenu = ({ name, value, options, onChange }) => {
    const popupRef = React.useRef();
    const [open, onOpen, onClose] = useBinaryState(false);
    const label = typeof value === 'string' ? value : name;
    const optionOnClick = React.useCallback((event) => {
        if (popupRef.current !== null) {
            popupRef.current.close();
        }

        onChange(event);
    }, [onChange]);
    return (
        <Popup ref={popupRef} onOpen={onOpen} onClose={onClose}>
            <Popup.Label>
                <Input className={classnames(styles['picker-button'], { 'active': open }, 'focusable-with-border')} title={label} type={'button'}>
                    <div className={classnames(styles['picker-label'], { [styles['capitalized']]: name === 'type' })}>{label}</div>
                    <Icon className={styles['picker-icon']} icon={'ic_arrow_down'} />
                </Input>
            </Popup.Label>
            <Popup.Menu className={styles['menu-container']}>
                <div className={styles['menu-content']}>
                    {
                        Array.isArray(options) ?
                            options.map(({ value, label }) => (
                                <Input key={value} className={classnames(styles['menu-item-container'], 'focusable-with-border')} title={label} data-name={name} data-value={value} type={'button'} onClick={optionOnClick}>
                                    <div className={classnames(styles['menu-label'], { [styles['capitalized']]: name === 'type' })}>{label}</div>
                                </Input>
                            ))
                            :
                            null
                    }
                </div>
            </Popup.Menu>
        </Popup>
    );
};

PickerMenu.propTypes = {
    name: PropTypes.string,
    value: PropTypes.string,
    options: PropTypes.arrayOf(PropTypes.shape({
        value: PropTypes.string,
        label: PropTypes.string
    })),
    onChange: PropTypes.func
};

module.exports = PickerMenu;
