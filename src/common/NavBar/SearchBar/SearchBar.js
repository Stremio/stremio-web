const React = require('react');
const PropTypes = require('prop-types');
const classnames = require('classnames');
const UrlUtils = require('url');
const Icon = require('stremio-icons/dom');
const { Input, useFocusable } = require('stremio-navigation');
const useLocationHash = require('../../useLocationHash');
const styles = require('./styles');

const SearchBar = React.memo(({ className }) => {
    const searchInputRef = React.useRef();
    const locationHash = useLocationHash();
    const focusable = useFocusable();
    const [active, query] = React.useMemo(() => {
        const locationHashPath = locationHash.startsWith('#') ? locationHash.slice(1) : '';
        const { pathname: locationPathname, search: locationSearch } = UrlUtils.parse(locationHashPath);
        const active = locationPathname === '/search';
        const queryParams = new URLSearchParams(locationSearch);
        const query = (active && queryParams.has('q')) ? queryParams.get('q') : '';
        return [active, query];
    }, [locationHash]);
    const onQueryInputFocus = React.useCallback(() => {
        if (!active) {
            window.location = '#/search';
        }
    }, [active]);
    const onQueryInputSubmit = React.useCallback(() => {
        window.location.replace(`#/search?q=${searchInputRef.current.value}`);
    }, [searchInputRef.current]);
    React.useEffect(() => {
        if (active && focusable && searchInputRef.current) {
            searchInputRef.current.focus();
        }
    }, [query, active, focusable, searchInputRef.current]);
    return (
        <label className={classnames(className, styles['search-label'], { 'active': active })}>
            <Input
                key={query}
                ref={searchInputRef}
                tabIndex={-1}
                className={styles['search-input']}
                type={'text'}
                placeholder={'Search'}
                autoCorrect={'off'}
                autoCapitalize={'off'}
                spellCheck={false}
                defaultValue={query}
                onFocus={onQueryInputFocus}
                onSubmit={onQueryInputSubmit}
            />
            <Input className={styles['submit-button']} type={'button'} tabIndex={-1} onClick={onQueryInputSubmit}>
                <Icon className={styles['submit-icon']} icon={'ic_search'} />
            </Input>
        </label>
    );
});

SearchBar.displayName = 'SearchBar';

SearchBar.propTypes = {
    className: PropTypes.string
};

module.exports = SearchBar;
