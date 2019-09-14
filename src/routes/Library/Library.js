const React = require('react');
const { Dropdown, MainNavBar } = require('stremio/common');
const useLibrary = require('./useLibrary');
const styles = require('./styles');

const Library = ({ urlParams, queryParams }) => {
    const [items, dropdowns] = useLibrary(urlParams.type, queryParams.get('sort'));
    return (
        <div className={styles['library-container']}>
            <MainNavBar className={styles['nav-bar']} />
            <div className={styles['library-content']}>
                <div className={styles['dropdowns-container']}>
                    {dropdowns.map((dropdown) => (
                        <Dropdown {...dropdown} key={dropdown.name} className={styles['dropdown']} />
                    ))}
                </div>
            </div>
        </div>
    );
}

module.exports = Library;
