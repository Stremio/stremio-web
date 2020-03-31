const React = require('react');
const PropTypes = require('prop-types');
const classnames = require('classnames');
const Icon = require('stremio-icons/dom');
const { Button } = require('stremio/common');

const InfoMenuButton = ({ className, metaResource, onToggleInfoMenu }) => {
    const onMouseDown = React.useCallback((event) => {
        event.nativeEvent.infoMenuClosePrevented = true;
    }, []);
    const onClick = React.useCallback(() => {
        if (typeof onToggleInfoMenu === 'function') {
            onToggleInfoMenu();
        }
    }, [onToggleInfoMenu]);
    return (
        <Button className={classnames(className, { 'disabled': metaResource === null || metaResource.content.type !== 'Ready' })} tabIndex={-1} onMouseDown={onMouseDown} onClick={onClick}>
            <Icon className={'icon'} icon={'ic_info'} />
        </Button>
    );
};

InfoMenuButton.propTypes = {
    className: PropTypes.string,
    metaResource: PropTypes.object,
    onToggleInfoMenu: PropTypes.func
};

module.exports = InfoMenuButton;
