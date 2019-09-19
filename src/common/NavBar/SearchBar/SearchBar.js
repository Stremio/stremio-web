const React = require('react');
const PropTypes = require('prop-types');
const classnames = require('classnames');
const UrlUtils = require('url');
const Icon = require('stremio-icons/dom');
const { useFocusable } = require('stremio-router');
const Button = require('stremio/common/Button');
const TextInput = require('stremio/common/TextInput');
const routesRegexp = require('stremio/common/routesRegexp');
const useLocationHash = require('stremio/common/useLocationHash');
const useRouteActive = require('stremio/common/useRouteActive');
const styles = require('./styles');

const SearchBar = ({ className }) => {
    const locationHash = useLocationHash();
    const focusable = useFocusable();
    const searchInputRef = React.useRef(null);
    const active = useRouteActive(routesRegexp.search.regexp);
    const query = React.useMemo(() => {
        if (active) {
            const { search: locationSearch } = UrlUtils.parse(locationHash.slice(1));
            const queryParams = new URLSearchParams(locationSearch);
            return queryParams.has('q') ? queryParams.get('q') : '';
        }

        return '';
    }, [active, locationHash]);
    const searchBarOnClick = React.useCallback(() => {
        if (!active) {
            window.location = '#/search';
        }
    }, [active]);
    const queryInputOnSubmit = React.useCallback(() => {
        if (active) {
            window.location.replace(`#/search?q=${searchInputRef.current.value}`);
        }
    }, [active]);
    React.useEffect(() => {
        if (active && focusable) {
            searchInputRef.current.focus();
        }
    }, [active, focusable, query]);
    return (
        <label className={classnames(className, styles['search-bar-container'], { 'active': active })} onClick={searchBarOnClick}>
            {
                active ?
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
