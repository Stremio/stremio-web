import React, { PureComponent, Fragment } from 'react';
import classnames from 'classnames';
import { MetaItem, Input } from 'stremio-common';
import styles from './styles';

const CONTINUE_WATCHING_MENU = [
    {
        label: 'Play',
        type: 'play'
    },
    {
        label: 'Dismiss',
        type: 'dismiss'
    }
];

class Board extends PureComponent {
    constructor(props) {
        super(props);

        this.items = {
            addonCatalogItems2: [
                {
                    id: '0',
                    type: 'movie',
                    posterShape: 'poster',
                    poster: 'qwe',
                    title: 'Movie title',
                    progress: 0.7
                },
                {
                    id: '120',
                    type: 'movie',
                    posterShape: 'square',
                    poster: 'qwe',
                    title: 'Movie title',
                    progress: 0.7
                },
                {
                    id: '03',
                    type: 'movie',
                    posterShape: 'poster',
                    poster: 'qwe',
                    title: 'Movie title',
                    progress: 0.7
                },
                {
                    id: '40',
                    type: 'movie',
                    posterShape: 'poster',
                    poster: 'qwe',
                    title: 'Movie title',
                    progress: 0.7
                },
                {
                    id: '05',
                    type: 'movie',
                    posterShape: 'poster',
                    poster: 'qwe',
                    title: 'Movie title',
                    progress: 0.7
                },
                {
                    id: '055',
                    type: 'movie',
                    posterShape: 'poster',
                    poster: 'qwe',
                    title: 'Movie title',
                    progress: 0.7
                },
                {
                    id: '058',
                    type: 'movie',
                    posterShape: 'poster',
                    poster: 'qwe',
                    title: 'Movie title',
                    progress: 0.7
                },
            ],
            continueWatchingItems: [
                {
                    id: '0',
                    type: 'movie',
                    posterShape: 'poster',
                    poster: 'https://i.ytimg.com/vi/97AUCrEgTj0/hqdefault.jpg',
                    title: 'Movie title',
                    progress: 0.7
                },
                {
                    id: '1',
                    type: 'movie',
                    posterShape: 'square',
                    title: 'Movie title',
                    progress: 0.2
                },
                {
                    id: '3',
                    type: 'movie',
                    poster: 'https://www.stremio.com/website/home-testimonials.jpg',
                    posterShape: 'square',
                    title: 'Movie title',
                    progress: 0.4
                },
                {
                    id: '4',
                    type: 'movie',
                    poster: 'https://blog.stremio.com/wp-content/uploads/2018/11/product-post-360x240.jpg',
                    posterShape: 'poster',
                    title: 'Movie title',
                    progress: 122
                },
                {
                    id: '5',
                    type: 'channel',
                    posterShape: 'poster',
                    title: 'Movie title',
                    progress: 1
                },
                {
                    id: '6',
                    type: 'channel',
                    posterShape: 'poster',
                    title: 'Movie title',
                    progress: 0.1
                }
            ]
        };

        this.state = {
            isLoaded: true
        }
    }

    onClick = (event) => {
        console.log('onClick', {
            id: event.currentTarget.dataset.metaItemId,
            defaultPrevented: event.isDefaultPrevented(),
            propagationStopped: event.isPropagationStopped()
        });
    }

    menuOptionOnSelect = (event) => {
        console.log('menuOptionOnSelect', {
            id: event.currentTarget.dataset.metaItemId,
            type: event.currentTarget.dataset.menuOptionType,
            defaultPrevented: event.isDefaultPrevented(),
            propagationStopped: event.isPropagationStopped()
        });
    }

    renderMetaItemPlaceholders() {
        const metaItemPlaceholders = [];
        for (let placeholderNumber = 0; placeholderNumber < 20; placeholderNumber++) {
            metaItemPlaceholders.push(
                <div key={placeholderNumber} className={styles['placeholder']}>
                    <div className={styles['poster-image-placeholder']}>
                        <div className={styles['poster']} />
                    </div>
                    <div className={styles['title-bar-placeholder']} />
                </div>
            )
        }

        return (
            <div className={styles['placeholder-container']}>
                {metaItemPlaceholders}
            </div>
        );
    }

    render() {
        return (
            <div className={styles['board-container']}>
                {
                    this.state.isLoaded ?
                        this.renderMetaItemPlaceholders()
                        :
                        <Fragment>
                            <div className={classnames(styles['board-row'], styles['continue-watching-row'])}>
                                <div className={styles['meta-items-container']}>
                                    {this.items.continueWatchingItems.map((item) => (
                                        <MetaItem
                                            {...item}
                                            key={item.id}
                                            className={classnames(styles['meta-item'], styles[`poster-shape-${item.posterShape === 'landscape' ? 'square' : item.posterShape}`])}
                                            popupClassName={styles['meta-item-popup-container']}
                                            posterShape={item.posterShape === 'landscape' ? 'square' : item.posterShape}
                                            menuOptions={CONTINUE_WATCHING_MENU}
                                            menuOptionOnSelect={this.menuOptionOnSelect}
                                            onClick={this.onClick}
                                        />
                                    ))}
                                </div>
                                <Input className={styles['show-more-container']} type={'button'} />
                            </div>
                            <div className={classnames(styles['board-row'], styles['addon-catalog-row'])}>
                                <div className={styles['meta-items-container']}>
                                    {this.items.addonCatalogItems2.map((item, _, metaItems) => (
                                        <MetaItem
                                            {...item}
                                            key={item.id}
                                            className={classnames(styles['meta-item'], styles[`poster-shape-${metaItems[0].posterShape}`])}
                                            posterShape={metaItems[0].posterShape}
                                            progress={0}
                                            onClick={this.onClick}
                                        />
                                    ))}
                                </div>
                                <Input className={styles['show-more-container']} type={'button'} />
                            </div>
                        </Fragment>
                }
            </div>
        );
    }
}

export default Board;
