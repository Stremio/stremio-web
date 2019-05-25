const React = require('react');
const PropTypes = require('prop-types');
const classnames = require('classnames');
const { Input } = require('stremio-navigation');
const { Checkbox } = require('stremio-common');
const styles = require('./styles');

const ConsentCheckbox = React.forwardRef(({ className, checked, label, link, href, onClick }, ref) => {
    const linkOnClick = React.useCallback((event) => {
        event.stopPropagation();
    }, []);

    return (
        <Checkbox ref={ref} className={classnames(className, styles['consent-checkbox-container'])} checked={checked} onClick={onClick}>
            <div className={styles['label']}>
                {label}
                {
                    typeof link === 'string' && typeof href === 'string' ?
                        <Input className={styles['link']} type={'link'} href={href} target={'_blank'} tabIndex={-1} onClick={linkOnClick}> {link}</Input>
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
    onClick: PropTypes.func
};

module.exports = ConsentCheckbox;
