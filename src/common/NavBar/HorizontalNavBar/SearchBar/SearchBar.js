// Copyright (C) 2017-2020 Smart code 203358507

const React = require('react');
const PropTypes = require('prop-types');
const classnames = require('classnames');
const Icon = require('stremio-icons/dom');
const { useRouteFocused } = require('stremio-router');
const Button = require('stremio/common/Button');
const TextInput = require('stremio/common/TextInput');
const styles = require('./styles');

const SearchBar = ({ className, query, active }) => {
    const routeFocused = useRouteFocused();
    const searchInputRef = React.useRef(null);
    const searchBarOnClick = React.useCallback(() => {
        if (!active) {
            window.location = '#/search';
        }
    }, [active]);
    const queryInputOnSubmit = React.useCallback(() => {
        if (searchInputRef.current !== null) {
            const queryParams = new URLSearchParams([['search', searchInputRef.current.value]]);
            window.location = `#/search?${queryParams.toString()}`;
        }
    }, []);
    React.useEffect(() => {
        if (routeFocused && active) {
            searchInputRef.current.focus();
        }
    }, [routeFocused, active, query]);
    return (
        <label className={classnames(className, styles['search-bar-container'], { 'active': active })} onClick={searchBarOnClick}>
            {
                active ?
                    <TextInput
                        key={query}
                        ref={searchInputRef}
                        className={styles['search-input']}
                        type={'text'}
                        placeholder={'Search or paste link'}
                        defaultValue={query}
                        tabIndex={-1}
                        onSubmit={queryInputOnSubmit}
                    />
                    :
                    <div className={styles['search-input']}>
                        <div className={styles['placeholder-label']}>Search or paste link</div>
                    </div>
            }
            <Button className={styles['submit-button-container']} tabIndex={-1} onClick={queryInputOnSubmit}>
                <Icon className={styles['icon']} icon={'ic_search_link'} />
            </Button>
        </label>
    );
};

SearchBar.propTypes = {
    className: PropTypes.string,
    query: PropTypes.string,
    active: PropTypes.bool
};

module.exports = SearchBar;
