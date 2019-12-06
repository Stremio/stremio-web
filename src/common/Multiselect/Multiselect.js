const React = require('react');
const PropTypes = require('prop-types');
const classnames = require('classnames');
const Icon = require('stremio-icons/dom');
const Button = require('stremio/common/Button');
const Popup = require('stremio/common/Popup');
const useBinaryState = require('stremio/common/useBinaryState');
const styles = require('./styles');

const Multiselect = ({ className, direction, title, disabled, dataset, renderLabelContent, renderLabelText, onOpen, onClose, onSelect, ...props }) => {
    const [menuOpen, openMenu, closeMenu, toggleMenu] = useBinaryState(false);
    const options = React.useMemo(() => {
        return Array.isArray(props.options) ?
            props.options.filter((option) => {
                return option && typeof option.value === 'string';
            })
            :
            [];
    }, [props.options]);
    const selected = React.useMemo(() => {
        return Array.isArray(props.selected) ?
            props.selected.filter((value) => {
                return typeof value === 'string';
            })
            :
            [];
    }, [props.selected]);
    const popupLabelOnClick = React.useCallback((event) => {
        if (typeof props.onClick === 'function') {
            props.onClick(event);
        }

        if (!event.nativeEvent.togglePopupPrevented) {
            toggleMenu();
        }
    }, [props.onClick, toggleMenu]);
    const popupMenuOnClick = React.useCallback((event) => {
        event.nativeEvent.togglePopupPrevented = true;
    }, []);
    const popupMenuOnKeyDown = React.useCallback((event) => {
        event.nativeEvent.buttonClickPrevented = true;
    }, []);
    const optionOnClick = React.useCallback((event) => {
        if (typeof onSelect === 'function') {
            onSelect({
                type: 'select',
                value: event.currentTarget.dataset.value,
                reactEvent: event,
                nativeEvent: event.nativeEvent,
                dataset: dataset
            });
        }

        if (!event.nativeEvent.closeMenuPrevented) {
            closeMenu();
        }
    }, [dataset, onSelect]);
    const mountedRef = React.useRef(false);
    React.useLayoutEffect(() => {
        if (mountedRef.current) {
            if (menuOpen) {
                if (typeof onOpen === 'function') {
                    onOpen({
                        type: 'open',
                        dataset: dataset
                    });
                }
            } else {
                if (typeof onClose === 'function') {
                    onClose({
                        type: 'close',
                        dataset: dataset
                    });
                }
            }
        }

        mountedRef.current = true;
    }, [menuOpen]);
    return (
        <Popup
            open={menuOpen}
            direction={direction}
            onCloseRequest={closeMenu}
            renderLabel={({ children, ...labelProps }) => (
                <Button {...labelProps} {...props} className={classnames(className, labelProps.className, styles['label-container'], { 'active': menuOpen })} title={title} disabled={disabled} onClick={popupLabelOnClick}>
                    {
                        typeof renderLabelContent === 'function' ?
                            renderLabelContent()
                            :
                            <React.Fragment>
                                <div className={styles['label']}>
                                    {
                                        typeof renderLabelText === 'function' ?
                                            renderLabelText()
                                            :
                                            selected.length > 0 ?
                                                options.reduce((labels, { label, value }) => {
                                                    if (selected.includes(value)) {
                                                        labels.push(typeof label === 'string' ? label : value);
                                                    }

                                                    return labels;
                                                }, []).join(', ')
                                                :
                                                title
                                    }
                                </div>
                                <Icon className={styles['icon']} icon={'ic_arrow_down'} />
                            </React.Fragment>
                    }
                    {children}
                </Button>
            )}
            renderMenu={() => (
                <div className={styles['menu-container']} onKeyDown={popupMenuOnKeyDown} onClick={popupMenuOnClick}>
                    {
                        options.length > 0 ?
                            options.map(({ label, value }) => (
                                <Button key={value} className={classnames(styles['option-container'], { 'selected': selected.includes(value) })} title={typeof label === 'string' ? label : value} data-value={value} onClick={optionOnClick}>
                                    <div className={styles['label']}>{typeof label === 'string' ? label : value}</div>
                                    <Icon className={styles['icon']} icon={'ic_check'} />
                                </Button>
                            ))
                            :
                            <div className={styles['no-options-container']}>
                                <div className={styles['label']}>No options available</div>
                            </div>
                    }
                </div>
            )}
        />
    );
};

Multiselect.propTypes = {
    className: PropTypes.string,
    direction: PropTypes.any,
    title: PropTypes.string,
    options: PropTypes.arrayOf(PropTypes.shape({
        value: PropTypes.string.isRequired,
        label: PropTypes.string
    })),
    selected: PropTypes.arrayOf(PropTypes.string),
    disabled: PropTypes.bool,
    dataset: PropTypes.objectOf(String),
    renderLabelContent: PropTypes.func,
    renderLabelText: PropTypes.func,
    onOpen: PropTypes.func,
    onClose: PropTypes.func,
    onSelect: PropTypes.func
};

module.exports = Multiselect;
