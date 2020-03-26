const React = require('react');
const PropTypes = require('prop-types');
const Icon = require('stremio-icons/dom');
const { MainNavBars, MetaRow, useDeepEqualMemo } = require('stremio/common');
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
                                <div className={styles['message-content']}>
                                    <div className={styles['label']}> No addons were requested for catalogs</div>
                                </div>
                            </div>
                            :
                            search.catalog_resources.map((catalog_resource, index) => {
                                switch (catalog_resource.content.type) {
                                    case 'Ready':
                                        return (
                                            <MetaRow
                                                key={index}
                                                className={styles['search-row']}
                                                title={catalog_resource.addon_name}
                                                items={catalog_resource.content.content}
                                                href={catalog_resource.href}
                                                limit={10}
                                            />
                                        );
                                    case 'Err':
                                        return (
                                            <MetaRow
                                                key={index}
                                                className={styles['search-row']}
                                                title={catalog_resource.addon_name}
                                                message={`Error(${catalog_resource.content.content.type})${typeof catalog_resource.content.content.content === 'string' ? ` - ${catalog_resource.content.content.content}` : ''}`}
                                                limit={10}
                                            />
                                        );
                                    case 'Loading':
                                        return (
                                            <MetaRow.Placeholder
                                                key={index}
                                                className={styles['search-row-placeholder']}
                                                title={catalog_resource.addon_name}
                                                limit={10}
                                            />
                                        );
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
