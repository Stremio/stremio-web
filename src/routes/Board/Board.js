import React, { PureComponent } from 'react';
import classnames from 'classnames';
import { MetaItem } from 'stremio-common';
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
            continueWatchingItems: [
                {
                    id: '0',
                    type: 'movie',
                    posterShape: 'poster',
                    title: 'Movie title',
                    progress: 0.7
                },
                {
                    id: '1',
                    type: 'movie',
                    posterShape: 'poster',
                    title: 'Movie title',
                    progress: 0.2
                },
                {
                    id: '3',
                    type: 'movie',
                    poster: 'https://www.stremio.com/website/home-stremio.png',
                    posterShape: 'poster',
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
                    posterShape: 'square',
                    title: 'Movie title',
                    progress: 1
                }
            ],
            addonCatalogItems: [
                {
                    id: '01',
                    type: 'movie',
                    posterShape: 'landscape',
                    title: 'Movie title'
                },
                {
                    id: '02',
                    type: 'movie',
                    posterShape: 'landscape',
                    title: 'Movie title',
                    subtitle: 'Movie subtitle'
                },
            ]
        };
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

    render() {
        return (
            <div className={styles['board-container']}>
                <div className={classnames(styles['board-row'], styles['continue-watching-row'])}>
                    {this.items.continueWatchingItems.map((props) => (
                        <MetaItem
                            key={props.id}
                            className={styles['meta-item']}
                            popupClassName={styles['meta-item-popup-container']}
                            relativeSide={'height'}
                            menuOptions={CONTINUE_WATCHING_MENU}
                            onClick={this.onClick}
                            menuOptionOnSelect={this.menuOptionOnSelect}
                            {...props}
                        />
                    ))}
                </div>
                <div className={classnames(styles['board-row'], styles['notificatins-row'])}>
                    {this.items.addonCatalogItems.map((props) => (
                        <MetaItem
                            key={props.id}
                            className={styles['meta-item']}
                            onClick={this.onClick}
                            {...props}
                        />
                    ))}
                </div>
            </div>
        );
    }
}

export default Board;
