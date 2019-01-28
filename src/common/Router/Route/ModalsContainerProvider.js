import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { ModalsContainerContext } from 'stremio-common';

class ModalsContainerProvider extends Component {
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
                {this.state.modalsContainer ? this.props.children : null}
                <div ref={this.modalsContainerRef} className={this.props.modalsContainerClassName} />
            </ModalsContainerContext.Provider>
        );
    }
}

ModalsContainerProvider.propTypes = {
    modalsContainerClassName: PropTypes.string
};

export default ModalsContainerProvider;
