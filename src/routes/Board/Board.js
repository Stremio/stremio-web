const React = require('react');
const classnames = require('classnames');
const { MainNavBar, placeholderStyles } = require('stremio/common');
const BoardRow = require('./BoardRow');
const BoardRowPlaceholder = require('./BoardRowPlaceholder');
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
                {catalogs.map(([request, response], index) => {
                    switch (response.type) {
                        case 'Ready':
                            return (
                                <BoardRow
                                    key={`${index}${request.transport_url}${response.type}`}
                                    className={'board-row'}
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
                                    className={'board-row'}
                                    title={`${request.resource_ref.id} - ${request.resource_ref.type_name}`}
                                    message={response.content}
                                />
                            );
                        case 'Loading':
                            return (
                                <BoardRowPlaceholder
                                    key={`${index}${request.transport_url}${response.type}`}
                                    className={classnames('board-row-placeholder', placeholderStyles['placeholder-container'])}
                                />
                            );
                    }
                })}
            </div>
        </div>
    );
};

module.exports = Board;
