const React = require('react');
const { Multiselect, MainNavBar, MetaItem } = require('stremio/common');
const useLibrary = require('./useLibrary');
const useSort = require('./useSort');
const styles = require('./styles');

const Library = ({ urlParams, queryParams }) => {
    const [metaItems, selectTypeInput] = useLibrary(urlParams);
    const [selectSortInput, sortFunction] = useSort(urlParams, queryParams);
    return (
        <div className={styles['library-container']}>
            <MainNavBar className={styles['nav-bar']} />
            <div className={styles['library-content']}>
                <div className={styles['controls-container']}>
                    <Multiselect {...selectTypeInput} className={styles['select-input-container']} />
                    <Multiselect {...selectSortInput} className={styles['select-input-container']} />
                </div>
                <div className={styles['meta-items-container']}>
                    {metaItems
                        .sort(sortFunction)
                        .map((metaItem, index) => (
                            <MetaItem
                                {...metaItem}
                                key={index}
                            />
                        ))
                    }
                </div>
            </div>
        </div>
    );
}

module.exports = Library;
