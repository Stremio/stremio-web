const React = require('react');
const PropTypes = require('prop-types');
const classnames = require('classnames');
const { MetaPreview, CONSTANTS } = require('stremio/common');
const styles = require('./styles');

const InfoMenu = ({ className, ...props }) => {
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
        </div>
    );
};

InfoMenu.propTypes = {
    className: PropTypes.string,
    metaItem: PropTypes.object
};

module.exports = InfoMenu;
