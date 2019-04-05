import React, { Component } from 'react';
import { ModalsContainerContext } from 'stremio-common';
import styles from './styles';

class ModalsContainerProvider extends Component {
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
                {this.state.modalsContainer ? this.props.children : null}
                <div ref={this.modalsContainerRef} className={styles['modals-container']} />
            </ModalsContainerContext.Provider>
        );
    }
}

export default ModalsContainerProvider;
