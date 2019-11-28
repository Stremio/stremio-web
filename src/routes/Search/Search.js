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
                {groups.map(({ req, content }, index) => {
                    switch (content.type) {
                        case 'Ready':
                            return (
                                <MetaRow
                                    key={`${index}${req.base}${content.type} Ready`}
                                    className={styles['search-row']}
                                    title={`${req.path.id} - ${req.path.type_name}`}
                                    items={content.content}
                                />
                            );
                        case 'Err':
                            return (
                                <MetaRow
                                    key={`${index}${req.base}${content.type}`}
                                    className={styles['search-row']}
                                    title={`${req.path.id} - ${req.path.type_name} Err`}
                                    message={`${content.content.type} ${typeof content.content.content === 'string' ? content.content.content : ''}`}
                                />
                            );
                        case 'Loading':
                            return (
                                <MetaRow.Placeholder
                                    key={`${index}${req.base}${content.type} Loading`}
                                    className={styles['search-row-placeholder']}
                                    title={`${req.path.id} - ${req.path.type_name}`}
                                />
                            );
                    }
                })}
            </div>
        </div>
    );
}

module.exports = Search;
