const React = require('react');
const { MainNavBar, MetaRow } = require('stremio/common');
const useSearch = require('./useSearch');
const styles = require('./styles');

const Search = ({ queryParams }) => {
    const groups = useSearch(queryParams.get('q'));
    return (
        <div className={styles['search-container']}>
            <MainNavBar className={styles['nav-bar']} />
            <div className={styles['search-content']}>
                {groups.map((group, index) => (
                    <MetaRow
                        {...group}
                        key={index}
                        className={styles['search-row']}
                    />
                ))}
            </div>
        </div>
    );
}

module.exports = Search;
