const React = require('react');
const PropTypes = require('prop-types');
const Icon = require('stremio-icons/dom');
const { Button } = require('stremio/common');

const InfoMenuButton = ({ className, onToggleInfoMenu }) => {
    const onMouseDown = React.useCallback((event) => {
        event.nativeEvent.infoMenuClosePrevented = true;
    }, []);
    const onClick = React.useCallback(() => {
        if (typeof onToggleInfoMenu === 'function') {
            onToggleInfoMenu();
        }
    }, [onToggleInfoMenu]);
    return (
        <Button className={className} tabIndex={-1} onMouseDown={onMouseDown} onClick={onClick}>
            <Icon className={'icon'} icon={'ic_info'} />
        </Button>
    );
};

InfoMenuButton.propTypes = {
    className: PropTypes.string,
    onToggleInfoMenu: PropTypes.func
};

module.exports = InfoMenuButton;
