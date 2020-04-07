const React = require('react');
const PropTypes = require('prop-types');
const classnames = require('classnames');
const Stream = require('stremio/routes/MetaDetails/StreamsList/Stream');
const { MetaPreview, CONSTANTS } = require('stremio/common');
const styles = require('./styles');

const InfoMenu = ({ className, ...props }) => {
    // TODO handle addon ui
    const metaItem = React.useMemo(() => {
        return props.metaItem !== null ?
            {
                ...props.metaItem,
                links: props.metaItem.links.filter(({ category }) => category === CONSTANTS.SHARE_LINK_CATEGORY)
            }
            :
            null;
    }, [props.metaItem]);
    const onMouseDown = React.useCallback((event) => {
        event.nativeEvent.infoMenuClosePrevented = true;
    }, []);
    return (
        <div className={classnames(className, styles['info-menu-container'])} onMouseDown={onMouseDown}>
            {
                metaItem !== null ?
                    <MetaPreview
                        className={styles['meta-preview']}
                        compact={true}
                        name={metaItem.name}
                        logo={metaItem.logo}
                        runtime={metaItem.runtime}
                        releaseInfo={metaItem.releaseInfo}
                        released={metaItem.released}
                        description={metaItem.description}
                        links={metaItem.links}
                    />
                    :
                    null
            }
            {
                props.stream !== null ?
                    <Stream
                        {...props.stream}
                        className={classnames(styles['stream'], 'active')}
                        addonName={props.addon !== null ? props.addon.manifest.name : ''}
                    />
                    :
                    null
            }
        </div>
    );
};

InfoMenu.propTypes = {
    className: PropTypes.string,
    metaItem: PropTypes.object,
    addon: PropTypes.object,
    stream: PropTypes.object
};

module.exports = InfoMenu;
