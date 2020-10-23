// Copyright (C) 2017-2020 Smart code 203358507

const React = require('react');
const { useServices } = require('stremio/services');
const PropTypes = require('prop-types');
const MetaItem = require('stremio/common/MetaItem');

const OPTIONS = [
    { label: 'Play', value: 'play' },
    { label: 'Details', value: 'details' },
    { label: 'Dismiss', value: 'dismiss' },
    { label: 'Remove', value: 'remove' },
];

const LibItem = ({ id, removable, ...props }) => {
    const { core } = useServices();
    const options = React.useMemo(() => {
        return OPTIONS.filter(({ value }) => {
            switch (value) {
                case 'play':
                    return props.deepLinks && typeof props.deepLinks.player === 'string';
                case 'details':
                    return props.deepLinks && (typeof props.deepLinks.metaDetailsVideos === 'string' || typeof props.deepLinks.metaDetailsStreams === 'string');
                case 'dismiss':
                    return typeof id === 'string' && props.progress !== null && !isNaN(props.progress);
                case 'remove':
                    return typeof id === 'string' && removable;
            }
        });
    }, [id, removable, props.progress, props.deepLinks]);
    const optionOnSelect = React.useCallback((event) => {
        if (typeof props.optionOnSelect === 'function') {
            props.optionOnSelect(event);
        }

        if (!event.nativeEvent.optionSelectPrevented) {
            switch (event.value) {
                case 'play': {
                    if (props.deepLinks && typeof props.deepLinks.player === 'string') {
                        window.location = props.deepLinks.player;
                    }

                    break;
                }
                case 'details': {
                    if (props.deepLinks) {
                        if (typeof props.deepLinks.metaDetailsVideos === 'string') {
                            window.location = props.deepLinks.metaDetailsVideos;
                        } else if (typeof props.deepLinks.metaDetailsStreams === 'string') {
                            window.location = props.deepLinks.metaDetailsStreams;
                        }
                    }

                    break;
                }
                case 'dismiss': {
                    if (typeof id === 'string') {
                        core.transport.dispatch({
                            action: 'Ctx',
                            args: {
                                action: 'RewindLibraryItem',
                                args: id
                            }
                        });
                    }

                    break;
                }
                case 'remove': {
                    if (typeof id === 'string') {
                        core.transport.dispatch({
                            action: 'Ctx',
                            args: {
                                action: 'RemoveFromLibrary',
                                args: id
                            }
                        });
                    }

                    break;
                }
            }
        }
    }, [id, props.deepLinks, props.optionOnSelect]);
    return (
        <MetaItem
            {...props}
            options={options}
            optionOnSelect={optionOnSelect}
        />
    );
};

LibItem.propTypes = {
    id: PropTypes.string,
    removable: PropTypes.bool,
    progress: PropTypes.number,
    deepLinks: PropTypes.shape({
        metaDetailsVideos: PropTypes.string,
        metaDetailsStreams: PropTypes.string,
        player: PropTypes.string
    }),
    optionOnSelect: PropTypes.func
};

module.exports = LibItem;
