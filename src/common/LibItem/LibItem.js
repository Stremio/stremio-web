// Copyright (C) 2017-2023 Smart code 203358507

const React = require('react');
const { useServices } = require('stremio/services');
const PropTypes = require('prop-types');
const MetaItem = require('stremio/common/MetaItem');
const useNotifications = require('stremio/common/useNotifications');
const { t } = require('i18next');

const OPTIONS = [
    { label: 'LIBRARY_PLAY', value: 'play' },
    { label: 'LIBRARY_DETAILS', value: 'details' },
    { label: 'LIBRARY_RESUME_DISMISS', value: 'dismiss' },
    { label: 'LIBRARY_REMOVE', value: 'remove' },
];

const LibItem = ({ _id, removable, ...props }) => {
    const { core } = useServices();
    const notifications = useNotifications();
    const newVideos = React.useMemo(() => {
        const count = notifications.items?.[_id]?.length ?? 0;
        return Math.min(Math.max(count, 0), 99);
    }, [_id, notifications.items]);
    const options = React.useMemo(() => {
        return OPTIONS
            .filter(({ value }) => {
                switch (value) {
                    case 'play':
                        return props.deepLinks && typeof props.deepLinks.player === 'string';
                    case 'details':
                        return props.deepLinks && (typeof props.deepLinks.metaDetailsVideos === 'string' || typeof props.deepLinks.metaDetailsStreams === 'string');
                    case 'dismiss':
                        return typeof _id === 'string' && props.progress !== null && !isNaN(props.progress);
                    case 'remove':
                        return typeof _id === 'string' && removable;
                }
            })
            .map((option) => ({
                ...option,
                label: t(option.label)
            }));
    }, [_id, removable, props.progress, props.deepLinks]);
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
    deepLinks: PropTypes.shape({
        metaDetailsVideos: PropTypes.string,
        metaDetailsStreams: PropTypes.string,
        player: PropTypes.string
    }),
    optionOnSelect: PropTypes.func
};

module.exports = LibItem;
