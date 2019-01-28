import React, { Component } from 'react';
import ModalsContainerProvider from './ModalsContainerProvider';
import RouteFocusableProvider from './RouteFocusableProvider';
import styles from './styles';

class Route extends Component {
    shouldComponentUpdate(nextProps, nextState) {
        return nextProps.children !== this.props.children;
    }

    render() {
        return (
            <div className={styles['route']}>
                <ModalsContainerProvider modalsContainerClassName={styles['modals-container']}>
                    <RouteFocusableProvider>
                        <div className={styles['route-content']}>
                            {this.props.children}
                        </div>
                    </RouteFocusableProvider>
                </ModalsContainerProvider>
            </div>
        );
    }
}

export default Route;
