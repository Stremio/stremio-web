// Copyright (C) 2017-2023 Smart code 203358507

const React = require('react');
const { useNavigate } = require('react-router');
const { useNavigateWithOrigin } = require('stremio-router');
const { default: toPath } = require('stremio-router/toPath');
const PropTypes = require('prop-types');
const { useCore } = require('stremio/core');
const { default: getMetaDetailsHref } = require('stremio/common/getMetaDetailsHref');
const MetaItem = require('stremio/components/MetaItem');
const { t } = require('i18next');

const LibItem = ({ _id, removable, notifications, watched, detailsVideosFirst, ...props }) => {
    const navigate = useNavigate();
    const { navigateWithOrigin } = useNavigateWithOrigin();
    const core = useCore();
    const detailsHref = React.useMemo(() => getMetaDetailsHref(props.deepLinks, detailsVideosFirst), [props.deepLinks, detailsVideosFirst]);
    const playerHref = props.deepLinks && typeof props.deepLinks.player === 'string' ? props.deepLinks.player : null;

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
                    return typeof playerHref === 'string';
                case 'details':
                    return typeof detailsHref === 'string';
                case 'watched':
                    return typeof watched !== 'undefined' && typeof detailsHref === 'string';
                case 'dismiss':
                    return typeof _id === 'string' && props.progress !== null && !isNaN(props.progress) && props.progress > 0;
                case 'remove':
                    return typeof _id === 'string' && removable;
            }
        }).map((option) => ({
            ...option,
            label: t(option.label)
        }));
    }, [_id, removable, props.progress, playerHref, detailsHref, watched]);

    const optionOnSelect = React.useCallback((event) => {
        if (typeof props.optionOnSelect === 'function') {
            props.optionOnSelect(event);
        }

        if (!event.nativeEvent.optionSelectPrevented) {
            switch (event.value) {
                case 'play': {
                    if (typeof playerHref === 'string') {
                        navigate(toPath(playerHref));
                    }

                    break;
                }
                case 'details': {
                    if (typeof detailsHref === 'string') {
                        navigateWithOrigin(detailsHref);
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
    }, [_id, detailsHref, navigate, navigateWithOrigin, playerHref, props.optionOnSelect, watched]);

    const onPlayClick = React.useCallback((event) => {
        event.preventDefault();
        if (typeof playerHref === 'string') {
            navigate(toPath(playerHref));
        }
    }, [navigate, playerHref]);

    return (
        <MetaItem
            {...props}
            href={detailsHref}
            watched={watched}
            newVideos={newVideos}
            options={options}
            optionOnSelect={optionOnSelect}
            onPlayClick={typeof playerHref === 'string' ? onPlayClick : null}
        />
    );
};

LibItem.propTypes = {
    _id: PropTypes.string,
    removable: PropTypes.bool,
    progress: PropTypes.number,
    notifications: PropTypes.object,
    watched: PropTypes.bool,
    detailsVideosFirst: PropTypes.bool,
    deepLinks: PropTypes.shape({
        metaDetailsVideos: PropTypes.string,
        metaDetailsStreams: PropTypes.string,
        player: PropTypes.string
    }),
    optionOnSelect: PropTypes.func
};

module.exports = LibItem;
