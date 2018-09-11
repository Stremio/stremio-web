import React, { PureComponent } from 'react';
import { Catalogs } from 'stremio-aggregators';
import { addons } from 'stremio-services';
import { Stream } from 'stremio-common';
import { Episode } from 'stremio-common';

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
                <Episode number={2} name={'The Bing Bran Hypothesis'} duration={23} isWatched={true}></Episode>
                <Episode number={4} name={'The Luminous Fish Effect'} duration={22} lastWatched={true}></Episode>
                <Episode number={5} name={'The Dumpling Paradox'} duration={22}></Episode>
                <Episode number={8} name={'The Loobendfeld Decay'} date={'23 April'} isUpcoming={true}></Episode>
            </div>
        );
    }
}

export default Board;
