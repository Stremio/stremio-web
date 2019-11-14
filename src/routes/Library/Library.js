const React = require('react');
const { Multiselect, MainNavBar, MetaItem } = require('stremio/common');
const useLibrary = require('./useLibrary');
const styles = require('./styles');

const Library = ({ urlParams, queryParams }) => {
    const [metaItems, dropdowns] = useLibrary(urlParams, queryParams);
    return (
        <div className={styles['library-container']}>
            <MainNavBar className={styles['nav-bar']} />
            <div className={styles['library-content']}>
                <div className={styles['dropdowns-container']}>
                    {dropdowns.map((dropdown, index) => (
                        <Multiselect {...dropdown} key={index} className={styles['dropdown']} />
                    ))}
                </div>
                <div className={styles['meta-items-container']}>
                    {metaItems
                        .map((metaItem, index) => (
                            <MetaItem
                                {...metaItem}
                                key={index}
                            />
                        ))}
                </div>
            </div>
        </div>
    );
}

module.exports = Library;
