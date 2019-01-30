import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { withFocusable } from 'stremio-common';

class Input extends PureComponent {
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

Input.propTypes = {
    focusable: PropTypes.bool.isRequired
};
Input.defaultProps = {
    focusable: false
};

const InputWithFocusable = withFocusable(Input);

InputWithFocusable.displayName = 'InputWithFocusable';

const InputWithForwardedRef = React.forwardRef((props, ref) => (
    <InputWithFocusable {...props} forwardedRef={ref} />
));

InputWithForwardedRef.displayName = 'InputWithForwardedRef';

export default InputWithForwardedRef;
