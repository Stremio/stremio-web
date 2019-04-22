const React = require('react');
const classnames = require('classnames');
const UrlUtils = require('url');
const Icon = require('stremio-icons/dom');
const { Input } = require('stremio-navigation');
const useLocationHash = require('../../useLocationHash');
const styles = require('./styles');

const NavBarButton = React.memo(({ className, icon, label, href, onClick }) => {
    const locationHash = useLocationHash();
    const active = React.useMemo(() => {
        const locationHashPath = locationHash.startsWith('#') ? locationHash.slice(1) : '';
        const { pathname } = UrlUtils.parse(locationHashPath);
        return `#${pathname}` === href;
    }, [href, locationHash]);
    const inputType = typeof onClick === 'function' ? 'button' : 'link';
    return (
        <Input className={classnames(className, styles['button'], { 'active': active })} type={inputType} href={href} onClick={onClick}>
            <Icon className={styles['icon']} icon={icon} />
            <div className={styles['label']}>{label}</div>
        </Input>
    );
});

module.exports = NavBarButton;
