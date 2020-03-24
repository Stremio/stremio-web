const React = require('react');
const PropTypes = require('prop-types');
const classnames = require('classnames');
const { Button, Checkbox } = require('stremio/common');
const styles = require('./styles');

const ConsentCheckbox = React.forwardRef(({ className, checked, label, link, href, onToggle, ...props }, ref) => {
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
    }, [onToggle]);
    const linkOnClick = React.useCallback((event) => {
        event.nativeEvent.togglePrevented = true;
    }, []);
    return (
        <Checkbox {...props} ref={ref} className={classnames(className, styles['consent-checkbox-container'])} checked={checked} onClick={checkboxOnClick}>
            <div className={styles['label']}>
                {label}
                {' '}
                {
                    typeof link === 'string' && typeof href === 'string' ?
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
