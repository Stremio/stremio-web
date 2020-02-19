const React = require('react');
const PropTypes = require('prop-types');
const classnames = require('classnames');
const Icon = require('stremio-icons/dom');
const Button = require('stremio/common/Button');
const styles = require('./styles');

const AddonsButton = ({ className }) => {
    return (
        <Button className={classnames(className, styles['addons-button-container'])} href={'#/addons'} tabIndex={-1}>
            <Icon className={styles['icon']} icon={'ic_addons'} />
        </Button>
    );
};

AddonsButton.propTypes = {
    className: PropTypes.string
};

module.exports = AddonsButton;
