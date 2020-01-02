const React = require('react');
const PropTypes = require('prop-types');
const classnames = require('classnames');
const NavTabButton = require('../NavBar/NavTabButton');
const styles = require('./styles');

const VerticalNavBar = React.memo(({ className, tabs }) => {
    return (
        <nav className={classnames(className, styles['nav-bar-container'])}>
            {
                Array.isArray(tabs) && tabs.length > 0 ?
                    tabs.map(({ href = '', icon = '', label = '', onClick }, index) => (
                        <NavTabButton
                            key={index}
                            className={styles['nav-tab-button']}
                            href={href}
                            icon={icon}
                            label={label}
                            onClick={onClick}
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
    tabs: PropTypes.arrayOf(PropTypes.shape({
        icon: PropTypes.string,
        label: PropTypes.string,
        href: PropTypes.string,
        onClick: PropTypes.func
    }))
};

module.exports = VerticalNavBar;
