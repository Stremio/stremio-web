const React = require('react');
const { MainNavBar, MetaRow } = require('stremio/common');
const useSearch = require('./useSearch');
const styles = require('./styles');

const Search = ({ queryParams }) => {
    const groups = useSearch(queryParams);
    return (
        <div className={styles['search-container']}>
            <MainNavBar className={styles['nav-bar']} />
            <div className={styles['search-content']}>
                {groups.map(({ request, content }, index) => {
                    switch (content.type) {
                        case 'Ready':
                            return (
                                <MetaRow
                                    key={`${index}${request.base}${content.type} Ready`}
                                    className={styles['search-row']}
                                    title={`${request.path.id} - ${request.path.type_name}`}
                                    items={content.content}
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
                })}
            </div>
        </div>
    );
}

module.exports = Search;
