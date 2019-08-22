const React = require('react');
const PropTypes = require('prop-types');
const classnames = require('classnames');
const UrlUtils = require('url');
const Icon = require('stremio-icons/dom');
const { useFocusable } = require('stremio-router');
const Button = require('../../Button');
const TextInput = require('../../TextInput');
const routesRegexp = require('../../routesRegexp');
const useLocationHash = require('../../useLocationHash');
const styles = require('./styles');

const SearchBar = ({ className }) => {
    const locationHash = useLocationHash();
    const focusable = useFocusable();
    const searchInputRef = React.useRef(null);
    const [active, query] = React.useMemo(() => {
        const { pathname: locationPathname, search: locationSearch } = UrlUtils.parse(locationHash.slice(1));
        const active = !!routesRegexp.search.regexp.exec(locationPathname);
        const queryParams = new URLSearchParams(locationSearch);
        const query = (active && queryParams.has('q')) ? queryParams.get('q') : '';
        return [active, query];
    }, [locationHash]);
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
    }, [active, focusable]);
    return (
        <label className={classnames(className, styles['search-bar-container'], { 'active': active })} onClick={searchBarOnClick}>
            {
                active ?
                    <TextInput
                        key={query}
                        ref={searchInputRef}
                        className={styles['search-input']}
                        defaultValue={query}
                        tabIndex={-1}
                        size={1}
                        type={'text'}
                        placeholder={'Search'}
                        autoCorrect={'off'}
                        autoCapitalize={'off'}
                        spellCheck={false}
                        onSubmit={queryInputOnSubmit}
                    />
                    :
                    <div className={styles['search-input']}>
                        <div className={styles['placeholder']}>Search</div>
                    </div>
            }
            <Button className={styles['submit-button']} tabIndex={-1} onClick={queryInputOnSubmit}>
                <Icon className={styles['icon']} icon={'ic_search'} />
            </Button>
        </label>
    );
};

SearchBar.propTypes = {
    className: PropTypes.string
};

module.exports = SearchBar;
