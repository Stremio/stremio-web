const React = require('react');
const classnames = require('classnames');
const { Button, Multiselect, MainNavBar, MetaItem } = require('stremio/common');
const useUser = require('stremio/common/useUser');
const useLibrary = require('./useLibrary');
const useSort = require('./useSort');
const styles = require('./styles');

const Library = ({ urlParams, queryParams }) => {
    const user = useUser();
    const [metaItems, selectTypeInput, error] = useLibrary(urlParams);
    const [selectSortInput, sortFunction] = useSort(urlParams, queryParams);
    const loginButtonOnClick = React.useCallback(() => {
        window.location.replace('#/intro');
    }, []);
    return (
        <div className={styles['library-container']}>
            <MainNavBar className={styles['nav-bar']} />
            <div className={styles['library-content']}>
                {
                    user ?
                        <div className={styles['controls-container']}>
                            <Multiselect {...selectTypeInput} className={styles['select-input-container']} />
                            <Multiselect {...selectSortInput} className={styles['select-input-container']} />
                        </div>
                        :
                        null
                }
                <div className={styles['type-content-container']}>
                    {
                        !user ?
                            <div className={classnames(styles['message-container'], styles['anonymous-user-message-container'])}>
                                Please log into this app
                                <Button className={styles['login-button']} onClick={loginButtonOnClick}>
                                    <div className={styles['label']}>LOG IN</div>
                                </Button>
                            </div>
                            :
                            error !== null ?
                                <div className={styles['message-container']}>
                                    No items for type {urlParams.type !== (null && '') ? urlParams.type : '"Empty"'}
                                </div>
                                :
                                Array.isArray(metaItems) ?
                                    <div className={styles['meta-items-container']}>
                                        {
                                            metaItems
                                                .sort(sortFunction)
                                                .map(({ removed, temp, ...metaItem }, index) => (
                                                    <MetaItem
                                                        {...metaItem}
                                                        key={index}
                                                    />
                                                ))}
                                    </div>
                                    :
                                    <div className={styles['message-container']}>
                                        Loading
                                    </div>
                    }
                </div>
            </div>
        </div>
    );
}

module.exports = Library;
