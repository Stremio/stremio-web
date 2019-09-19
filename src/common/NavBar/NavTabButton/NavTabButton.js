const React = require('react');
const PropTypes = require('prop-types');
const classnames = require('classnames');
const Icon = require('stremio-icons/dom');
const Button = require('stremio/common/Button');
const routesRegexp = require('stremio/common/routesRegexp');
const useRouteActive = require('stremio/common/useRouteActive');
const styles = require('./styles');

const NavTabButton = ({ className, icon, label, href, onClick }) => {
    const routeRegexp = React.useMemo(() => {
        if (typeof href === 'string' && href.startsWith('#')) {
            for (const { regexp } of Object.values(routesRegexp)) {
                if (href.slice(1).match(regexp)) {
                    return regexp;
                }
            }
        }

        return null;
    }, [href]);
    const active = useRouteActive(routeRegexp);
    return (
        <Button className={classnames(className, styles['nav-tab-button-container'], { 'active': active })} title={label} tabIndex={-1} href={href} onClick={onClick}>
            {
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
    onClick: PropTypes.func
};

module.exports = NavTabButton;
