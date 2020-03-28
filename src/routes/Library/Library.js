const React = require('react');
const PropTypes = require('prop-types');
const classnames = require('classnames');
const NotFound = require('stremio/routes/NotFound');
const { Button, Multiselect, MainNavBars, LibItem, useProfile, routesRegexp } = require('stremio/common');
const useLibrary = require('./useLibrary');
const useSelectableInputs = require('./useSelectableInputs');
const styles = require('./styles');

const Library = ({ model, route, urlParams, queryParams }) => {
    const profile = useProfile();
    const library = useLibrary(model, urlParams, queryParams);
    const [typeSelect, sortSelect] = useSelectableInputs(route, library);
    return (
        <MainNavBars className={styles['library-container']} route={route}>
            <div className={styles['library-content']}>
                {
                    profile.auth !== null && library.type_names.length > 0 ?
                        <div className={styles['selectable-inputs-container']}>
                            <Multiselect {...typeSelect} className={styles['select-input-container']} />
                            <Multiselect {...sortSelect} className={styles['select-input-container']} />
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
                                        {library.lib_items.map((libItem, index) => (
                                            <LibItem {...libItem} key={index} />
                                        ))}
                                    </div>
                }
            </div>
        </MainNavBars>
    );
};

Library.propTypes = {
    model: PropTypes.oneOf(['library', 'continue_watching']),
    route: PropTypes.oneOf(['library', 'continuewatching']),
    urlParams: PropTypes.shape({
        type: PropTypes.string
    }),
    queryParams: PropTypes.instanceOf(URLSearchParams)
};

module.exports = ({ urlParams, queryParams }) => {
    const [model, route] = React.useMemo(() => {
        return typeof urlParams.path === 'string' ?
            urlParams.path.match(routesRegexp.library.regexp) ?
                ['library', 'library']
                :
                urlParams.path.match(routesRegexp.continuewatching.regexp) ?
                    ['continue_watching', 'continuewatching']
                    :
                    [null, null]
            :
            [null, null];
    }, [urlParams.path]);
    if (typeof model === 'string') {
        return (
            <Library
                key={model}
                model={model}
                route={route}
                urlParams={urlParams}
                queryParams={queryParams}
            />
        );
    } else {
        return (
            <NotFound />
        );
    }
};
