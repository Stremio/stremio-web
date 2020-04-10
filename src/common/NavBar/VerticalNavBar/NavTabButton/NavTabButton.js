const React = require('react');
const PropTypes = require('prop-types');
const classnames = require('classnames');
const Icon = require('stremio-icons/dom');
const Button = require('stremio/common/Button');
const Image = require('stremio/common/Image');
const styles = require('./styles');

const NavTabButton = ({ className, logo, icon, label, href, selected, onClick }) => {
    const renderLogoFallback = React.useMemo(() => () => {
        return (
            typeof icon === 'string' && icon.length > 0 ?
                <Icon className={styles['icon']} icon={icon} />
                :
                null
        );
    }, [icon]);
    return (
        <Button className={classnames(className, styles['nav-tab-button-container'], { 'selected': selected })} title={label} tabIndex={-1} href={href} onClick={onClick}>
            <Image
                className={styles['logo']}
                src={logo}
                alt={' '}
                renderFallback={renderLogoFallback}
            />
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
    logo: PropTypes.string,
    icon: PropTypes.string,
    label: PropTypes.string,
    href: PropTypes.string,
    selected: PropTypes.bool,
    onClick: PropTypes.func
};

module.exports = NavTabButton;
