const React = require('react');
const PropTypes = require('prop-types');
const { TextInput } = require('stremio/common');

const CredentialsTextInput = React.forwardRef((props, ref) => {
    const onKeyDown = React.useCallback((event) => {
        if (typeof props.onKeyDown === 'function') {
            props.onKeyDown(event);
        }

        if (!event.nativeEvent.navigationPrevented) {
            if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(event.key)) {
                event.nativeEvent.spatialNavigationPrevented = true;
            }

            if (event.key === 'ArrowDown') {
                window.navigate('down');
            } else if (event.key === 'ArrowUp') {
                window.navigate('up');
            }
        }
    }, [props.onKeyDown]);
    return (
        <TextInput {...props} ref={ref} onKeyDown={onKeyDown} />
    );
});

CredentialsTextInput.displayName = 'CredentialsTextInput';

CredentialsTextInput.propTypes = {
    onKeyDown: PropTypes.func
};

module.exports = CredentialsTextInput;
