import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FocusableContext, withModalsContainer } from 'stremio-common';

class RouteFocusableProvider extends Component {
    constructor(props) {
        super(props);

        this.routeContentRef = React.createRef();
        this.modalsContainerDomTreeObserver = new MutationObserver(this.onModalsContainerDomTreeChange);
        this.state = {
            focusable: false
        };
    }

    componentDidMount() {
        this.onModalsContainerDomTreeChange();
        this.modalsContainerDomTreeObserver.observe(this.props.modalsContainer, {
            childList: true
        });
    }

    componentWillUnmount() {
        this.modalsContainerDomTreeObserver.disconnect();
    }

    shouldComponentUpdate(nextProps, nextState) {
        return nextState.focusable !== this.state.focusable ||
            nextProps.modalsContainer !== this.props.modalsContainer ||
            nextProps.children !== this.props.children;
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevState.focusable && !this.state.focusable) {
            const focusedElement = this.routeContentRef.current.querySelector(':focus');
            if (focusedElement !== null) {
                focusedElement.blur();
            }
        }
    }

    onModalsContainerDomTreeChange = () => {
        this.setState({ focusable: this.props.modalsContainer.childElementCount === 0 });
    }

    render() {
        return (
            <FocusableContext.Provider value={this.state.focusable}>
                {React.cloneElement(React.Children.only(this.props.children), { ref: this.routeContentRef })}
            </FocusableContext.Provider>
        );
    }
}

RouteFocusableProvider.propTypes = {
    modalsContainer: PropTypes.instanceOf(HTMLElement).isRequired
};

const RouteFocusableProviderWithModalsContainer = withModalsContainer(RouteFocusableProvider);

RouteFocusableProviderWithModalsContainer.displayName = 'RouteFocusableProviderWithModalsContainer';

export default RouteFocusableProviderWithModalsContainer;
