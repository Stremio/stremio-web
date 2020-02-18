const React = require('react');
const PropTypes = require('prop-types');
const classnames = require('classnames');
const { Button, Multiselect, MainNavBar, MetaItem, useProfile } = require('stremio/common');
const useLibrary = require('./useLibrary');
const useSelectableInputs = require('./useSelectableInputs');
const useItemOptions = require('./useItemOptions');
const styles = require('./styles');

const Library = ({ urlParams }) => {
    const library = useLibrary(urlParams);
    const profile = useProfile();
    const [typeSelect, sortPropSelect] = useSelectableInputs(library);
    const [options, optionOnSelect] = useItemOptions();
    return (
        <div className={styles['library-container']}>
            <MainNavBar className={styles['nav-bar']} route={'library'} />
            <div className={styles['library-content']}>
                {
                    profile.auth !== null && library.type_names.length > 0 ?
                        <div className={styles['selectable-inputs-container']}>
                            <Multiselect {...typeSelect} className={styles['select-input-container']} />
                            <Multiselect {...sortPropSelect} className={styles['select-input-container']} />
                        </div>
                        :
                        null
                }
                {
                    profile.auth === null ?
                        <div className={classnames(styles['message-container'], styles['no-user-message-container'])}>
                            <div className={styles['message-label']}>Library is only availavle for logged in users</div>
                            <Button className={styles['login-button-container']} href={'#/intro'}>
                                <div className={styles['label']}>LOG IN</div>
                            </Button>
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
    urlParams: PropTypes.exact({
        type: PropTypes.string,
        sort: PropTypes.string
    })
};

module.exports = Library;
