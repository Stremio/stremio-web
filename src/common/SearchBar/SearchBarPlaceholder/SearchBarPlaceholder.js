// Copyright (C) 2017-2023 Smart code 203358507

const React = require('react');
const PropTypes = require('prop-types');
const classnames = require('classnames');
const Icon = require('@stremio/stremio-icons/dom');
const styles = require('./styles');

const SearchBarPlaceholder = ({ className, title }) => {
    return (
        <div className={classnames(className, styles['search-bar-container'])}>
            <div className={styles['search-input']}>{title}</div>
            <Icon className={styles['icon']} icon={'ic_search'} />
        </div>
    );
};

SearchBarPlaceholder.propTypes = {
    className: PropTypes.string,
    title: PropTypes.string
};

module.exports = SearchBarPlaceholder;
