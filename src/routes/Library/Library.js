const React = require('react');
const UrlUtils = require('url');
const classnames = require('classnames');
const { Button, Multiselect, MainNavBar, MetaItem } = require('stremio/common');
const useUser = require('stremio/common/useUser');
const useLibrary = require('./useLibrary');
const useSort = require('./useSort');
const styles = require('./styles');

const Library = ({ urlParams, queryParams }) => {
    const user = useUser();
    const [selectedType, typeNames, libItems] = useLibrary(urlParams);
    const [selectSortInput, sortFunction] = useSort(urlParams, queryParams);
    const loginButtonOnClick = React.useCallback(() => {
        window.location.replace('#/intro');
    }, []);
    const selectTypeInput = React.useMemo(() => {
        return {
            selected: [selectedType],
            options: typeNames
                .map((type) => ({
                    label: type === '' ? '"Empty"' : type,
                    value: type
                })),
            onSelect: (event) => {
                const { search } = UrlUtils.parse(window.location.hash.slice(1));
                window.location.replace(`#/library/${event.value}${search !== null ? search : ''}`);
            }
        }
    }, [selectedType, typeNames]);
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
                            selectedType !== null ?
                                libItems.length > 0 ?
                                    <div className={styles['meta-items-container']}>
                                        {libItems
                                            .sort(sortFunction)
                                            .map(({ removed, temp, ...libItem }, index) => (
                                                <MetaItem
                                                    {...libItem}
                                                    key={index}
                                                />
                                            ))}
                                    </div>
                                    :
                                    <div className={styles['message-container']}>
                                        Empty library
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
