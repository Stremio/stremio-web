const React = require('react');
const classnames = require('classnames');
const { MainNavBar, placeholderStyles } = require('stremio/common');
const BoardRow = require('./BoardRow');
const BoardRowPlaceholder = require('./BoardRowPlaceholder');
const useCatalogs = require('./useCatalogs');
const styles = require('./styles');

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

const Board = () => {
    const catalogs = useCatalogs();
    return (
        <div className={styles['board-container']}>
            <MainNavBar className={styles['nav-bar']} />
            <div className={styles['board-content']}>
                {catalogs.map(([request, response], index) => {
                    switch (response.type) {
                        case 'Ready':
                            return (
                                <BoardRow
                                    key={`${index}${request.transport_url}${response.type}`}
                                    className={styles['board-row']}
                                    title={`${request.resource_ref.id} - ${request.resource_ref.type_name}`}
                                    items={response.content.map((item) => ({
                                        ...item,
                                        posterShape: item.posterShape || 'poster'
                                    }))}
                                />
                            );
                        case 'Message':
                            return (
                                <BoardRow
                                    key={`${index}${request.transport_url}${response.type}`}
                                    className={styles['board-row']}
                                    title={`${request.resource_ref.id} - ${request.resource_ref.type_name}`}
                                    message={response.content}
                                />
                            );
                        case 'Loading':
                            return (
                                <BoardRowPlaceholder
                                    key={`${index}${request.transport_url}${response.type}`}
                                    className={classnames(styles['board-row-placeholder'], placeholderStyles['placeholder-container'])}
                                />
                            );
                    }
                })}
            </div>
        </div>
    );
};

module.exports = Board;
