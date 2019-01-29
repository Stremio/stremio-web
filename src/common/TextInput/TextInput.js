import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { withFocusable } from 'stremio-common';

class TextInput extends PureComponent {
    render() {
        const { forwardedRef, focusable, ...props } = this.props;
        return (
            <input
                {...props}
                ref={forwardedRef}
                tabIndex={focusable ? 0 : -1}
            />
        );
    }
}

TextInput.propTypes = {
    focusable: PropTypes.bool.isRequired
};
TextInput.defaultProps = {
    focusable: false
};

const TextInputWithFocusable = withFocusable(TextInput);

TextInputWithFocusable.displayName = 'TextInputWithFocusable';

const TextInputWithForwardedRef = React.forwardRef((props, ref) => (
    <TextInputWithFocusable {...props} forwardedRef={ref} />
));

TextInputWithForwardedRef.displayName = 'TextInputWithForwardedRef';

export default TextInputWithForwardedRef;
