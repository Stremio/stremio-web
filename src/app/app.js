import React, { Component } from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import { Checkbox } from 'stremio-common';
import Icon from 'stremio-icons/dom'

class App extends Component {
    render() {
        return (
            <BrowserRouter>
                <div>
                    <Checkbox checked={true} />
                    <Icon
                        style={{width: 100, height: 100}}
                        icon={'ic_pause'}
                        fill={'yellow'}
                    />
                    <Route path={'/home/:message'} component={({ match }) => <span>{match.params.message}</span>} />
                </div>
            </BrowserRouter>
        );
    }
}

export default App;
