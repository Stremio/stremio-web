const React = require('react');
const PropTypes = require('prop-types');
const classnames = require('classnames');
const Icon = require('stremio-icons/dom');
const TextInput = require('stremio/common/TextInput');
const SearchBarPlaceholder = require('./SearchBarPlaceholder');
const styles = require('./styles');

const SearchBar = ({ className, title, value, onChange }) => {
    return (
        <label title={title} className={classnames(className, styles['search-bar-container'])}>
            <TextInput
                className={styles['search-input']}
                type={'text'}
                placeholder={title}
                value={value}
                onChange={onChange}
            />
            <Icon className={styles['icon']} icon={'ic_search'} />
        </label>
    );
};

SearchBar.Placeholder = SearchBarPlaceholder;

SearchBar.propTypes = {
    className: PropTypes.string,
    title: PropTypes.string,
    value: PropTypes.string,
    onChange: PropTypes.func
};

module.exports = SearchBar;
