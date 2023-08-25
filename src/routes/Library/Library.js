// Copyright (C) 2017-2023 Smart code 203358507

const React = require('react');
const PropTypes = require('prop-types');
const classnames = require('classnames');
const { default: Icon } = require('@stremio/stremio-icons/react');
const NotFound = require('stremio/routes/NotFound');
const { Button, DelayedRenderer, Multiselect, MainNavBars, LibItem, Image, ModalDialog, PaginationInput, useProfile, routesRegexp, useBinaryState, withCoreSuspender } = require('stremio/common');
const useLibrary = require('./useLibrary');
const useSelectableInputs = require('./useSelectableInputs');
const styles = require('./styles');

function withModel(Library) {
    const withModel = ({ urlParams, queryParams }) => {
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
        if (model === null) {
            return (
                <NotFound />
            );
        }

        return (
            <Library
                key={model}
                model={model}
                urlParams={urlParams}
                queryParams={queryParams}
            />
        );
    };
    withModel.displayName = 'withModel';
    return withModel;
}

const Library = ({ model, urlParams, queryParams }) => {
    const profile = useProfile();
    const library = useLibrary(model, urlParams, queryParams);
    const [typeSelect, sortSelect, paginationInput] = useSelectableInputs(library);
    const [inputsModalOpen, openInputsModal, closeInputsModal] = useBinaryState(false);
    return (
        <MainNavBars className={styles['library-container']} route={model}>
            <div className={styles['library-content']}>
                {
                    model === 'continue_watching' || profile.auth !== null ?
                        <div className={styles['selectable-inputs-container']}>
                            <Multiselect {...typeSelect} className={styles['select-input-container']} />
                            <Multiselect {...sortSelect} className={styles['select-input-container']} />
                            <div className={styles['spacing']} />
                            {
                                paginationInput !== null ?
                                    <PaginationInput {...paginationInput} className={styles['pagination-input']} />
                                    :
                                    null
                            }
                            <Button className={styles['filter-container']} title={'All filters'} onClick={openInputsModal}>
                                <Icon className={styles['filter-icon']} name={'filters'} />
                            </Button>
                        </div>
                        :
                        null
                }
                {
                    model === 'library' && profile.auth === null ?
                        <div className={classnames(styles['message-container'], styles['no-user-message-container'])}>
                            <Image
                                className={styles['image']}
                                src={require('/images/anonymous.png')}
                                alt={' '}
                            />
                            <div className={styles['message-label']}>Library is only available for logged in users!</div>
                            <Button className={styles['login-button-container']} href={'#/intro'}>
                                <div className={styles['label']}>LOG IN</div>
                            </Button>
                        </div>
                        :
                        library.selected === null ?
                            <DelayedRenderer delay={500}>
                                <div className={styles['message-container']}>
                                    <Image
                                        className={styles['image']}
                                        src={require('/images/empty.png')}
                                        alt={' '}
                                    />
                                    <div className={styles['message-label']}>{model === 'library' ? 'Library' : 'Continue Watching'} not loaded!</div>
                                </div>
                            </DelayedRenderer>
                            :
                            library.catalog.length === 0 ?
                                <div className={styles['message-container']}>
                                    <Image
                                        className={styles['image']}
                                        src={require('/images/empty.png')}
                                        alt={' '}
                                    />
                                    <div className={styles['message-label']}>Empty {model === 'library' ? 'Library' : 'Continue Watching'}</div>
                                </div>
                                :
                                <div className={classnames(styles['meta-items-container'], 'animation-fade-in')}>
                                    {library.catalog.map((libItem, index) => (
                                        <LibItem {...libItem} removable={model === 'library'} key={index} />
                                    ))}
                                </div>
                }
            </div>
            {
                inputsModalOpen ?
                    <ModalDialog title={'Library filters'} className={styles['selectable-inputs-modal']} onCloseRequest={closeInputsModal}>
                        <Multiselect {...typeSelect} className={styles['select-input-container']} />
                        <Multiselect {...sortSelect} className={styles['select-input-container']} />
                    </ModalDialog>
                    :
                    null
            }
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

const LibraryFallback = ({ model }) => (
    <MainNavBars className={styles['library-container']} route={model} />
);

LibraryFallback.propTypes = Library.propTypes;

module.exports = withModel(withCoreSuspender(Library, LibraryFallback));
