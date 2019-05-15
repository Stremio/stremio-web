const React = require('react');
const PropTypes = require('prop-types');
const { withModalsContainer } = require('../ModalsContainerContext');
const FocusableContext = require('./FocusableContext');

class FocusableProvider extends React.Component {
    constructor(props) {
        super(props);

        this.contentRef = React.createRef();
        this.modalsContainerDomTreeObserver = new MutationObserver(this.onModalsContainerDomTreeChange);
        this.state = {
            focusable: false
        };
    }

    componentDidMount() {
        this.findFocusInContentContainer();
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
        if (prevState.focusable !== this.state.focusable) {
            this.findFocusInContentContainer();
        }

        if (prevProps.modalsContainer !== this.props.modalsContainer) {
            this.onModalsContainerDomTreeChange();
            this.modalsContainerDomTreeObserver.disconnect();
            this.modalsContainerDomTreeObserver.observe(this.props.modalsContainer, {
                childList: true
            });
        }
    }

    findFocusInContentContainer = () => {
        if (!this.state.focusable || this.contentRef.current.hidden) {
            return;
        }

        const focusableChild = Array.from(this.contentRef.current.querySelectorAll('[tabIndex="0"]'))
            .find((element) => !element.hidden);
        if (focusableChild) {
            focusableChild.focus();
        } else {
            this.contentRef.current.focus();
        }
    }

    onModalsContainerDomTreeChange = () => {
        const focusable = this.props.onModalsContainerDomTreeChange({
            modalsContainerElement: this.props.modalsContainer,
            contentElement: this.contentRef.current
        });
        this.setState({ focusable });
    }

    render() {
        return (
            <FocusableContext.Provider value={this.state.focusable}>
                {React.cloneElement(React.Children.only(this.props.children), { ref: this.contentRef, tabIndex: -1 })}
            </FocusableContext.Provider>
        );
    }
}

FocusableProvider.propTypes = {
    modalsContainer: PropTypes.instanceOf(HTMLElement).isRequired,
    onModalsContainerDomTreeChange: PropTypes.func.isRequired,
    children: PropTypes.node.isRequired
};

const FocusableProviderWithModalsContainer = withModalsContainer(FocusableProvider);

FocusableProviderWithModalsContainer.displayName = 'FocusableProviderWithModalsContainer';

module.exports = FocusableProviderWithModalsContainer;
