import React, { Component } from 'react';
import { Checkbox } from 'stremio-common';

class App extends Component {
    render() {
        return (
            <div>
                <span>Stremio</span>
                <Checkbox checked={true} />
            </div>
        );
    }
}

export default App;
