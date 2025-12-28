// Copyright (C) 2017-2023 Smart code 203358507

const React = require('react');
const { useTranslation } = require('react-i18next');
const PropTypes = require('prop-types');
const classnames = require('classnames');
const { default: Icon } = require('@stremio/stremio-icons/react');
const { Button } = require('stremio/components');
const ModalDialog = require('stremio/components/ModalDialog');
const useBinaryState = require('stremio/common/useBinaryState');
const { default: useOutsideClick } = require('stremio/common/useOutsideClick');
const styles = require('./styles');
const menuStyles = require('../MultiselectMenu/MultiselectMenu.less');

const LanguageMultiselect = ({ className, mode, direction, title, disabled = false, dataset = undefined, options, renderLabelContent = undefined, renderLabelText = undefined, onOpen = undefined, onClose = undefined, onSelect, ...props }) => {
    const { t } = useTranslation();
    const [menuOpen, , closeMenu, toggleMenu] = useBinaryState(false);

    const multiselectMenuRef = useOutsideClick(() => {
        if (menuOpen) {
            closeMenu();
        }
    });

    const filteredOptions = React.useMemo(() => {
        return Array.isArray(options) ?
            options.filter((option) => {
                return option && (typeof option.value === 'string' || option.value === null);
            })
            :
            [];
    }, [options]);

    const selected = React.useMemo(() => {
        return Array.isArray(props.selected) ?
            props.selected.filter((value) => {
                return typeof value === 'string' || value === null;
            })
            :
            [];
    }, [props.selected]);

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

    const renderLabelContentNode = () => {
        if (typeof renderLabelContent === 'function') {
            return renderLabelContent();
        }

        return (
            <React.Fragment>
                <div className={classnames(menuStyles['label'], styles['multiselect-label-fix'])}>
                    {
                        typeof renderLabelText === 'function' ?
                            renderLabelText()
                            :
                            selected.length > 0 ?
                                (() => {
                                    const MAX_ITEMS = 2;
                                    const items = selected.slice(0, MAX_ITEMS).map((value) => {
                                        const option = filteredOptions.find((option) => option.value === value);
                                        return option && typeof option.label === 'string' ?
                                            option.label
                                            :
                                            value;
                                    });
                                    return selected.length > MAX_ITEMS ? items.join(', ') + ', ...' : items.join(', ');
                                })()
                                :
                                title
                    }
                </div>
                <Icon className={classnames(menuStyles['icon'], { [menuStyles['open']]: menuOpen })} name={'caret-down'} />
            </React.Fragment>
        );
    };

    const renderMenu = () => (
        <div className={classnames(styles['dropdown'], { [styles['open']]: menuOpen })}>
            {
                filteredOptions.length > 0 ?
                    filteredOptions.map(({ label, title, value }) => {
                        const isSelected = selected.includes(value);
                        return (
                            <Button
                                key={value}
                                className={classnames(styles['option'], { [styles['selected']]: isSelected })}
                                title={typeof title === 'string' ? title : typeof label === 'string' ? label : value}
                                data-value={value}
                                onClick={optionOnClick}
                            >
                                <div className={styles['label']}>{typeof label === 'string' ? label : value}</div>
                                {isSelected && <div className={styles['icon']} />}
                            </Button>
                        );
                    })
                    :
                    <div className={styles['no-options-container']}>
                        <div className={styles['label']}>{t('NO_OPTIONS')}</div>
                    </div>
            }
        </div>
    );

    if (mode === 'modal') {
        return (
            <div className={classnames(menuStyles['multiselect-menu'], className)}>
                <Button
                    className={classnames(menuStyles['multiselect-button'], styles['multiselect-button-fix'], { [menuStyles['open']]: menuOpen })}
                    disabled={disabled}
                    onClick={toggleMenu}
                    title={title}
                >
                    {renderLabelContentNode()}
                </Button>
                {menuOpen ?
                    <ModalDialog className={styles['modal-container']} title={title} onCloseRequest={closeMenu}>
                        {renderMenu()}
                    </ModalDialog>
                    : null
                }
            </div>
        );
    }

    return (
        <div
            className={classnames(menuStyles['multiselect-menu'], { [menuStyles['active']]: menuOpen, [menuStyles['disabled']]: disabled }, className)}
            ref={multiselectMenuRef}
        >
            <Button
                className={classnames(menuStyles['multiselect-button'], styles['multiselect-button-fix'], { [menuStyles['open']]: menuOpen })}
                disabled={disabled}
                onClick={toggleMenu}
                tabIndex={0}
                aria-haspopup='listbox'
                aria-expanded={menuOpen}
                title={title}
            >
                {renderLabelContentNode()}
            </Button>
            {renderMenu()}
        </div>
    );
};

LanguageMultiselect.propTypes = {
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

module.exports = LanguageMultiselect;
