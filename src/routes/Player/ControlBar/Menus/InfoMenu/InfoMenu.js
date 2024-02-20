// Copyright (C) 2017-2023 Smart code 203358507

const React = require('react');
const PropTypes = require('prop-types');
const classnames = require('classnames');
// const Stream = require('stremio/routes/MetaDetails/StreamsList/Stream');
// const AddonDetails = require('stremio/common/AddonDetailsModal/AddonDetails');
const { MetaPreview, Menu, CONSTANTS } = require('stremio/common');
const styles = require('./styles');

const InfoMenu = ({ ...props }) => {
    const metaItem = React.useMemo(() => {
        return props.metaItem !== null ?
            {
                ...props.metaItem,
                links: props.metaItem.links.filter(({ category }) => category === CONSTANTS.SHARE_LINK_CATEGORY)
            }
            :
            null;
    }, [props.metaItem]);
    return (
        <Menu className={classnames(styles['info-menu-container'])} shortcut={'KeyI'}>
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
            {/* {
                props.stream !== null ?
                    <Stream
                        {...props.stream}
                        className={classnames(styles['stream'], 'active')}
                        addonName={props.addon !== null ? props.addon.manifest.name : ''}
                    />
                    :
                    null
            } */}
            {/* {
                props.addon !== null ?
                    <AddonDetails
                        id={props.addon.manifest.id}
                        name={props.addon.manifest.name}
                        version={props.addon.manifest.version}
                        logo={props.addon.manifest.logo}
                        description={props.addon.manifest.description}
                        types={props.addon.manifest.types}
                        transportUrl={props.addon.transportUrl}
                    />
                    :
                    null
            } */}
        </Menu>
    );
};

InfoMenu.propTypes = {
    metaItem: PropTypes.object,
    addon: PropTypes.object,
    stream: PropTypes.object
};

module.exports = InfoMenu;
