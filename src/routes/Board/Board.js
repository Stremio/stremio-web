// Copyright (C) 2017-2020 Smart code 203358507

const React = require('react');
const classnames = require('classnames');
const { MainNavBars, MetaRow, LibItem, MetaItem, ServerWarning } = require('stremio/common');
const useBoard = require('./useBoard');
const useProfile = require('stremio/common/useProfile');
const useContinueWatchingPreview = require('./useContinueWatchingPreview');
const styles = require('./styles');

const Board = () => {
    const board = useBoard();
    const profile = useProfile();
    const continueWatchingPreview = useContinueWatchingPreview();
    return (
        <div className={styles['board-container']}>
            <MainNavBars className={styles['board-content-container']} route={'board'}>
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
                        switch (catalog.content.type) {
                            case 'Ready': {
                                return (
                                    <MetaRow
                                        key={index}
                                        className={classnames(styles['board-row'], styles[`board-row-${catalog.content.content[0].posterShape}`])}
                                        title={catalog.title}
                                        items={catalog.content.content}
                                        itemComponent={MetaItem}
                                        deepLinks={catalog.deepLinks}
                                    />
                                );
                            }
                            case 'Err': {
                                return (
                                    <MetaRow
                                        key={index}
                                        className={styles['board-row']}
                                        title={catalog.title}
                                        message={catalog.content.content}
                                        deepLinks={catalog.deepLinks}
                                    />
                                );
                            }
                            case 'Loading': {
                                return (
                                    <MetaRow.Placeholder
                                        key={index}
                                        className={classnames(styles['board-row'], styles['board-row-poster'])}
                                        title={catalog.title}
                                        deepLinks={catalog.deepLinks}
                                    />
                                );
                            }
                        }
                    })}
                </div>
            </MainNavBars>
            {
                new Date(profile.settings.streamingServerWarningDismissed).getTime() > Date.now() ?
                    <ServerWarning className={styles['board-warning-container']} />
                    :
                    null
            }
        </div>
    );
};

module.exports = Board;
