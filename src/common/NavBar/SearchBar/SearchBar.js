const React = require('react');
const PropTypes = require('prop-types');
const classnames = require('classnames');
const UrlUtils = require('url');
const Icon = require('stremio-icons/dom');
const { useRouteFocused } = require('stremio-router');
const Button = require('stremio/common/Button');
const TextInput = require('stremio/common/TextInput');
const routesRegexp = require('stremio/common/routesRegexp');
const useLocationHash = require('stremio/common/useLocationHash');
const useRouteActive = require('stremio/common/useRouteActive');
const styles = require('./styles');

const SearchBar = ({ className }) => {
    const locationHash = useLocationHash();
    const routeFocused = useRouteFocused();
    const routeActive = useRouteActive(routesRegexp.search.regexp);
    const searchInputRef = React.useRef(null);
    const query = React.useMemo(() => {
        if (routeActive) {
            const { search: locationSearch } = UrlUtils.parse(locationHash.slice(1));
            const queryParams = new URLSearchParams(locationSearch);
            return queryParams.has('search') ? queryParams.get('search') : '';
        }

        return '';
    }, [routeActive, locationHash]);
    const searchBarOnClick = React.useCallback(() => {
        if (!routeActive) {
            window.location = '#/search';
        }
    }, [routeActive]);
    const queryInputOnSubmit = React.useCallback(() => {
        if (routeActive) {
            window.location.replace(`#/search?search=${searchInputRef.current.value}`);
        }
    }, [routeActive]);
    React.useEffect(() => {
        if (routeActive && routeFocused) {
            searchInputRef.current.focus();
        }
    }, [routeActive, routeFocused, query]);
    return (
        <label className={classnames(className, styles['search-bar-container'], { 'active': routeActive })} onClick={searchBarOnClick}>
            {
                routeActive ?
                    <TextInput
                        key={query}
                        ref={searchInputRef}
                        className={styles['search-input']}
                        type={'text'}
                        placeholder={'Search'}
                        defaultValue={query}
                        tabIndex={-1}
                        onSubmit={queryInputOnSubmit}
                    />
                    :
                    <div className={styles['search-input']}>
                        <div className={styles['placeholder-label']}>Search</div>
                    </div>
            }
            <Button className={styles['submit-button-container']} tabIndex={-1} onClick={queryInputOnSubmit}>
                <Icon className={styles['icon']} icon={'ic_search'} />
            </Button>
        </label>
    );
};

SearchBar.propTypes = {
    className: PropTypes.string
};

module.exports = SearchBar;
