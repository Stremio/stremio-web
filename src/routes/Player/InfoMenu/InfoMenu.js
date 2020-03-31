const React = require('react');
const PropTypes = require('prop-types');
const classnames = require('classnames');
const MetaPreview = require('stremio/common/MetaPreview');
const styles = require('./styles');

const InfoMenu = ({ className }) => {
    const onMouseDown = React.useCallback((event) => {
        event.nativeEvent.infoMenuClosePrevented = true;
    }, []);
    return (
        <div className={classnames(className, styles['info-menu-container'])} onMouseDown={onMouseDown}>
            <MetaPreview name={'Info menu name'} />
        </div>
    );
};

InfoMenu.propTypes = {
    className: PropTypes.string,
};

module.exports = InfoMenu;
