import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { withFocusable } from 'stremio-common';

class Link extends PureComponent {
    render() {
        const { forwardedRef, focusable, ...props } = this.props;
        return (
            <a
                {...props}
                ref={forwardedRef}
                tabIndex={focusable ? 0 : -1}
            />
        );
    }
}

Link.propTypes = {
    focusable: PropTypes.bool.isRequired
};
Link.defaultProps = {
    focusable: false
};

const LinkWithFocusable = withFocusable(Link);

LinkWithFocusable.displayName = 'LinkWithFocusable';

const LinkWithForwardedRef = React.forwardRef((props, ref) => (
    <LinkWithFocusable {...props} forwardedRef={ref} />
));

LinkWithForwardedRef.displayName = 'LinkWithForwardedRef';

export default LinkWithForwardedRef;
