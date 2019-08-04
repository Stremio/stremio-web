const React = require('react');
const PropTypes = require('prop-types');
const classnames = require('classnames');
const UrlUtils = require('url');
const Icon = require('stremio-icons/dom');
const Input = require('../../Input');
const routesRegexp = require('../../routesRegexp');
const useLocationHash = require('../../useLocationHash');
const styles = require('./styles');

const NavBarButton = React.memo(({ className, icon, label, href, onClick }) => {
    const locationHash = useLocationHash();
    const routeRegexp = React.useMemo(() => {
        if (typeof href === 'string') {
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
            return routeRegexp.exec(locationPathname);
        }

        return false;
    }, [routeRegexp, locationHash]);
    return (
        <Input className={classnames(className, styles['nav-bar-button-container'], { 'active': active })} tabIndex={-1} type={typeof onClick === 'function' ? 'button' : 'link'} href={href} onClick={onClick}>
            <Icon className={styles['icon']} icon={icon} />
            <div className={styles['label']}>{label}</div>
        </Input>
    );
});

NavBarButton.displayName = 'NavBarButton';

NavBarButton.propTypes = {
    className: PropTypes.string,
    icon: PropTypes.string,
    label: PropTypes.string,
    href: PropTypes.string,
    onClick: PropTypes.func
};

module.exports = NavBarButton;
