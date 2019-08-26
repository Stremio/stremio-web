const React = require('react');
const PropTypes = require('prop-types');
const classnames = require('classnames');
const Icon = require('stremio-icons/dom');
const Button = require('stremio/common/Button');
const styles = require('./styles');

const ActionButton = ({ className, icon = '', label = '', ...props }) => {
    return (
        <Button {...props} className={classnames(className, styles['action-button-container'])} title={label}>
            {
                typeof icon === 'string' && icon.length > 0 ?
                    <Icon className={styles['icon']} icon={icon} />
                    :
                    null
            }
            {
                typeof label === 'string' && label.length > 0 ?
                    <div className={styles['label-container']}>
                        <div className={styles['label']}>{label}</div>
                    </div>
                    :
                    null
            }
        </Button>
    );
};

ActionButton.propTypes = {
    icon: PropTypes.string,
    label: PropTypes.string
};

module.exports = ActionButton;
