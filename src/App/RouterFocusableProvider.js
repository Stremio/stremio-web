import React, { Component } from 'react';
import { FocusableContext, withModalsContainer } from 'stremio-common';

class RouterFocusableProvider extends Component {
    constructor(props) {
        super(props);

        this.routesContainerRef = React.createRef();
        this.modalsContainerDomTreeObserver = new MutationObserver(this.onModalsContainerDomTreeChange);
        this.state = {
            focusable: false
        };
    }

    componentDidMount() {
        if (this.props.modalsContainer !== null) {
            this.onModalsContainerDomTreeChange();
            this.modalsContainerDomTreeObserver.observe(this.props.modalsContainer, {
                childList: true
            });
        }
    }

    componentWillUnmount() {
        this.modalsContainerDomTreeObserver.disconnect();
    }

    shouldComponentUpdate(nextProps, nextState) {
        return nextState.focusable !== this.state.focusable ||
            nextProps.routesContainerClassName !== this.props.routesContainerClassName ||
            nextProps.modalsContainer !== this.props.modalsContainer ||
            nextProps.children !== this.props.children;
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevState.focusable && !this.state.focusable) {
            const focusedElement = this.routesContainerRef.current.querySelector(':focus');
            if (focusedElement !== null) {
                focusedElement.blur();
            }
        }

        if (prevProps.modalsContainer !== this.props.modalsContainer) {
            this.onModalsContainerDomTreeChange();
            this.modalsContainerDomTreeObserver.disconnect();
            this.modalsContainerDomTreeObserver.observe(this.props.modalsContainer, {
                childList: true
            });
        }
    }

    onModalsContainerDomTreeChange = () => {
        this.setState({ focusable: this.props.modalsContainer.childElementCount === 0 });
    }

    render() {
        return (
            <FocusableContext.Provider value={this.state.focusable}>
                <div ref={this.routesContainerRef} className={this.props.routesContainerClassName}>
                    {this.props.children}
                </div>
            </FocusableContext.Provider>
        );
    }
}

export default withModalsContainer(RouterFocusableProvider);
