// Copyright (C) 2017-2023 Smart code 203358507

const React = require('react');
const PropTypes = require('prop-types');
const classnames = require('classnames');
const { useTranslation } = require('react-i18next');
const { default: Icon } = require('@stremio/stremio-icons/react');
const { useRouteFocused } = require('stremio-router');
const Button = require('stremio/common/Button');
const TextInput = require('stremio/common/TextInput');
const useTorrent = require('stremio/common/useTorrent');
const { withCoreSuspender } = require('stremio/common/CoreSuspender');
const styles = require('./styles');
const useSearchHistory = require('../../../../routes/Search/useSearchHistory');
const useLocalSearch = require('./useLocalSearch');

const SearchBar = React.memo(({ className, query, active }) => {
    const { t } = useTranslation();
    const routeFocused = useRouteFocused();
    const searchHistory = useSearchHistory();
    const { createTorrentFromMagnet } = useTorrent();
    const [showHistory, setShowHistory] = React.useState(false);
    const [currentQuery, setCurrentQuery] = React.useState(query || '');
    const localSearch = useLocalSearch(currentQuery);
    const searchInputRef = React.useRef(null);
    const labelRef = React.useRef(null);

    const searchBarOnClick = React.useCallback(() => {
        if (!active) {
            window.location = '#/search';
        }
    }, [active]);

    const searchHistoryOnClose = React.useCallback((event) => {
        if (showHistory && labelRef.current && !labelRef.current.contains(event.target)) {
            setShowHistory(false);
        }
    }, [showHistory]);

    React.useEffect(() => {
        document.addEventListener('mousedown', searchHistoryOnClose);
        return () => {
            document.removeEventListener('mousedown', searchHistoryOnClose);
        };
    }, [searchHistoryOnClose]);

    const queryInputOnChange = React.useCallback(() => {
        const value = searchInputRef.current.value;
        setCurrentQuery(value);
        setShowHistory(true);
        try {
            createTorrentFromMagnet(value);
        } catch (error) {
            console.error('Failed to create torrent from magnet:', error);
        }
    }, [createTorrentFromMagnet]);

    const queryInputOnSubmit = React.useCallback((searchValue, event) => {
        event.preventDefault();
        setCurrentQuery(searchValue);
        if (searchInputRef.current && searchValue) {
            window.location.hash = searchValue;
            setShowHistory(false);
        }
    }, []);

    const queryInputClear = React.useCallback(() => {
        searchInputRef.current.value = '';
        setCurrentQuery('');
        window.location.hash = '/search';
    }, []);

    React.useEffect(() => {
        if (routeFocused && active) {
            searchInputRef.current.focus();
        }
    }, [routeFocused, active]);

    const renderSearchHistoryItems = () => {
        return (
            <div className={styles['search-history-results']}>
                {searchHistory.items.slice(0, 8).map((item, index) => (
                    <a key={index} className={styles['search-history-item']} onClick={(e) => queryInputOnSubmit(`/search?search=${item.query}`, e)}>
                        {item.query}
                    </a>
                ))}
            </div>
        );
    };
    const renderLocalSearchItems = () => {
        return (
            <div className={styles['search-history-results']}>
                <div className={styles['search-history-label']}>{ t('Recommendations') }</div>
                {localSearch.searchResults.map((item, index) => (
                    <a key={index} className={styles['search-history-item']} onClick={(e) => queryInputOnSubmit(`/search?search=${item.name}`, e)}>
                        {item.name}
                    </a>
                ))}
            </div>
        );
    };

    return (
        <label className={classnames(className, styles['search-bar-container'], { 'active': active })} onClick={searchBarOnClick} ref={labelRef}>
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
                        onSubmit={(e) => queryInputOnSubmit(`/search?search=${e.target.value}`, e)}
                        onClick={() => setShowHistory(true)}
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
                showHistory ?
                    <div className={styles['search-history']}>
                        {
                            localSearch.searchResults.length === 0 && searchHistory.items.length === 0 ?
                                <div className={styles['search-history-label']}>{ t('Start typing ...') }</div>
                                :
                                null
                        }
                        {
                            searchHistory.items.length > 0 ?
                                <div className={styles['search-history-actions']}>
                                    <div className={styles['search-history-label']}>{ t('STREMIO_TV_SEARCH_HISTORY_TITLE') }</div>
                                    <button className={styles['search-history-clear']} onClick={searchHistory.clear}>
                                        {t('CLEAR_HISTORY')}
                                    </button>
                                </div>
                                :
                                null
                        }
                        <div className={styles['search-history-items']}>
                            {
                                searchHistory.items.length > 0 ?
                                    renderSearchHistoryItems()
                                    :
                                    null
                            }
                            {
                                localSearch.searchResults.length > 0 ?
                                    renderLocalSearchItems()
                                    :
                                    null
                            }
                        </div>
                    </div>
                    :
                    null
            }
        </label>
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
