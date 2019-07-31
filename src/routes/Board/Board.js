const React = require('react');
const { MainNavBar } = require('stremio/common');
const BoardRow = require('./BoardRow');
const useCatalogs = require('./useCatalogs');
require('./styles');

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
        <div className={'board-container'}>
            <MainNavBar className={'nav-bar'} />
            <div className={'board-content'}>
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
                                className={'board-row'}
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
