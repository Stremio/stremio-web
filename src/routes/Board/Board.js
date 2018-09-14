import React, { PureComponent } from 'react';
import { Catalogs } from 'stremio-aggregators';
import { addons } from 'stremio-services';
import { Stream } from 'stremio-common';
import { Episode } from 'stremio-common';
import { LibraryItemList } from 'stremio-common';
import { LibraryItemGrid } from 'stremio-common';
import { Addon } from 'stremio-common';

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
                <Addon logo={'ic_series'} name={'Watch Hub'} version={'1.3.0'} isInstalled={false} types={['Movies', 'Series']} description={'Find where to stream your favourite movies and shows amongst iTunes, Hulu, Amazon and other UK/US services.'} urls={['http://nfxaddon.strem.io/stremioget', 'http://127.0.0.1:11470/addons/com.stremio.subtitles/stremioget', 'http://127.0.0.1:11470/addons/com.stremio.localfiles/stremioget']}></Addon>
                <Addon name={'Cinemeta'} version={'2.4.0'} isInstalled={true} types={['Movies', 'Series']} description={'Watch your favourite YouTube channels ad-free and get notified when they upload new videos.'} urls={['https://channels.strem.io/stremioget/stremio/v1', 'https://channels.strem.io/stremioget/stremio/v1']}></Addon>
                <Addon logo={'ic_youtube_small'} name={'YouTube'} version={'1.3.0'} isInstalled={true} types={['Channels', 'Videos']} description={'Watch your favourite YouTube channels ad-free and get notified when they upload new videos.'} urls={['https://channels.strem.io/stremioget/stremio/v1', 'https://channels.strem.io/stremioget/stremio/v1']}></Addon>
                <Addon name={'OpenSubtitles'} version={'1.3.0'} isInstalled={false} types={['Movies', 'Series']} description={'Watch your favourite YouTube channels ad-free and get notified when they upload new videos.'} urls={['https://channels.strem.io/stremioget/stremio/v1', 'https://channels.strem.io/stremioget/stremio/v1', 'http://127.0.0.1:11470/addons/com.stremio.subtitles/stremioget', 'https://channels.strem.io/stremioget/stremio/v1']}></Addon>
            </div>
        );
    }
}

export default Board;
