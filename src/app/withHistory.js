import React from 'react';
import HistoryContext from './historyContext';

const withHistory = (Component) => {
    return function WithHistory(props) {
        return (
            <HistoryContext.Consumer>
                {context => <Component {...props} {...context} />}
            </HistoryContext.Consumer>
        );
    };
};

export default withHistory;
