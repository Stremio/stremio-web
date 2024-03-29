// Copyright (C) 2017-2023 Smart code 203358507

const React = require('react');
const { useServices } = require('stremio/services');
const PropTypes = require('prop-types');
const MetaItem = require('stremio/common/MetaItem');
const { t } = require('i18next');

const LibItem = ({ _id, removable, notifications, watched, ...props }) => {

    const { core } = useServices();

    const newVideos = React.useMemo(() => {
        const count = notifications.items?.[_id]?.length ?? 0;
        return Math.min(Math.max(count, 0), 99);
    }, [_id, notifications]);

    const options = React.useMemo(() => {
        return [
            { label: 'LIBRARY_PLAY', value: 'play' },
            { label: 'LIBRARY_DETAILS', value: 'details' },
            { label: 'LIBRARY_RESUME_DISMISS', value: 'dismiss' },
            { label: watched ? 'CTX_MARK_UNWATCHED' : 'CTX_MARK_WATCHED', value: 'watched' },
            { label: 'LIBRARY_REMOVE', value: 'remove' },
        ].filter(({ value }) => {
            switch (value) {
                case 'play':
                    return props.deepLinks && typeof props.deepLinks.player === 'string';
                case 'details':
                    return props.deepLinks && (typeof props.deepLinks.metaDetailsVideos === 'string' || typeof props.deepLinks.metaDetailsStreams === 'string');
                case 'watched':
                    return props.deepLinks && (typeof props.deepLinks.metaDetailsVideos === 'string' || typeof props.deepLinks.metaDetailsStreams === 'string');
                case 'dismiss':
                    return typeof _id === 'string' && props.progress !== null && !isNaN(props.progress) && props.progress > 0;
                case 'remove':
                    return typeof _id === 'string' && removable;
            }
        }).map((option) => ({
            ...option,
            label: t(option.label)
        }));
    }, [_id, removable, props.progress, props.deepLinks, watched]);

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
                case 'watched': {
                    if (typeof _id === 'string') {
                        core.transport.dispatch({
                            action: 'Ctx',
                            args: {
                                action: 'LibraryItemMarkAsWatched',
                                args: {
                                    id: _id,
                                    is_watched: !watched
                                }
                            }
                        });
                    }

                    break;
                }
                case 'dismiss': {
                    if (typeof _id === 'string') {
                        core.transport.dispatch({
                            action: 'Ctx',
                            args: {
                                action: 'RewindLibraryItem',
                                args: _id
                            }
                        });
                        core.transport.dispatch({
                            action: 'Ctx',
                            args: {
                                action: 'DismissNotificationItem',
                                args: _id
                            }
                        });
                    }

                    break;
                }
                case 'remove': {
                    if (typeof _id === 'string') {
                        core.transport.dispatch({
                            action: 'Ctx',
                            args: {
                                action: 'RemoveFromLibrary',
                                args: _id
                            }
                        });
                    }

                    break;
                }
            }
        }
    }, [_id, props.deepLinks, props.optionOnSelect]);

    return (
        <MetaItem
            {...props}
            watched={watched}
            newVideos={newVideos}
            options={options}
            optionOnSelect={optionOnSelect}
        />
    );
};

LibItem.propTypes = {
    _id: PropTypes.string,
    removable: PropTypes.bool,
    progress: PropTypes.number,
    notifications: PropTypes.object,
    watched: PropTypes.bool,
    deepLinks: PropTypes.shape({
        metaDetailsVideos: PropTypes.string,
        metaDetailsStreams: PropTypes.string,
        player: PropTypes.string
    }),
    optionOnSelect: PropTypes.func
};

module.exports = LibItem;
