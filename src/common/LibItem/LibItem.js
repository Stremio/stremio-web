const React = require('react');
const { useServices } = require('stremio/services');
const PropTypes = require('prop-types');
const MetaItem = require('stremio/common/MetaItem');

const OPTIONS = [
    { label: 'Play', value: 'play' },
    { label: 'Details', value: 'details' },
    { label: 'Dismiss', value: 'dismiss' }
];

const LibItem = ({ id, ...props }) => {
    const { core } = useServices();
    const options = React.useMemo(() => {
        return OPTIONS.filter(({ value }) => {
            switch (value) {
                case 'play':
                    return props.deepLinks && typeof props.deepLinks.player === 'string';
                case 'details':
                    return props.deepLinks && (typeof props.deepLinks.meta_details_videos === 'string' || typeof props.deepLinks.meta_details_streams === 'string');
                case 'dismiss':
                    return typeof id === 'string' && props.progress !== null && !isNaN(props.progress);
            }
        });
    }, [id, props.progress, props.deepLinks]);
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
                        if (typeof props.deepLinks.meta_details_videos === 'string') {
                            window.location = props.deepLinks.meta_details_videos;
                        } else if (typeof props.deepLinks.meta_details_streams === 'string') {
                            window.location = props.deepLinks.meta_details_streams;
                        }
                    }

                    break;
                }
                case 'dismiss': {
                    if (typeof id === 'string') {
                        core.dispatch({
                            action: 'Ctx',
                            args: {
                                action: 'RewindLibraryItem',
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
            playIcon={props.progress !== null && !isNaN(props.progress)}
            {...props}
            options={options}
            optionOnSelect={optionOnSelect}
        />
    );
};

LibItem.propTypes = {
    id: PropTypes.string,
    progress: PropTypes.number,
    deepLinks: PropTypes.shape({
        meta_details_videos: PropTypes.string,
        meta_details_streams: PropTypes.string,
        player: PropTypes.string
    }),
    optionOnSelect: PropTypes.func
};

module.exports = LibItem;
