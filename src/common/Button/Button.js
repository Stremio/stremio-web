import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Focusable } from 'stremio-common';

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
        const { stopPropagation, forwardedRef, ...props } = this.props;
        return (
            <Focusable ref={forwardedRef}>
                <div
                    {...props}
                    onClick={this.onClick}
                    onKeyUp={this.onKeyUp}
                />
            </Focusable>
        );
    }
}

Button.propTypes = {
    stopPropagation: PropTypes.bool.isRequired
};
Button.defaultProps = {
    stopPropagation: true
};

const ButtonWithForwardedRef = React.forwardRef((props, ref) => (
    <Button {...props} forwardedRef={ref} />
));

export default ButtonWithForwardedRef;
