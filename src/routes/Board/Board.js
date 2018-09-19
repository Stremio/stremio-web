import React, { PureComponent } from 'react';
import { Catalogs } from 'stremio-aggregators';
import { addons } from 'stremio-services';
import { Stream } from 'stremio-common';
import { Episode } from 'stremio-common';
import { LibraryItemList } from 'stremio-common';
import { LibraryItemGrid } from 'stremio-common';
import { Addon } from 'stremio-common';
import { ShareAddon } from 'stremio-common';

class Board extends PureComponent {
    constructor(props) {
        super(props);

        // this.aggregator = new Catalogs(addons.addons);

        this.state = {
            catalogs: []
        };
    }

    componentDidMount() {
        // this.aggregator.evs.addListener('updated', this.onCatalogsUpdated);
        // this.aggregator.run();
    }

    componentWillUnmount() {
        // this.aggregator.evs.removeListener('updated', this.onCatalogsUpdated);
    }

    onCatalogsUpdated = () => {
        // this.setState({ catalogs: this.aggregator.results.slice() });
    }

    render() {
        return (
            <div style={{ paddingTop: 40, color: 'yellow' }}>
                <ShareAddon url={'http://nfxaddon.strem.io/stremioget'}></ShareAddon>
            </div>
        );
    }
}

export default Board;
