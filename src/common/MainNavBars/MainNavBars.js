const React = require('react');
const PropTypes = require('prop-types');
const classnames = require('classnames');
const { VerticalNavBar, HorizontalNavBar } = require('stremio/common/NavBar');
const styles = require('./styles');

const TABS = [
    { id: 'board', label: 'Board', icon: 'ic_board', href: '#/' },
    { id: 'discover', label: 'Discover', icon: 'ic_discover', href: '#/discover' },
    { id: 'library', label: 'Library', icon: 'ic_library', href: '#/library' }
];

const MainNavBars = React.memo(({ className, route, children }) => {
    return (
        <div className={classnames(className, styles['main-nav-bars-container'])}>
            <HorizontalNavBar
                className={styles['horizontal-nav-bar']}
                route={route}
                backButton={false}
                searchBar={true}
                addonsButton={true}
                fullscreenButton={true}
                navMenu={true}
            />
            <VerticalNavBar
                className={styles['vertical-nav-bar']}
                selected={route}
                tabs={TABS}
            />
            <div className={styles['nav-content-container']}>{children}</div>
        </div>
    );
});

MainNavBars.displayName = 'MainNavBars';

MainNavBars.propTypes = {
    className: PropTypes.string,
    route: PropTypes.string,
    children: PropTypes.node
};

module.exports = MainNavBars;
