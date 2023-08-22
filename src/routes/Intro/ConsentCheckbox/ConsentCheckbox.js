// Copyright (C) 2017-2023 Smart code 203358507

const React = require('react');
const PropTypes = require('prop-types');
const classnames = require('classnames');
const { Button, Checkbox } = require('stremio/common');
const styles = require('./styles');

const ConsentCheckbox = React.forwardRef(({ className, label, link, href, onToggle, ...props }, ref) => {
    const checkboxOnClick = React.useCallback((event) => {
        if (typeof props.onClick === 'function') {
            props.onClick(event);
        }

        if (!event.nativeEvent.togglePrevented && typeof onToggle === 'function') {
            onToggle({
                type: 'toggle',
                reactEvent: event,
                nativeEvent: event.nativeEvent
            });
        }
    }, [onToggle, props.onClick]);
    const linkOnClick = React.useCallback((event) => {
        event.nativeEvent.togglePrevented = true;
    }, []);
    return (
        <Checkbox {...props} ref={ref} className={classnames(className, styles['consent-checkbox-container'])} onClick={checkboxOnClick}>
            <div className={styles['label']}>
                {label}
                {' '}
                {
                    typeof link === 'string' && link.length > 0 && typeof href === 'string' && href.length > 0 ?
                        <Button className={styles['link']} href={href} target={'_blank'} tabIndex={-1} onClick={linkOnClick}>
                            {link}
                        </Button>
                        :
                        null
                }
            </div>
        </Checkbox>
    );
});

ConsentCheckbox.displayName = 'ConsentCheckbox';

ConsentCheckbox.propTypes = {
    className: PropTypes.string,
    checked: PropTypes.bool,
    label: PropTypes.string,
    link: PropTypes.string,
    href: PropTypes.string,
    onToggle: PropTypes.func,
    onClick: PropTypes.func
};

module.exports = ConsentCheckbox;
