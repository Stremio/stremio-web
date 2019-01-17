import React, { PureComponent } from 'react';
import { Catalogs } from 'stremio-aggregators';
import { addons } from 'stremio-services';
import { Stream } from 'stremio-common';
import { Video } from 'stremio-common';
import { LibraryItemList } from 'stremio-common';
import { MetaItem } from 'stremio-common';
import { Addon } from 'stremio-common';
import { ShareAddon } from 'stremio-common';
import { UserPanel } from 'stremio-common';
import NavBar from '../../common/NavBar/NavBar';

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
                <NavBar
                    userNotifications={true}
                    userMenu={true}
                />
            </div>
        );
    }
}

export default Board;
