// Copyright (C) 2017-2020 Smart code 203358507

const React = require('react');
const classnames = require('classnames');
const { MainNavBars, MetaRow, LibItem, MetaItem } = require('stremio/common');
const useBoard = require('./useBoard');
const useContinueWatchingPreview = require('./useContinueWatchingPreview');
const styles = require('./styles');

const Board = () => {
    const board = useBoard();
    const continueWatchingPreview = useContinueWatchingPreview();
    return (
        <MainNavBars className={styles['board-container']} route={'board'}>
            <div className={styles['board-content']}>
                {
                    continueWatchingPreview.libraryItems.length > 0 ?
                        <MetaRow
                            className={classnames(styles['board-row'], styles['continue-watching-row'])}
                            title={'Continue Watching'}
                            items={continueWatchingPreview.libraryItems}
                            itemComponent={LibItem}
                            deepLinks={continueWatchingPreview.deepLinks}
                        />
                        :
                        null
                }
                {board.catalogs.map((catalog, index) => {
                    const title = `${catalog.addonName} - ${catalog.request.path.id} ${catalog.request.path.type}`;
                    switch (catalog.content.type) {
                        case 'Ready': {
                            const posterShape = catalog.content.content.length > 0 ?
                                catalog.content.content[0].posterShape
                                :
                                '';
                            return (
                                <MetaRow
                                    key={index}
                                    className={classnames(styles['board-row'], styles['board-row-poster'], { [styles[`board-row-${posterShape}`]]: typeof posterShape === 'string' })}
                                    title={title}
                                    items={catalog.content.content}
                                    itemComponent={MetaItem}
                                    deepLinks={catalog.deepLinks}
                                />
                            );
                        }
                        case 'Err': {
                            const type = `Error(${catalog.content.content.type})`;
                            const description = catalog.content.content.type === 'UnexpectedResponse' ?
                                catalog.content.content.content
                                :
                                catalog.content.content.type === 'Env' ?
                                    catalog.content.content.content.message
                                    :
                                    null;
                            const message = `${type}${description !== null ? ` ${description}` : null}`;
                            return (
                                <MetaRow
                                    key={index}
                                    className={styles['board-row']}
                                    title={title}
                                    message={message}
                                    deepLinks={catalog.deepLinks}
                                />
                            );
                        }
                        case 'Loading': {
                            return (
                                <MetaRow.Placeholder
                                    key={index}
                                    className={classnames(styles['board-row'], styles['board-row-poster'])}
                                    title={title}
                                    deepLinks={catalog.deepLinks}
                                />
                            );
                        }
                    }
                })}
            </div>
        </MainNavBars>
    );
};

module.exports = Board;
