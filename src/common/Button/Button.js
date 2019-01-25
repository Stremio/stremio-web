import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { withFocusable } from 'stremio-common';

class Button extends PureComponent {
    onClick = (event) => {
        if (this.props.stopPropagation) {
            event.stopPropagation();
        }

        if (typeof this.props.onClick === 'function') {
            this.props.onClick(event);
        }
    }

    onKeyUp = (event) => {
        if (event.which === 13) { // Enter key code
            this.onClick(event);
        }
    }

    render() {
        const { forwardedRef, focusable, stopPropagation, ...props } = this.props;
        return (
            <div
                {...props}
                ref={forwardedRef}
                tabIndex={focusable ? 0 : -1}
                onClick={this.onClick}
                onKeyUp={this.onKeyUp}
            />
        );
    }
}

Button.propTypes = {
    focusable: PropTypes.bool.isRequired,
    stopPropagation: PropTypes.bool.isRequired
};
Button.defaultProps = {
    focusable: false,
    stopPropagation: true
};

const ButtonWithForwardedRef = React.forwardRef((props, ref) => (
    <Button {...props} forwardedRef={ref} />
));

ButtonWithForwardedRef.displayName = 'ButtonWithForwardedRef';

export default withFocusable(ButtonWithForwardedRef);
