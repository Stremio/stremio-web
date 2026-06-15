// Copyright (C) 2017-2023 Smart code 203358507

const React = require('react');
const { useTranslation } = require('react-i18next');
const { useLocation, useParams, useNavigate } = require('react-router');
const { useSearchParams } = require('react-router-dom');
const PropTypes = require('prop-types');
const classnames = require('classnames');
const NotFound = require('stremio/routes/NotFound');
const { useProfile, useNotifications, useOnScrollToBottom, withCoreSuspender } = require('stremio/common');
const { default: toPath } = require('stremio/common/toPath');
const { DelayedRenderer, Chips, Image, MainNavBars, LibItem, MultiselectMenu } = require('stremio/components');
const { default: Placeholder } = require('./Placeholder');
const useLibrary = require('./useLibrary');
const useSelectableInputs = require('./useSelectableInputs');
const styles = require('./styles');

const SCROLL_TO_BOTTOM_TRESHOLD = 400;

function withModel(Library) {
    const withModel = () => {
        const location = useLocation();
        const model = React.useMemo(() => {
            return typeof location.pathname === 'string' ?
                location.pathname.match('/library') ?
                    'library'
                    :
                    location.pathname.match('/continuewatching') ?
                        'continue_watching'
                        :
                        null
                :
                null;
        }, [location?.pathname]);

        if (model === null) return <NotFound />;

        return <Library model={model} />;
    };
    withModel.displayName = 'withModel';
    return withModel;
}

const Library = ({ model }) => {
    const { type } = useParams();
    const urlParams = React.useMemo(() => ({
        type
    }), [type]);
    const [queryParams] = useSearchParams();
    const navigate = useNavigate();
    const { t } = useTranslation();
    const profile = useProfile();
    const notifications = useNotifications();
    const [library, loadNextPage] = useLibrary(model, urlParams, queryParams);
    const [typeSelect, sortChips, hasNextPage] = useSelectableInputs(library);
    const scrollContainerRef = React.useRef(null);
    const onScrollToBottom = React.useCallback(() => {
        if (hasNextPage) {
            loadNextPage();
        }
    }, [hasNextPage, loadNextPage]);
    const onScroll = useOnScrollToBottom(onScrollToBottom, SCROLL_TO_BOTTOM_TRESHOLD);
    React.useLayoutEffect(() => {
        if (scrollContainerRef.current !== null && library.selected && library.selected.request.page === 1 && library.catalog.length !== 0) {
            scrollContainerRef.current.scrollTop = 0;
        }
    }, [profile.auth, library.selected]);
    React.useEffect(() => {
        if (!library.selected?.type && typeSelect.value) {
            navigate(toPath(typeSelect.value));
        }
    }, [typeSelect.value, library.selected]);
    return (
        <MainNavBars className={styles['library-container']} route={model}>
            {
                profile.auth !== null ?
                    <div className={styles['library-content']}>
                        <div className={styles['selectable-inputs-container']}>
                            <MultiselectMenu {...typeSelect} className={styles['select-input-container']} />
                            <Chips {...sortChips} className={styles['select-input-container']} />
                        </div>
                        {
                            library.selected === null ?
                                <DelayedRenderer delay={500}>
                                    <div className={styles['message-container']}>
                                        <Image
                                            className={styles['image']}
                                            src={require('/assets/images/empty.png')}
                                            alt={' '}
                                        />
                                        <div className={styles['message-label']}>{model === 'library' ? t('LIBRARY_NOT_LOADED') : t('BOARD_CONTINUE_WATCHING_NOT_LOADED')}</div>
                                    </div>
                                </DelayedRenderer>
                                :
                                library.catalog.length === 0 ?
                                    <div className={styles['message-container']}>
                                        <Image
                                            className={styles['image']}
                                            src={require('/assets/images/empty.png')}
                                            alt={' '}
                                        />
                                        <div className={styles['message-label']}>{model === 'library' ? t('LIBRARY_EMPTY') : t('BOARD_CONTINUE_WATCHING_EMPTY')}</div>
                                    </div>
                                    :
                                    <div ref={scrollContainerRef} className={classnames(styles['meta-items-container'], 'animation-fade-in')} onScroll={onScroll}>
                                        {
                                            library.catalog.map((libItem, index) => (
                                                <LibItem {...libItem} notifications={notifications} removable={model === 'library'} key={index} />
                                            ))
                                        }
                                    </div>
                        }
                    </div>
                    :
                    <Placeholder />
            }
        </MainNavBars>
    );
};

Library.propTypes = {
    model: PropTypes.oneOf(['library', 'continue_watching']),
};

const LibraryFallback = ({ model }) => (
    <MainNavBars className={styles['library-container']} route={model} />
);

LibraryFallback.propTypes = Library.propTypes;

module.exports = withModel(withCoreSuspender(Library, LibraryFallback));
