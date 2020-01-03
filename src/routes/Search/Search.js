const React = require('react');
const PropTypes = require('prop-types');
const Icon = require('stremio-icons/dom');
const { HorizontalNavBar, MainVerticalNavBar, MetaRow } = require('stremio/common');
const useSearch = require('./useSearch');
const styles = require('./styles');

const Search = ({ queryParams }) => {
    const search = useSearch(queryParams);
    return (
        <div className={styles['search-container']}>
            <HorizontalNavBar
                className={styles['horizontal-nav-bar']}
                route={'search'}
                query={
                    search.selected !== null ?
                        search.selected.extra.reduce((query, [name, value]) => {
                            if (name === 'search') {
                                return value;
                            }

                            return query;
                        }, null)
                        :
                        null
                }
                backButton={false}
                searchBar={true}
                addonsButton={true}
                fullscreenButton={true}
                notificationsMenu={true}
                navMenu={true}
            />
            <div className={styles['search-content-container']}>
                <MainVerticalNavBar className={styles['nav-bar']} route={'search'} />
                <div className={styles['search-content']}>
                    {
                        search.selected === null || search.selected.extra.every(([name]) => name !== 'search') ?
                            <div className={styles['message-container']}>
                                <div className={styles['message-content']}>
                                    <Icon className={styles['icon']} icon={'ic_movies'} />
                                    <div className={styles['label']}>Search for movies, series, YouTube and TV channels</div>
                                </div>
                                <div className={styles['message-content']}>
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
            </div>
        </div>
    );
};

Search.propTypes = {
    queryParams: PropTypes.instanceOf(URLSearchParams)
};

module.exports = Search;
