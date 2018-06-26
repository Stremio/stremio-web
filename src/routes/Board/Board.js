import React, { PureComponent } from 'react';
import { Catalogs } from 'stremio-aggregators';
import { addons } from 'stremio-services';

class Board extends PureComponent {
    constructor(props) {
        super(props);

        this.aggregator = new Catalogs(addons.addons);

        this.state = {
            catalogs: []
        };
    }

    componentDidMount() {
        this.aggregator.evs.addListener('updated', this.onCatalogsUpdated);
        this.aggregator.run();
    }

    componentWillUnmount() {
        this.aggregator.evs.removeListener('updated', this.onCatalogsUpdated);
    }

    onCatalogsUpdated = () => {
        this.setState({ catalogs: this.aggregator.results.slice() });
    }

    render() {
        return (
            <div style={{ paddingTop: 40 }}>
                You're on the Board Tab
            </div>
        );
    }
}

export default Board;
