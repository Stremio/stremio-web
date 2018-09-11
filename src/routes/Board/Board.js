import React, { PureComponent } from 'react';
import { Catalogs } from 'stremio-aggregators';
import { addons } from 'stremio-services';
import { Stream } from 'stremio-common';

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
                <Stream sourceName={'Amazon'} title={'Vikings S01E09 HDTV XviD-AFG[ettv], 👤 1'} lastWatched={true}/>
                <Stream sourceName={'iTunes'} subtitle={'Aasdasd dsasa sad.'}/>
                <Stream logo={'ic_itunes'} title={'$1.99 purchase SD,$2.99 purchase HD'} lastWatched={true}/>
                <Stream logo={'ic_amazon'} title={'HDTV'} isFree={true}/>
                <Stream sourceName={'Amazon'} title={'SD'} isSubscription={true}/>
            </div>
        );
    }
}

export default Board;
