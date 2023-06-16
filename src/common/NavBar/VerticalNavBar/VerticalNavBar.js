// Copyright (C) 2017-2023 Smart code 203358507

const React = require('react');
const PropTypes = require('prop-types');
const classnames = require('classnames');
const { useTranslation } = require('react-i18next');
const NavTabButton = require('./NavTabButton');
const styles = require('./styles');

const VerticalNavBar = React.memo(({ className, selected, tabs }) => {
    const { t } = useTranslation();
    return (
        <nav className={classnames(className, styles['vertical-nav-bar-container'])}>
            {
                Array.isArray(tabs) ?
                    tabs.map((tab, index) => (
                        <NavTabButton
                            key={index}
                            className={styles['nav-tab-button']}
                            selected={tab.id === selected}
                            href={tab.href}
                            logo={tab.logo}
                            icon={tab.icon}
                            label={t(tab.label)}
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
    selected: PropTypes.string,
    tabs: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.string,
        label: PropTypes.string,
        logo: PropTypes.string,
        icon: PropTypes.string,
        href: PropTypes.string,
        onClick: PropTypes.func
    }))
};

module.exports = VerticalNavBar;
