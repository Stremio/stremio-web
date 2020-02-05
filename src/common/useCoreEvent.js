const React = require('react');
const { useRouteFocused } = require('stremio-router');
const { useServices } = require('stremio/services');

const useCoreEvent = (onEvent) => {
    const { core } = useServices();
    const routeFocused = useRouteFocused();
    React.useLayoutEffect(() => {
        if (routeFocused) {
            core.on('Event', onEvent);
        }
        return () => {
            core.off('Event', onEvent);
        };
    }, [routeFocused, onEvent]);
};

module.exports = useCoreEvent;
