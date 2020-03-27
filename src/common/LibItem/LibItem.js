const React = require('react');
const { useServices } = require('stremio/services');
const PropTypes = require('prop-types');
const MetaItem = require('stremio/common/MetaItem');

const OPTIONS = [
    { label: 'Play', value: 'play' },
    { label: 'Details', value: 'details' },
    { label: 'Dismiss', value: 'dismiss' }
];

const LibItem = ({ id, videoId, ...props }) => {
    const { core } = useServices();
    const options = React.useMemo(() => {
        return OPTIONS.filter(({ value }) => {
            return value !== 'dismiss' || (props.progress !== null && !isNaN(props.progress));
        });
    }, [props.progress]);
    const playIcon = React.useMemo(() => {
        return props.progress !== null && !isNaN(props.progress);
    }, [props.progress]);
    const dataset = React.useMemo(() => ({
        id,
        videoId,
        type: props.type,
        ...props.dataset
    }), [id, videoId, props.type, props.dataset]);
    const optionOnSelect = React.useCallback((event) => {
        if (typeof props.optionOnSelect === 'function') {
            props.optionOnSelect(event);
        }

        if (!event.nativeEvent.optionSelectPrevented) {
            switch (event.value) {
                case 'play': {
                    if (typeof event.dataset.id === 'string' && typeof event.dataset.type === 'string') {
                        // TODO check streams storage
                        // TODO check behaviour_hints
                        // TODO add videos page to the history stack if needed
                        window.location = `#/metadetails/${encodeURIComponent(event.dataset.type)}/${encodeURIComponent(event.dataset.id)}${typeof event.dataset.videoId === 'string' ? `/${encodeURIComponent(event.dataset.videoId)}` : ''}`;
                    }

                    break;
                }
                case 'details': {
                    if (typeof event.dataset.id === 'string' && typeof event.dataset.type === 'string') {
                        // TODO check streams storage
                        // TODO check behaviour_hints
                        // TODO add videos page to the history stack if needed
                        window.location = `#/metadetails/${encodeURIComponent(event.dataset.type)}/${encodeURIComponent(event.dataset.id)}${typeof event.dataset.videoId === 'string' ? `/${encodeURIComponent(event.dataset.videoId)}` : ''}`;
                    }

                    break;
                }
                case 'dismiss': {
                    if (typeof event.dataset.id === 'string') {
                        core.dispatch({
                            action: 'Ctx',
                            args: {
                                action: 'RewindLibraryItem',
                                args: event.dataset.id
                            }
                        });
                    }

                    break;
                }
            }
        }
    }, [props.optionOnSelect]);
    return (
        <MetaItem
            options={options}
            playIcon={playIcon}
            {...props}
            dataset={dataset}
            optionOnSelect={optionOnSelect}
        />
    );
};

LibItem.propTypes = {
    id: PropTypes.string,
    videoId: PropTypes.string,
    type: PropTypes.string,
    progress: PropTypes.number,
    dataset: PropTypes.object,
    optionOnSelect: PropTypes.func
};

module.exports = LibItem;
