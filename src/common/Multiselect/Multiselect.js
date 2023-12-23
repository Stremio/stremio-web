// Copyright (C) 2017-2023 Smart code 203358507

const React = require('react');
const PropTypes = require('prop-types');
const classnames = require('classnames');
const { default: Icon } = require('@stremio/stremio-icons/react');
const Button = require('stremio/common/Button');
const Popup = require('stremio/common/Popup');
const ModalDialog = require('stremio/common/ModalDialog');
const useBinaryState = require('stremio/common/useBinaryState');
const styles = require('./styles');

const Multiselect = ({ className, mode, direction, title, disabled, dataset, renderLabelContent, renderLabelText, onOpen, onClose, onSelect, ...props }) => {
    const [menuOpen, , closeMenu, toggleMenu] = useBinaryState(false);
    const options = React.useMemo(() => {
        return Array.isArray(props.options) ?
            props.options.filter((option) => {
                return option && (typeof option.value === 'string' || option.value === null);
            })
            :
            [];
    }, [props.options]);
    const selected = React.useMemo(() => {
        return Array.isArray(props.selected) ?
            props.selected.filter((value) => {
                return typeof value === 'string' || value === null;
            })
            :
            [];
    }, [props.selected]);
    const labelOnClick = React.useCallback((event) => {
        if (typeof props.onClick === 'function') {
            props.onClick(event);
        }

        if (!event.nativeEvent.toggleMenuPrevented) {
            toggleMenu();
        }
    }, [props.onClick, toggleMenu]);
    const menuOnClick = React.useCallback((event) => {
        event.nativeEvent.toggleMenuPrevented = true;
    }, []);
    const menuOnKeyDown = React.useCallback((event) => {
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
    const renderLabel = React.useCallback(({ children, className, ...props }) => (
        <Button {...props} className={classnames(className, styles['label-container'], { 'active': menuOpen })} title={title} disabled={disabled} onClick={labelOnClick}>
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
                                        selected.map((value) => {
                                            const option = options.find((option) => option.value === value);
                                            return option && typeof option.label === 'string' ?
                                                option.label
                                                :
                                                value;
                                        }).join(', ')
                                        :
                                        title
                            }
                        </div>
                        <Icon className={styles['icon']} name={'caret-down'} />
                    </React.Fragment>
            }
            {children}
        </Button>
    ), [menuOpen, title, disabled, options, selected, labelOnClick, renderLabelContent, renderLabelText]);
    const renderMenu = React.useCallback(() => (
        <div className={styles['menu-container']} onKeyDown={menuOnKeyDown} onClick={menuOnClick}>
            {
                options.length > 0 ?
                    options.map(({ label, title, value }) => (
                        <Button key={value} className={classnames(styles['option-container'], { 'selected': selected.includes(value) })} title={typeof title === 'string' ? title : typeof label === 'string' ? label : value} data-value={value} onClick={optionOnClick}>
                            <div className={styles['label']}>{typeof label === 'string' ? label : value}</div>
                            <div className={styles['icon']} />
                        </Button>
                    ))
                    :
                    <div className={styles['no-options-container']}>
                        <div className={styles['label']}>No options available</div>
                    </div>
            }
        </div>
    ), [options, selected, menuOnKeyDown, menuOnClick, optionOnClick]);
    const renderPopupLabel = React.useMemo(() => (labelProps) => {
        return renderLabel({
            ...labelProps,
            ...props,
            className: classnames(className, labelProps.className)
        });
    }, [props, className, renderLabel]);
    return mode === 'modal' ?
        renderLabel({
            ...props,
            className,
            children: menuOpen ?
                <ModalDialog className={styles['modal-container']} title={title} onCloseRequest={closeMenu} onKeyDown={menuOnKeyDown} onClick={menuOnClick}>
                    {renderMenu()}
                </ModalDialog>
                :
                null
        })
        :
        <Popup
            open={menuOpen}
            direction={direction}
            onCloseRequest={closeMenu}
            renderLabel={renderPopupLabel}
            renderMenu={renderMenu}
        />;
};

Multiselect.propTypes = {
    className: PropTypes.string,
    mode: PropTypes.oneOf(['popup', 'modal']),
    direction: PropTypes.any,
    title: PropTypes.string,
    options: PropTypes.arrayOf(PropTypes.shape({
        value: PropTypes.string,
        title: PropTypes.string,
        label: PropTypes.string
    })),
    selected: PropTypes.arrayOf(PropTypes.string),
    disabled: PropTypes.bool,
    dataset: PropTypes.object,
    renderLabelContent: PropTypes.func,
    renderLabelText: PropTypes.func,
    onOpen: PropTypes.func,
    onClose: PropTypes.func,
    onSelect: PropTypes.func,
    onClick: PropTypes.func
};

module.exports = Multiselect;
