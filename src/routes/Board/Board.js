import React, { PureComponent } from 'react';
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
            cw: [
                {
                    id: 'cw1',
                    posterShape: 'poster',
                    type: 'movie',
                    progress: 0.4,
                    title: 'Movie title'
                }
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
                <div className={styles['continue-watching-row']}>
                    {this.items.cw.map((props) => (
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
            </div>
        );
    }
}

export default Board;
