const React = require('react');
const PropTypes = require('prop-types');
const classnames = require('classnames');
const { Button, Multiselect, MainNavBar, MetaItem } = require('stremio/common');
const useLibrary = require('./useLibrary');
const useSelectableInputs = require('./useSelectableInputs');
const useItemOptions = require('./useItemOptions');
const styles = require('./styles');

const Library = ({ urlParams, queryParams }) => {
    const library = useLibrary(urlParams, queryParams);
    const [typeSelect, sortPropSelect] = useSelectableInputs(library);
    const [options, optionOnSelect] = useItemOptions();
    return (
        <div className={styles['library-container']}>
            <MainNavBar className={styles['nav-bar']} />
            <div className={styles['library-content']}>
                {
                    library.library_state.type === 'Ready' && library.library_state.content.uid !== null && library.type_names.length > 0 ?
                        <div className={styles['selectable-inputs-container']}>
                            <Multiselect {...typeSelect} className={styles['select-input-container']} />
                            <Multiselect {...sortPropSelect} className={styles['select-input-container']} />
                        </div>
                        :
                        null
                }
                {
                    library.library_state.type === 'Ready' && library.library_state.content.uid === null ?
                        <div className={classnames(styles['message-container'], styles['no-user-message-container'])}>
                            <div className={styles['message-label']}>Library is only availavle for logged in users</div>
                            <Button className={styles['login-button-container']} href={'#/intro'}>
                                <div className={styles['label']}>LOG IN</div>
                            </Button>
                        </div>
                        :
                        library.library_state.type !== 'Ready' ?
                            <div className={styles['message-container']}>
                                <div className={styles['message-label']}>Loading</div>
                            </div>
                            :
                            library.type_names.length === 0 ?
                                <div className={styles['message-container']}>
                                    <div className={styles['message-label']}>Empty library</div>
                                </div>
                                :
                                library.selected === null ?
                                    <div className={styles['message-container']}>
                                        <div className={styles['message-label']}>Please select a type</div>
                                    </div>
                                    :
                                    library.lib_items.length === 0 ?
                                        <div className={styles['message-container']}>
                                            <div className={styles['message-label']}>There are no items for the selected type</div>
                                        </div>
                                        :
                                        <div className={styles['meta-items-container']}>
                                            {library.lib_items.map(({ id, videoId, ...libItem }, index) => (
                                                <MetaItem
                                                    {...libItem}
                                                    key={index}
                                                    dataset={{ id, videoId, type: libItem.type }}
                                                    options={options}
                                                    optionOnSelect={optionOnSelect}
                                                />
                                            ))}
                                        </div>
                }
            </div>
        </div>
    );
};

Library.propTypes = {
    urlParams: PropTypes.instanceOf(URLSearchParams),
    queryParams: PropTypes.instanceOf(URLSearchParams)
};

module.exports = Library;
