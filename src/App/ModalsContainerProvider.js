import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { ModalsContainerContext } from 'stremio-common';

class ModalsContainerProvider extends Component {
    constructor(props) {
        super(props);

        this.modalsContainerRef = React.createRef();
    }

    shouldComponentUpdate(nextProps, nextState) {
        return nextProps.children !== this.props.children ||
            nextProps.modalsContainerClassName !== this.props.modalsContainerClassName;
    }

    componentDidMount() {
        this.forceUpdate();
    }

    render() {
        return (
            <ModalsContainerContext.Provider value={this.modalsContainerRef.current}>
                {this.props.children}
                <div ref={this.modalsContainerRef} className={this.props.modalsContainerClassName} />
            </ModalsContainerContext.Provider>
        );
    }
}

ModalsContainerProvider.propTypes = {
    modalsContainerClassName: PropTypes.string
};

export default ModalsContainerProvider;
