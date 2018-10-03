import React, { PureComponent } from 'react';
import { Catalogs } from 'stremio-aggregators';
import { addons } from 'stremio-services';
import { Stream } from 'stremio-common';
import { Video } from 'stremio-common';
import { LibraryItemList } from 'stremio-common';
import { LibraryItemGrid } from 'stremio-common';
import { Addon } from 'stremio-common';
import { ShareAddon } from 'stremio-common';
import { UserPanel } from 'stremio-common';

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
                <UserPanel photo={'https://image.freepik.com/free-vector/wild-animals-cartoon_1196-361.jpg'} email={'animals@mail.com'}></UserPanel>
            </div>
        );
    }
}

export default Board;
