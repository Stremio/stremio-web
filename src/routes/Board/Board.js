import React, { PureComponent } from 'react';
import { Catalogs } from 'stremio-aggregators';
import { addons } from 'stremio-services';
import { Stream } from 'stremio-common';
import { Episode } from 'stremio-common';
import { LibraryItemList } from 'stremio-common';
import { LibraryItemGrid } from 'stremio-common';

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
                <LibraryItemGrid poster={'https://m.media-amazon.com/images/M/MV5BODQ0NDhjYWItYTMxZi00NTk2LWIzNDEtOWZiYWYxZjc2MTgxXkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_.jpg'}></LibraryItemGrid>
                <LibraryItemGrid poster={'https://m.media-amazon.com/images/M/MV5BMTk2Mjc2NzYxNl5BMl5BanBnXkFtZTgwMTA2OTA1NDM@._V1_.jpg'}></LibraryItemGrid>
                <LibraryItemGrid poster={'https://m.media-amazon.com/images/M/MV5BMTA3MDkxOTc4NDdeQTJeQWpwZ15BbWU4MDAxNzgyNTQz._V1_.jpg'}></LibraryItemGrid>
                <LibraryItemGrid poster={'https://m.media-amazon.com/images/M/MV5BYWVhZjZkYTItOGIwYS00NmRkLWJlYjctMWM0ZjFmMDU4ZjEzXkEyXkFqcGdeQXVyMTMxODk2OTU@._V1_UX182_CR0,0,182,268_AL_.jpg'}></LibraryItemGrid>
                <LibraryItemGrid poster={'https://m.media-amazon.com/images/M/MV5BYjQ5NjM0Y2YtNjZkNC00ZDhkLWJjMWItN2QyNzFkMDE3ZjAxXkEyXkFqcGdeQXVyODIxMzk5NjA@._V1_UY268_CR3,0,182,268_AL_.jpg'}></LibraryItemGrid>
                <LibraryItemGrid poster={'https://m.media-amazon.com/images/M/MV5BMjMyNDkzMzI1OF5BMl5BanBnXkFtZTgwODcxODg5MjI@._V1_.jpg'}></LibraryItemGrid>
                <LibraryItemGrid poster={'https://m.media-amazon.com/images/M/MV5BMTU5NDI1MjkwMF5BMl5BanBnXkFtZTgwNjIxNTY2MzI@._V1_UX182_CR0,0,182,268_AL_.jpg'}></LibraryItemGrid>
                <LibraryItemGrid poster={'https://m.media-amazon.com/images/M/MV5BODAxNDFhNGItMzdiMC00NDM1LWExYWUtZjNiMGIzYTc0MTM5XkEyXkFqcGdeQXVyMjYzMjA3NzI@._V1_UY268_CR3,0,182,268_AL_.jpg'}></LibraryItemGrid>
                <LibraryItemGrid poster={'https://m.media-amazon.com/images/M/MV5BNGNiNWQ5M2MtNGI0OC00MDA2LWI5NzEtMmZiYjVjMDEyOWYzXkEyXkFqcGdeQXVyMjM4NTM5NDY@._V1_.jpg'}></LibraryItemGrid>
                <LibraryItemGrid poster={'https://m.media-amazon.com/images/M/MV5BNjFhZjM4ZDYtMGRjYi00Yzc2LWExYmEtMDQ3NzA4ODU4YTljXkEyXkFqcGdeQXVyNjkwMzU3NDI@._V1_UX182_CR0,0,182,268_AL_.jpg'}></LibraryItemGrid>
            </div>
        );
    }
}

export default Board;
