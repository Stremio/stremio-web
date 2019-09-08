const React = require('react');
const PropTypes = require('prop-types');
const classnames = require('classnames');
const UrlUtils = require('url');
const Icon = require('stremio-icons/dom');
const Button = require('stremio/common/Button');
const routesRegexp = require('stremio/common/routesRegexp');
const useLocationHash = require('stremio/common/useLocationHash');
const styles = require('./styles');

const NavTabButton = ({ className, icon, label, href, onClick }) => {
    const locationHash = useLocationHash();
    const routeRegexp = React.useMemo(() => {
        if (typeof href === 'string' && href.length > 0) {
            for (const { regexp } of Object.values(routesRegexp)) {
                if (regexp.exec(href.slice(1))) {
                    return regexp;
                }
            }
        }

        return null;
    }, [href]);
    const active = React.useMemo(() => {
        if (routeRegexp !== null) {
            const { pathname: locationPathname } = UrlUtils.parse(locationHash.slice(1));
            return !!locationPathname.match(routeRegexp);
        }

        return false;
    }, [routeRegexp, locationHash]);
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
