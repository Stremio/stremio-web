const React = require('react');
const { MainNavBar } = require('stremio/common');
const BoardRow = require('./BoardRow');
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
                {
                    catalogs
                        .filter(([_, response]) => response.type === 'Ready')
                        .map(([request, response]) => [
                            request,
                            {
                                ...response,
                                content: response.content.map((item) => ({
                                    ...item,
                                    posterShape: item.posterShape || 'poster'
                                }))
                            }
                        ])
                        .map(([request, response], index) => (
                            <BoardRow
                                key={`${index}${request.transport_url}`}
                                className={styles['addon-catalog-row']}
                                title={`${request.resource_ref.id} - ${request.resource_ref.type_name}`}
                                items={response.content}
                            />
                        ))
                }
            </div>
        </div>
    );
};

module.exports = Board;
