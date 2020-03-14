const React = require('react');
const PropTypes = require('prop-types');
const classnames = require('classnames');
const Icon = require('stremio-icons/dom');
const { Button } = require('stremio/common');

const MetaPreviewButton = ({ className, metaResource, onToggleMetaPreview }) => {
    const onMouseDown = React.useCallback((event) => {
        event.nativeEvent.metaPreviewClosePrevented = true;
    }, []);
    const onClick = React.useCallback(() => {
        if (typeof onToggleMetaPreview === 'function') {
            onToggleMetaPreview();
        }
    }, [onToggleMetaPreview]);
    return (
        <Button className={classnames(className, { 'disabled': metaResource === null || metaResource.content.type !== 'Ready' })} tabIndex={-1} onMouseDown={onMouseDown} onClick={onClick}>
            <Icon className={'icon'} icon={'ic_report'} />
        </Button>
    );
};

MetaPreviewButton.propTypes = {
    className: PropTypes.string,
    metaResource: PropTypes.object,
    onToggleMetaPreview: PropTypes.func
};

module.exports = MetaPreviewButton;
