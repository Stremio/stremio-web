// Copyright (C) 2017-2023 Smart code 203358507

const React = require('react');
const PropTypes = require('prop-types');
const classnames = require('classnames');
const { default: Icon } = require('@stremio/stremio-icons/react');
const { Image } = require('stremio/components');
const styles = require('./styles');
const { Link } = require('react-router-dom');

const NavTabButton = ({ className, logo, icon, label, href, selected, onClick }) => {
    const renderLogoFallback = React.useCallback(() => (
        typeof icon === 'string' && icon.length > 0 ?
            <Icon className={styles['icon']} name={icon} />
            :
            null
    ), [icon]);
    const onDoubleClick = () => {
        const scrollableElements = document.querySelectorAll('div');

        scrollableElements.forEach((element) => {
            if (element.scrollTop > 0) {
                element.scrollTo({ top: 0, behavior: 'smooth' });
            }
        });
    };
    return (
        <Link className={classnames(className, styles['nav-tab-button-container'], { 'selected': selected })} title={label} tabIndex={-1} to={href} onClick={onClick} onDoubleClick={onDoubleClick}>
            {
                typeof logo === 'string' && logo.length > 0 ?
                    <Image
                        className={styles['logo']}
                        src={logo}
                        alt={' '}
                        renderFallback={renderLogoFallback}
                    />
                    :
                    typeof icon === 'string' && icon.length > 0 ?
                        <Icon className={styles['icon']} name={selected ? icon : `${icon}-outline`} />
                        :
                        null
            }
            {
                typeof label === 'string' && label.length > 0 ?
                    <div className={styles['label']}>{label}</div>
                    :
                    null
            }
        </Link>
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
