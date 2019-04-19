const React = require('react');
const PropTypes = require('prop-types');
const ModalsContainerContext = require('./ModalsContainerContext');

class ModalsContainerProvider extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            modalsContainer: null
        };
    }

    shouldComponentUpdate(nextProps, nextState) {
        return nextState.modalsContainer !== this.state.modalsContainer ||
            nextProps.modalsContainerClassName !== this.props.modalsContainerClassName ||
            nextProps.children !== this.props.children;
    }

    modalsContainerRef = (modalsContainer) => {
        this.setState({ modalsContainer });
    }

    render() {
        return (
            <ModalsContainerContext.Provider value={this.state.modalsContainer}>
                {this.state.modalsContainer instanceof HTMLElement ? this.props.children : null}
                <div ref={this.modalsContainerRef} className={this.props.modalsContainerClassName} />
            </ModalsContainerContext.Provider>
        );
    }
}

ModalsContainerProvider.propTypes = {
    modalsContainerClassName: PropTypes.string,
    children: PropTypes.oneOfType([
        PropTypes.arrayOf(PropTypes.node),
        PropTypes.node
    ])
};

module.exports = ModalsContainerProvider;
