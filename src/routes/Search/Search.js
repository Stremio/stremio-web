const React = require('react');
const Icon = require('stremio-icons/dom');
const { MainNavBar, MetaRow } = require('stremio/common');
const useSearch = require('./useSearch');
const styles = require('./styles');

const Search = ({ queryParams }) => {
    const search = useSearch(queryParams);
    return (
        <div className={styles['search-container']}>
            <MainNavBar className={styles['nav-bar']} />
            <div className={styles['search-content']}>
                {
                    search.selected ?
                        search.items_groups && search.items_groups.length > 0 ?
                            search.items_groups.some(group => group.content.type !== 'Err') ?
                                search.items_groups.map(({ href, request, content }, index) => {
                                    switch (content.type) {
                                        case 'Ready':
                                            return (
                                                <MetaRow
                                                    key={`${index}${request.base}${content.type} Ready`}
                                                    className={styles['search-row']}
                                                    title={`${request.path.id} - ${request.path.type_name}`}
                                                    items={content.content}
                                                    catalogHref={href}
                                                />
                                            );
                                        case 'Err':
                                            return (
                                                <MetaRow
                                                    key={`${index}${request.base}${content.type}`}
                                                    className={styles['search-row']}
                                                    title={`${request.path.id} - ${request.path.type_name} Err`}
                                                    message={`${content.content.type} ${typeof content.content.content === 'string' ? content.content.content : ''}`}
                                                />
                                            );
                                        case 'Loading':
                                            return (
                                                <MetaRow.Placeholder
                                                    key={`${index}${request.base}${content.type} Loading`}
                                                    className={styles['search-row-placeholder']}
                                                    title={`${request.path.id} - ${request.path.type_name}`}
                                                />
                                            );
                                    }
                                })
                                :
                                <div className={styles['message-container']}>
                                    <div className={styles['message-content']}>
                                        <div className={styles['label']}>No metadata was found</div>
                                    </div>
                                </div>
                            :
                            <div className={styles['message-container']}>
                                <div className={styles['message-content']}>
                                    <div className={styles['label']}> No addons were requested for metadata</div>
                                </div>
                            </div>
                        :
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
                }
            </div>
        </div>
    );
}

module.exports = Search;
