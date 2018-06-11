import React, { Component } from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import { Checkbox } from 'stremio-common';

class App extends Component {
    render() {
        return (
            <BrowserRouter>
                <div>
                    <Checkbox checked={true} />
                    <Route path={'/home/:message'} component={({ match }) => <span>{match.params.message}</span>} />
                </div>
            </BrowserRouter>
        );
    }
}

export default App;
