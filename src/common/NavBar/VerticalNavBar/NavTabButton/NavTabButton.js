const React = require('react');
const PropTypes = require('prop-types');
const classnames = require('classnames');
const Icon = require('stremio-icons/dom');
const Button = require('stremio/common/Button');
const Image = require('stremio/common/Image');
const styles = require('./styles');

const NavTabButton = ({ className, icon, label, href, selected, details, onClick }) => {
    const renderLogoFallback = React.useMemo(() => () => {
        return (
            <Icon className={styles['icon']} icon={'ic_addons'} />
        );
    }, []);
    return (
        <Button className={classnames(className, styles['nav-tab-button-container'], { 'selected': selected })} title={label} tabIndex={-1} href={href} onClick={onClick}>
            {
                details ?
                    <Image
                        className={styles['logo']}
                        src={icon}
                        alt={' '}
                        renderFallback={renderLogoFallback}
                    />
                    :
                    typeof icon === 'string' && icon.length > 0 ?
                        <Icon className={styles['icon']} icon={icon} />
                        :
                        null
            }
            {
                typeof label === 'string' && label.length > 0 ?
                    <div className={styles['label']}>{label}</div>
                    :
                    null
            }
        </Button>
    );
};

NavTabButton.propTypes = {
    className: PropTypes.string,
    icon: PropTypes.string,
    label: PropTypes.string,
    href: PropTypes.string,
    selected: PropTypes.bool,
    onClick: PropTypes.func
};

module.exports = NavTabButton;
