const React = require('react');
const classnames = require('classnames');
const Icon = require('stremio-icons/dom');
const { Input } = require('stremio-navigation');
const styles = require('./styles');

const NavBarButton = ({ className, icon, label, href, onClick }) => {
    const type = typeof onClick === 'function' ? 'button' : 'link';
    const [active, setActive] = React.useState(window.location.hash === href);
    const onHashChanged = React.useCallback(() => {
        setActive(window.location.hash === href);
    }, [href]);
    React.useEffect(() => {
        window.addEventListener('hashchange', onHashChanged);
        return () => {
            window.removeEventListener('hashchange', onHashChanged);
        };
    }, []);
    return (
        <Input className={classnames(className, styles['button'], { 'active': active })} type={type} href={href} onClick={onClick}>
            <Icon className={styles['icon']} icon={icon} />
            <div className={styles['label']}>{label}</div>
        </Input>
    );
};

module.exports = NavBarButton;
