const React = require('react');
const PropTypes = require('prop-types');
const Icon = require('stremio-icons/dom');
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
                    search.selected === null || search.selected.extra.every(([name]) => name !== 'search') ?
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
                        search.catalog_resources.length === 0 ?
                            <div className={styles['message-container']}>
                                <Image
                                    className={styles['image']}
                                    src={'/images/empty.png'}
                                    alt={' '}
                                />
                                <div className={styles['message-label']}>No addons were requested for catalogs!</div>
                            </div>
                            :
                            search.catalog_resources.map((catalog_resource, index) => {
                                const queryString = new URLSearchParams([['search', query]]).toString();
                                const href = `#/discover/${encodeURIComponent(catalog_resource.request.base)}/${encodeURIComponent(catalog_resource.request.path.type_name)}/${encodeURIComponent(catalog_resource.request.path.id)}?${queryString}`;
                                const title = `${catalog_resource.origin} - ${catalog_resource.request.path.id} ${catalog_resource.request.path.type_name}`;
                                switch (catalog_resource.content.type) {
                                    case 'Ready': {
                                        return (
                                            <MetaRow
                                                key={index}
                                                className={styles['search-row']}
                                                title={title}
                                                items={catalog_resource.content.content}
                                                itemComponent={MetaItem}
                                                href={href}
                                            />
                                        );
                                    }
                                    case 'Err': {
                                        const message = `Error(${catalog_resource.content.content.type})${typeof catalog_resource.content.content.content === 'string' ? ` - ${catalog_resource.content.content.content}` : ''}`;
                                        return (
                                            <MetaRow
                                                key={index}
                                                className={styles['search-row']}
                                                title={title}
                                                message={message}
                                                href={href}
                                            />
                                        );
                                    }
                                    case 'Loading': {
                                        return (
                                            <MetaRow.Placeholder
                                                key={index}
                                                className={styles['search-row']}
                                                title={title}
                                                href={href}
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
