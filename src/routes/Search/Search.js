// Copyright (C) 2017-2020 Smart code 203358507

const React = require('react');
const PropTypes = require('prop-types');
const classnames = require('classnames');
const debounce = require('lodash.debounce');
const Icon = require('@stremio/stremio-icons/dom');
const { useServices } = require('stremio/services');
const { Image, MainNavBars, MetaRow, MetaItem, useDeepEqualMemo } = require('stremio/common');
const useSearch = require('./useSearch');
const styles = require('./styles');

const Search = ({ queryParams }) => {
    const { core } = useServices();
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
    const debounceAnanlytics = debounce((query, search) => {
        if (query !== null) {
            const responses_count = search.catalogs.filter((catalog) => catalog.content.type === 'Ready').length;
            core.transport.analytics({
                event: 'Search',
                args: {
                    query, responses_count
                }
            });
        }
    }, 500, { leading: false });
    React.useEffect(() => { debounceAnanlytics(query, search); }, [search]);
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
                                    src={require('/images/empty.png')}
                                    alt={' '}
                                />
                                <div className={styles['message-label']}>No addons were requested for catalogs!</div>
                            </div>
                            :
                            search.catalogs.map((catalog, index) => {
                                switch (catalog.content.type) {
                                    case 'Ready': {
                                        return (
                                            <MetaRow
                                                key={index}
                                                className={classnames(styles['search-row'], styles[`search-row-${catalog.content.content[0].posterShape}`])}
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
                                                className={styles['search-row']}
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
                                                className={classnames(styles['search-row'], styles['search-row-poster'])}
                                                title={catalog.title}
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
