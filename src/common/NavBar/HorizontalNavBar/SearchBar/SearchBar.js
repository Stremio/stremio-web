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

const SearchBar = ({ className, query, active }) => {
    const { t } = useTranslation();
    const routeFocused = useRouteFocused();
    const searchHistory = useSearchHistory();
    const { createTorrentFromMagnet } = useTorrent();
    const [inputValue, setInputValue] = React.useState(query || '');
    const localSearch = useLocalSearch(inputValue);
    const [historyActive, setHistoryActive] = React.useState(true);
    const searchInputRef = React.useRef(null);
    const searchHistoryRef = React.useRef(null);
    const searchBarOnClick = React.useCallback(() => {
        if (!active) {
            window.location = '#/search';
        }
    }, [active]);
    const queryInputOnChange = React.useCallback(() => {
        setInputValue(searchInputRef.current.value);
        localSearch.dispatchSearch();
        try {
            createTorrentFromMagnet(searchInputRef.current.value);
            // eslint-disable-next-line no-empty
        } catch { }
    }, []);
    const queryInputOnSubmit = React.useCallback((event) => {
        if (searchInputRef.current !== null) {
            const searchValue = event.target.innerText ? event.target.innerText : searchInputRef.current.value;
            if (searchValue) {
                const queryParams = new URLSearchParams([['search', searchValue]]);
                window.location = `#/search?${queryParams.toString()}`;
                setInputValue(searchValue);
                if (event.key === 'Enter') {
                    setHistoryActive(false);
                }
            }
        }
    }, []);
    React.useEffect(() => {
        if (routeFocused && active) {
            searchInputRef.current.focus();
        }
    }, [routeFocused, active, query]);
    const queryInputClear = React.useCallback(() => {
        searchInputRef.current.value = '';
        setInputValue('');
        window.location = '#/search';
    }, []);
    const handleBlur = (event) => {
        if (!searchHistoryRef?.current?.contains(event.relatedTarget)) {
            setHistoryActive(false);
        }
    };
    const handleClick = () => {
        setHistoryActive((prev) => !prev);
    };

    return (
        <label className={classnames(className, styles['search-bar-container'], { 'active': active })} onClick={searchBarOnClick} onBlur={handleBlur}>
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
                        onClick={handleClick}
                    />
                    :
                    <div className={styles['search-input']}>
                        <div className={styles['placeholder-label']}>{t('SEARCH_OR_PASTE_LINK')}</div>
                    </div>
            }
            {
                inputValue ?
                    <Button className={styles['submit-button-container']} onClick={queryInputClear}>
                        <Icon className={styles['icon']} name={'close'} />
                    </Button>
                    :
                    <Button className={styles['submit-button-container']} tabIndex={-1}>
                        <Icon className={styles['icon']} name={'search'} />
                    </Button>
            }
            {
                historyActive && active ?
                    <div className={styles['search-history']} onBlur={handleBlur} ref={searchHistoryRef}>
                        {
                            localSearch.searchResults.length === 0 && searchHistory.items.length === 0 ?
                                <div className={styles['search-history-label']}>{t('Start typing ...')}</div>
                                :
                                null
                        }
                        <div className={styles['search-history-actions']}>
                            {
                                searchHistory.items.length > 0 ?
                                    <React.Fragment>
                                        <div className={styles['search-history-label']}>{t('STREMIO_TV_SEARCH_HISTORY_TITLE')}</div>
                                        <button className={styles['search-history-clear']} onClick={() => searchHistory.clear()}>{t('CLEAR_HISTORY')}</button>
                                    </React.Fragment>
                                    :
                                    null
                            }
                        </div>
                        <div className={styles['search-history-items']}>
                            {searchHistory.items.slice(0, 8).map((item, index) => {
                                return (
                                    <button key={index} className={styles['search-history-item']} onClick={queryInputOnSubmit}>{item}</button>
                                );
                            })}
                            {
                                localSearch.searchResults.length > 0 ?
                                    <div className={styles['search-history-label']}>{t('Recommendations')}</div>
                                    :
                                    null
                            }
                            {localSearch.searchResults.map((item, index) => {
                                return (
                                    <button key={index} className={styles['search-history-item']} onClick={queryInputOnSubmit}>{item.name}</button>
                                );
                            })}
                        </div>
                    </div>
                    :
                    null
            }
        </label>

    );
};

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
