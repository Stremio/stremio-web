// Copyright (C) 2017-2020 Smart code 203358507

const React = require('react');
const PropTypes = require('prop-types');
const classnames = require('classnames');
const NotFound = require('stremio/routes/NotFound');
const { Button, Multiselect, MainNavBars, LibItem, Image, useProfile, routesRegexp } = require('stremio/common');
const useLibrary = require('./useLibrary');
const useSelectableInputs = require('./useSelectableInputs');
const styles = require('./styles');

const Library = ({ model, urlParams, queryParams }) => {
    const profile = useProfile();
    const library = useLibrary(model, urlParams, queryParams);
    const [typeSelect, sortSelect] = useSelectableInputs(library);
    return (
        <MainNavBars className={styles['library-container']} route={model}>
            <div className={styles['library-content']}>
                {
                    model === 'continue_watching' || profile.auth !== null ?
                        <div className={styles['selectable-inputs-container']}>
                            <Multiselect {...typeSelect} className={styles['select-input-container']} />
                            <Multiselect {...sortSelect} className={styles['select-input-container']} />
                        </div>
                        :
                        null
                }
                {
                    model === 'library' && profile.auth === null ?
                        <div className={classnames(styles['message-container'], styles['no-user-message-container'])}>
                            <Image
                                className={styles['image']}
                                src={'/images/anonymous.png'}
                                alt={' '}
                            />
                            <Button className={styles['login-button-container']} href={'#/intro'}>
                                <div className={styles['label']}>LOG IN</div>
                            </Button>
                            <div className={styles['message-label']}>Library is only available for logged in users!</div>
                        </div>
                        :
                        library.selected === null ?
                            <div className={styles['message-container']}>
                                <Image
                                    className={styles['image']}
                                    src={'/images/empty.png'}
                                    alt={' '}
                                />
                                <div className={styles['message-label']}>{model === 'library' ? 'Library' : 'Continue Watching'} not loaded!</div>
                            </div>
                            :
                            library.catalog.length === 0 ?
                                <div className={styles['message-container']}>
                                    <Image
                                        className={styles['image']}
                                        src={'/images/empty.png'}
                                        alt={' '}
                                    />
                                    <div className={styles['message-label']}>Empty {model === 'library' ? 'Library' : 'Continue Watching'}</div>
                                </div>
                                :
                                <div className={styles['meta-items-container']}>
                                    {library.catalog.map((libItem, index) => (
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
    urlParams: PropTypes.shape({
        type: PropTypes.string
    }),
    queryParams: PropTypes.instanceOf(URLSearchParams)
};

module.exports = ({ urlParams, queryParams }) => {
    const model = React.useMemo(() => {
        return typeof urlParams.path === 'string' ?
            urlParams.path.match(routesRegexp.library.regexp) ?
                'library'
                :
                urlParams.path.match(routesRegexp.continuewatching.regexp) ?
                    'continue_watching'
                    :
                    null
            :
            null;
    }, [urlParams.path]);
    if (typeof model === 'string') {
        return (
            <Library
                key={model}
                model={model}
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
