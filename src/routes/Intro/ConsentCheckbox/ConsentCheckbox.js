const React = require('react');
const PropTypes = require('prop-types');
const classnames = require('classnames');
const { Button, Checkbox } = require('stremio/common');
const styles = require('./styles');

const ConsentCheckbox = React.forwardRef(({ label, link, href, toggle, ...props }, ref) => {
    const checkboxOnClick = React.useCallback((event) => {
        if (!event.nativeEvent.togglePrevented && typeof toggle === 'function') {
            toggle(event);
        }
    }, [toggle]);
    const linkOnClick = React.useCallback((event) => {
        event.nativeEvent.togglePrevented = true;
    }, []);
    return (
        <Checkbox {...props} ref={ref} className={classnames(props.className, styles['consent-checkbox-container'])} onClick={checkboxOnClick}>
            <div className={styles['label']}>
                {label}
                {
                    typeof link === 'string' && typeof href === 'string' ?
                        <Button className={styles['link']} href={href} target={'_blank'} tabIndex={-1} onClick={linkOnClick}>
                            {' '}{link}
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
    toggle: PropTypes.func
};

module.exports = ConsentCheckbox;
