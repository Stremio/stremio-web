const React = require('react');
const ModalsContainerContext = require('../ModalsContainerContext');
const styles = require('./styles');

class ModalsContainerProvider extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            modalsContainer: null
        };
    }

    shouldComponentUpdate(nextProps, nextState) {
        return nextState.modalsContainer !== this.state.modalsContainer ||
            nextProps.children !== this.props.children;
    }

    modalsContainerRef = (modalsContainer) => {
        this.setState({ modalsContainer });
    }

    render() {
        return (
            <ModalsContainerContext.Provider value={this.state.modalsContainer}>
                {this.state.modalsContainer instanceof HTMLElement ? this.props.children : null}
                <div ref={this.modalsContainerRef} className={styles['modals-container']} />
            </ModalsContainerContext.Provider>
        );
    }
}

module.exports = ModalsContainerProvider;
