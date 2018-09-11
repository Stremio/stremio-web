import React, { PureComponent } from 'react';
import { Catalogs } from 'stremio-aggregators';
import { addons } from 'stremio-services';
import { Stream } from 'stremio-common';
import { Episode } from 'stremio-common';
import { LibraryItemList } from 'stremio-common';

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
                <LibraryItemList poster={'http://t3.gstatic.com/images?q=tbn:ANd9GcST1uigGrukMvSAVUefFNuQ0NMZAR-FjfFIwSZFCR5ZkyMSgCyj'} title={'Thor Ragnarok'} type={'Movies'} year={'2017'} dateAdded={'14.12.2017'} views={12} hours={1245} lastViewed={'14.12.2017'}></LibraryItemList>
                <LibraryItemList poster={'https://m.media-amazon.com/images/M/MV5BMTU5NDI1MjkwMF5BMl5BanBnXkFtZTgwNjIxNTY2MzI@._V1_UX182_CR0,0,182,268_AL_.jpg'} title={'Pitch Perfect 3'} type={'Series'} year={'2015'} dateAdded={'12.12.2012'} views={1} hours={1245} lastViewed={'14.12.2017'}></LibraryItemList>
                <LibraryItemList poster={'https://m.media-amazon.com/images/M/MV5BODAxNDFhNGItMzdiMC00NDM1LWExYWUtZjNiMGIzYTc0MTM5XkEyXkFqcGdeQXVyMjYzMjA3NzI@._V1_UY268_CR3,0,182,268_AL_.jpg'} title={'Deadpool'} type={'Channel'} year={'2013'} dateAdded={'12.12.2012'} views={3} hours={1245} lastViewed={'14.12.2017'}></LibraryItemList>
                <LibraryItemList poster={'https://m.media-amazon.com/images/M/MV5BNGNiNWQ5M2MtNGI0OC00MDA2LWI5NzEtMmZiYjVjMDEyOWYzXkEyXkFqcGdeQXVyMjM4NTM5NDY@._V1_.jpg'} title={'The Shape of Water'} type={'Movies'} year={'2017'} dateAdded={'12.12.2012'} views={8} hours={1245} lastViewed={'14.12.2017'}></LibraryItemList>
            </div>
        );
    }
}

export default Board;
