const React = require('react');
const PropTypes = require('prop-types');
const { Input } = require('stremio/common');

const CredentialsInput = React.forwardRef((props, ref) => {
    const onKeyDown = React.useCallback((event) => {
        if (typeof props.onKeyDown === 'function') {
            props.onKeyDown(event);
        }

        if (!event.navigationPrevented) {
            event.stopPropagation();
            if (event.key === 'ArrowDown') {
                window.navigate('down');
            } else if (event.key === 'ArrowUp') {
                window.navigate('up');
            }
        }
    }, [props.onKeyDown]);
    return (
        <Input {...props} ref={ref} onKeyDown={onKeyDown} />
    );
});

CredentialsInput.displayName = 'CredentialsInput';

CredentialsInput.propTYpes = {
    onKeyDown: PropTypes.func
};

module.exports = CredentialsInput;
