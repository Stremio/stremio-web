const React = require('react');

const PLAY_OPTION = {
    label: 'Play',
    value: 'play'
};

const DISMISS_OPTION = {
    label: 'Dismiss',
    value: 'dismiss'
};

const onSelect = (event) => {
    // TODO {{event.value}} {{event.dataset}}
};

const useItemOptions = () => {
    const options = React.useMemo(() => ([
        PLAY_OPTION,
        DISMISS_OPTION
    ]), []);
    return [options, onSelect];
};

module.exports = useItemOptions;
