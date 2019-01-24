import React, { Component } from 'react';
import PropTypes from 'prop-types';
import FocusableContext from './FocusableContext';

class FocusableProvider extends Component {
    constructor(props) {
        super(props);

        this.childElementRef = React.createRef();
        this.observers = props.elements.map((element) => ({
            element,
            observer: new MutationObserver(this.onDomTreeChange)
        }));
        this.state = {
            focusable: false
        };
    }

    componentDidMount() {
        this.onDomTreeChange();
        this.observers.forEach(({ element, observer }) => observer.observe(element, {
            childList: true
        }));
    }

    componentWillUnmount() {
        this.observers.forEach(({ observer }) => observer.disconnect());
    }

    shouldComponentUpdate(nextProps, nextState) {
        return nextProps.children !== this.props.children ||
            nextState.focusable !== this.state.focusable;
    }

    componentDidUpdate() {
        if (!this.state.focusable) {
            const focusedElement = this.childElementRef.current.querySelector(':focus');
            if (focusedElement) {
                focusedElement.blur();
            }
        }
    }

    onDomTreeChange = () => {
        this.props.onDomTreeChange({
            child: this.childElementRef.current,
            onFocusableChange: this.onFocusableChange
        });
    }

    onFocusableChange = (focusable) => {
        this.setState({ focusable });
    }

    render() {
        return (
            <FocusableContext.Provider value={this.state.focusable}>
                {React.cloneElement(React.Children.only(this.props.children), { ref: this.childElementRef })}
            </FocusableContext.Provider>
        );
    }
}

FocusableProvider.propTypes = {
    onDomTreeChange: PropTypes.func.isRequired,
    elements: PropTypes.arrayOf(PropTypes.instanceOf(HTMLElement).isRequired).isRequired
};

export default FocusableProvider;
