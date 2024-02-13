// Copyright (C) 2017-2023 Smart code 203358507

const React = require('react');
const PropTypes = require('prop-types');
const classnames = require('classnames');
const debounce = require('lodash.debounce');
const { useTranslation } = require('react-i18next');
const { default: Icon } = require('@stremio/stremio-icons/react');
const { useRouteFocused } = require('stremio-router');
const Button = require('stremio/common/Button');
const TextInput = require('stremio/common/TextInput');
const useTorrent = require('stremio/common/useTorrent');
const { withCoreSuspender } = require('stremio/common/CoreSuspender');
const useSearchHistory = require('./useSearchHistory');
const useLocalSearch = require('./useLocalSearch');
const styles = require('./styles');
const useBinaryState = require('stremio/common/useBinaryState');

const SearchBar = React.memo(({ className, query, active }) => {
    const { t } = useTranslation();
    const routeFocused = useRouteFocused();
    const searchHistory = useSearchHistory();
    const localSearch = useLocalSearch();
    const { createTorrentFromMagnet } = useTorrent();

    const [historyOpen, openHistory, closeHistory, ] = useBinaryState(query === null ? true : false);
    const [currentQuery, setCurrentQuery] = React.useState(query || '');

    const searchInputRef = React.useRef(null);
    const containerRef = React.useRef(null);

    const searchBarOnClick = React.useCallback(() => {
        if (!active) {
            window.location = '#/search';
        }
    }, [active]);

    const searchHistoryOnClose = React.useCallback((event) => {
        if (historyOpen && containerRef.current && !containerRef.current.contains(event.target)) {
            closeHistory();
        }
    }, [historyOpen]);

    React.useEffect(() => {
        document.addEventListener('mousedown', searchHistoryOnClose);
        return () => {
            document.removeEventListener('mousedown', searchHistoryOnClose);
        };
    }, [searchHistoryOnClose]);

    const queryInputOnChange = React.useCallback(() => {
        const value = searchInputRef.current.value;
        setCurrentQuery(value);
        openHistory();
        try {
            createTorrentFromMagnet(value);
        } catch (error) {
            console.error('Failed to create torrent from magnet:', error);
        }
    }, [createTorrentFromMagnet]);

    const queryInputOnSubmit = React.useCallback((event) => {
        event.preventDefault();
        const searchValue = `/search?search=${event.target.value}`;
        setCurrentQuery(searchValue);
        if (searchInputRef.current && searchValue) {
            window.location.hash = searchValue;
            closeHistory();
        }
    }, []);

    const queryInputClear = React.useCallback(() => {
        searchInputRef.current.value = '';
        setCurrentQuery('');
        window.location.hash = '/search';
    }, []);

    const updateLocalSearchDebounced = React.useCallback(debounce((query) => {
        localSearch.search(query);
    }, 250), []);

    React.useEffect(() => {
        updateLocalSearchDebounced(currentQuery);
    }, [currentQuery]);

    React.useEffect(() => {
        if (routeFocused && active) {
            searchInputRef.current.focus();
        }
    }, [routeFocused, active]);

    React.useEffect(() => {
        return () => {
            updateLocalSearchDebounced.cancel();
        };
    }, []);

    return (
        <div className={classnames(className, styles['search-bar-container'], { 'active': active })} onClick={searchBarOnClick} ref={containerRef}>
            {
                active ?
                    <TextInput
                        key={query}
                        ref={searchInputRef}
                        className={styles['search-input']}
                        type={'text'}
                        placeholder={t('SEARCH_OR_PASTE_LINK')}
                        defaultValue={query}
                        tabIndex={-1}
                        onChange={queryInputOnChange}
                        onSubmit={queryInputOnSubmit}
                        onClick={openHistory}
                    />
                    :
                    <div className={styles['search-input']}>
                        <div className={styles['placeholder-label']}>{ t('SEARCH_OR_PASTE_LINK') }</div>
                    </div>
            }
            {
                currentQuery.length > 0 ?
                    <Button className={styles['submit-button-container']} onClick={queryInputClear}>
                        <Icon className={styles['icon']} name={'close'} />
                    </Button>
                    :
                    <Button className={styles['submit-button-container']}>
                        <Icon className={styles['icon']} name={'search'} />
                    </Button>
            }
            {
                historyOpen && (searchHistory?.items?.length || localSearch?.items?.length) ?
                    <div className={styles['menu-container']}>
                        {
                            searchHistory?.items?.length > 0 ?
                                <div className={styles['items']}>
                                    <div className={styles['title']}>
                                        <div className={styles['label']}>{ t('STREMIO_TV_SEARCH_HISTORY_TITLE') }</div>
                                        <button className={styles['search-history-clear']} onClick={searchHistory.clear}>
                                            { t('CLEAR_HISTORY') }
                                        </button>
                                    </div>
                                    {
                                        searchHistory.items.slice(0, 8).map(({ query, deepLinks }, index) => (
                                            <Button key={index} className={styles['item']} href={deepLinks.search} onClick={closeHistory}>
                                                {query}
                                            </Button>
                                        ))
                                    }
                                </div>
                                :
                                null
                        }
                        {
                            localSearch?.items?.length ?
                                <div className={styles['items']}>
                                    <div className={styles['title']}>
                                        <div className={styles['label']}>{ t('SEARCH_SUGGESTIONS') }</div>
                                    </div>
                                    {
                                        localSearch.items.map(({ query, deepLinks }, index) => (
                                            <Button key={index} className={styles['item']} href={deepLinks.search} onClick={closeHistory}>
                                                {query}
                                            </Button>
                                        ))
                                    }
                                </div>
                                :
                                null
                        }
                    </div>
                    :
                    null
            }
        </div>
    );
});

SearchBar.displayName = 'SearchBar';

SearchBar.propTypes = {
    className: PropTypes.string,
    query: PropTypes.string,
    active: PropTypes.bool
};

const SearchBarFallback = ({ className }) => {
    const { t } = useTranslation();
    return (
        <label className={classnames(className, styles['search-bar-container'])}>
            <div className={styles['search-input']}>
                <div className={styles['placeholder-label']}>{ t('SEARCH_OR_PASTE_LINK') }</div>
            </div>
            <Button className={styles['submit-button-container']} tabIndex={-1}>
                <Icon className={styles['icon']} name={'search'} />
            </Button>
        </label>
    );
};

SearchBarFallback.propTypes = SearchBar.propTypes;

module.exports = withCoreSuspender(SearchBar, SearchBarFallback);
