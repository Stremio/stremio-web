import React, { Component } from 'react';
import FocusableContext from './FocusableContext';

class FocusableProvider extends Component {
    constructor(props) {
        super(props);

        this.childElementRef = React.createRef();
        this.containerClildListObserver = new MutationObserver(this.containerClildListOnChange);
        this.state = {
            focusable: false
        };
    }

    componentDidMount() {
        this.containerClildListOnChange();
        this.containerClildListObserver.observe(this.childElementRef.current.parentElement, {
            childList: true
        });
    }

    componentWillUnmount() {
        this.containerClildListObserver.disconnect();
    }

    shouldComponentUpdate(nextProps, nextState) {
        return nextProps.children !== this.props.children ||
            nextState.focusable !== this.state.focusable;
    }

    containerClildListOnChange = () => {
        for (let i = this.childElementRef.current.parentElement.children.length - 1; i >= 0; i--) {
            const child = this.childElementRef.current.parentElement.children[i];
            const tagName = child.tagName.toLowerCase();
            if (tagName !== 'script' && tagName !== 'style') {
                this.setState({
                    focusable: this.childElementRef.current === child
                });
                break;
            }
        }
    }

    render() {
        return (
            <FocusableContext.Provider value={this.state.focusable}>
                {React.cloneElement(React.Children.only(this.props.children), { ref: this.childElementRef })}
            </FocusableContext.Provider>
        );
    }
}

export default FocusableProvider;
