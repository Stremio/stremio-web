const React = require('react');
const PropTypes = require('prop-types');
const classnames = require('classnames');
const NavTabButton = require('stremio/common/NavBar/NavTabButton');
const styles = require('./styles');

const VerticalNavBar = React.memo(({ className, route, tabs }) => {
    return (
        <nav className={classnames(className, styles['nav-bar-container'])}>
            {
                Array.isArray(tabs) && tabs.length > 0 ?
                    tabs.map((tab, index) => (
                        <NavTabButton
                            key={index}
                            className={styles['nav-tab-button']}
                            selected={tab.route === route}
                            href={tab.href}
                            icon={tab.icon}
                            label={tab.label}
                            route={tab.route}
                            direction={'vertical'}
                            onClick={tab.onClick}
                        />
                    ))
                    :
                    null
            }
        </nav>
    );
});

VerticalNavBar.displayName = 'VerticalNavBar';

VerticalNavBar.propTypes = {
    className: PropTypes.string,
    route: PropTypes.string,
    tabs: PropTypes.arrayOf(PropTypes.shape({
        route: PropTypes.string,
        label: PropTypes.string,
        icon: PropTypes.string,
        href: PropTypes.string,
        onClick: PropTypes.func
    }))
};

module.exports = VerticalNavBar;
