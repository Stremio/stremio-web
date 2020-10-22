// Copyright (C) 2017-2020 Smart code 203358507

const React = require('react');
const PropTypes = require('prop-types');
const classnames = require('classnames');
const Icon = require('@stremio/stremio-icons/dom');
const { Image, MainNavBars, MetaRow, MetaItem, useDeepEqualMemo } = require('stremio/common');
const useSearch = require('./useSearch');
const styles = require('./styles');

const Search = ({ queryParams }) => {
    const search = useSearch(queryParams);
    const query = useDeepEqualMemo(() => {
        return search.selected !== null ?
            search.selected.extra.reduceRight((query, [name, value]) => {
                if (name === 'search') {
                    return value;
                }

                return query;
            }, null)
            :
            null;
    }, [search.selected]);
    return (
        <MainNavBars className={styles['search-container']} route={'search'} query={query}>
            <div className={styles['search-content']}>
                {
                    query === null ?
                        <div className={styles['search-hints-container']}>
                            <div className={styles['search-hint-container']}>
                                <Icon className={styles['icon']} icon={'ic_movies'} />
                                <div className={styles['label']}>Search for movies, series, YouTube and TV channels</div>
                            </div>
                            <div className={styles['search-hint-container']}>
                                <Icon className={styles['icon']} icon={'ic_actor'} />
                                <div className={styles['label']}>Search for actors, directors and writers</div>
                            </div>
                        </div>
                        :
                        search.catalogs.length === 0 ?
                            <div className={styles['message-container']}>
                                <Image
                                    className={styles['image']}
                                    src={'/images/empty.png'}
                                    alt={' '}
                                />
                                <div className={styles['message-label']}>No addons were requested for catalogs!</div>
                            </div>
                            :
                            search.catalogs.map((catalog, index) => {
                                const title = `${catalog.addon_name} - ${catalog.request.path.id} ${catalog.request.path.type}`;
                                switch (catalog.content.type) {
                                    case 'Ready': {
                                        const posterShape = catalog.content.content.length > 0 ?
                                            catalog.content.content[0].posterShape
                                            :
                                            null;
                                        return (
                                            <MetaRow
                                                key={index}
                                                className={classnames(styles['search-row'], styles['search-row-poster'], { [styles[`search-row-${posterShape}`]]: typeof posterShape === 'string' })}
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
                                                '';
                                        const message = `${type}${description !== null ? ` ${description}` : null}`;
                                        return (
                                            <MetaRow
                                                key={index}
                                                className={styles['search-row']}
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
                                                className={classnames(styles['search-row'], styles['search-row-poster'])}
                                                title={title}
                                                deepLinks={catalog.deepLinks}
                                            />
                                        );
                                    }
                                }
                            })
                }
            </div>
        </MainNavBars>
    );
};

Search.propTypes = {
    queryParams: PropTypes.instanceOf(URLSearchParams)
};

module.exports = Search;
