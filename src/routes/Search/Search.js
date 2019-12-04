const React = require('react');
const Icon = require('stremio-icons/dom');
const { MainNavBar, MetaRow } = require('stremio/common');
const useSearch = require('./useSearch');
const styles = require('./styles');

const Search = ({ queryParams }) => {
    const { selected, catalog_resources } = useSearch(queryParams);
    return (
        <div className={styles['search-container']}>
            <MainNavBar className={styles['nav-bar']} />
            <div className={styles['search-content']}>
                {
                    selected === null || selected.extra.every(([name]) => name !== 'search') ?
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
                        catalog_resources.length === 0 ?
                            <div className={styles['message-container']}>
                                <div className={styles['message-content']}>
                                    <div className={styles['label']}> No addons were requested for catalogs</div>
                                </div>
                            </div>
                            :
                            catalog_resources.map((catalog, index) => {
                                switch (catalog.content.type) {
                                    case 'Ready':
                                        return (
                                            <MetaRow
                                                key={index}
                                                className={styles['search-row']}
                                                title={catalog.addon_name}
                                                items={catalog.content.content}
                                                href={catalog.href}
                                                limit={10}
                                            />
                                        );
                                    case 'Err':
                                        return (
                                            <MetaRow
                                                key={index}
                                                className={styles['search-row']}
                                                title={catalog.addon_name}
                                                message={`Error(${catalog.content.content.type})${typeof catalog.content.content.content === 'string' ? ` - ${catalog.content.content.content}` : ''}`}
                                                limit={10}
                                            />
                                        );
                                    case 'Loading':
                                        return (
                                            <MetaRow.Placeholder
                                                key={index}
                                                className={styles['search-row-placeholder']}
                                                title={catalog.addon_name}
                                                limit={10}
                                            />
                                        );
                                }
                            })
                }
            </div>
        </div>
    );
}

module.exports = Search;
