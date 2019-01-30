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

        if (typeof this.props.onKeyUp === 'function') {
            this.props.onKeyUp(event);
        }
    }

    onDrag = (event) => {
        event.currentTarget.blur();

        if (typeof this.props.onDrag === 'function') {
            this.props.onDrag(event);
        }
    }

    onMouseOut = (event) => {
        event.currentTarget.blur();

        if (typeof this.props.onMouseOut === 'function') {
            this.props.onMouseOut(event);
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
                onDrag={this.onDrag}
                onMouseOut={this.onMouseOut}
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

const ButtonWithFocusable = withFocusable(Button);

ButtonWithFocusable.displayName = 'ButtonWithFocusable';

const ButtonWithForwardedRef = React.forwardRef((props, ref) => (
    <ButtonWithFocusable {...props} forwardedRef={ref} />
));

ButtonWithForwardedRef.displayName = 'ButtonWithForwardedRef';

export default ButtonWithForwardedRef;
