import React, { Component } from 'react';
import { FocusableProvider } from 'stremio-common';
import ModalsContainerProvider from '../../Modal/ModalsContainerProvider';
import styles from './styles';

class Route extends Component {
    shouldComponentUpdate(nextProps, nextState) {
        return nextProps.children !== this.props.children;
    }

    onModalsContainerDomTreeChange = ({ modalsContainerElement }) => {
        return modalsContainerElement.childElementCount === 0;
    }

    render() {
        return (
            <div className={styles['route']}>
                <ModalsContainerProvider>
                    <FocusableProvider onModalsContainerDomTreeChange={this.onModalsContainerDomTreeChange}>
                        <div className={styles['route-content']}>
                            {this.props.children}
                        </div>
                    </FocusableProvider>
                </ModalsContainerProvider>
            </div>
        );
    }
}

export default Route;
