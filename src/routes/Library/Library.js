const React = require('react');
const UrlUtils = require('url');
const classnames = require('classnames');
const { Button, Multiselect, MainNavBar, MetaItem, useUser } = require('stremio/common');
const useLibrary = require('./useLibrary');
const useSort = require('./useSort');
const styles = require('./styles');

const Library = ({ urlParams, queryParams }) => {
    const [user] = useUser();
    const library = useLibrary(urlParams);
    const [selectSortInput, sortFunction] = useSort(urlParams, queryParams);
    const loginButtonOnClick = React.useCallback(() => {
        window.location.replace('#/intro');
    }, []);
    const selectTypeInput = React.useMemo(() => {
        return {
            selected: [library.selected.type_name],
            options: library.type_names
                .map((type) => ({
                    label: type === '' ? '"Empty"' : type,
                    value: type
                })),
            onSelect: (event) => {
                const { search } = UrlUtils.parse(window.location.hash.slice(1));
                window.location.replace(`#/library/${event.value}${search !== null ? search : ''}`);
            }
        }
    }, [library.selected.type_name, library.type_names]);
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
                            library.library_state.type != 'Ready' ?
                                <div className={styles['message-container']}>
                                    Loading
                                </div>
                                :
                                library.type_names.length > 0 ?
                                    library.selected.type_name !== null ?
                                        library.lib_items.length > 0 ?
                                            <div className={styles['meta-items-container']}>
                                                {library.lib_items
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
                                            Select a type, please
                                        </div>
                                    :
                                    <div className={styles['message-container']}>
                                        Empty library
                                    </div>
                    }
                </div>
            </div>
        </div>
    );
}

module.exports = Library;
