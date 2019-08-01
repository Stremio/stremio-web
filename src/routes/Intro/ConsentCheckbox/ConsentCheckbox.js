const React = require('react');
const PropTypes = require('prop-types');
const classnames = require('classnames');
const { Input } = require('stremio-navigation');
const { Checkbox } = require('stremio/common');
require('./styles');

const ConsentCheckbox = React.forwardRef(({ className, checked, label, link, href, toggle }, ref) => {
    const checkboxOnClick = React.useCallback((event) => {
        if (!event.nativeEvent.togglePrevented && typeof toggle === 'function') {
            toggle(event);
        }
    }, [toggle]);
    const linkOnClick = React.useCallback((event) => {
        event.nativeEvent.togglePrevented = true;
    }, []);
    return (
        <Checkbox ref={ref} className={classnames(className, 'consent-checkbox-container', 'focusable-with-border')} checked={checked} onClick={checkboxOnClick}>
            <div className={'label'}>
                {label}
                {
                    typeof link === 'string' && typeof href === 'string' ?
                        <Input
                            className={'link'}
                            type={'link'}
                            href={href}
                            target={'_blank'}
                            tabIndex={-1}
                            children={` ${link}`}
                            onClick={linkOnClick}
                        />
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
