const React = require('react');
const { useServices } = require('stremio/services');

const CoreSuspenderContext = React.createContext();

CoreSuspenderContext.displayName = 'CoreSuspenderContext';

function wrapPromise(promise) {
    let status = 'pending';
    let result;
    const suspender = promise.then(
        (resp) => {
            status = 'success';
            result = resp;
        },
        (error) => {
            status = 'error';
            result = error;
        }
    );
    return {
        read() {
            if (status === 'pending') {
                throw suspender;
            } else if (status === 'error') {
                throw result;
            } else if (status === 'success') {
                return result;
            }
        }
    };
}

const withCoreSuspender = (Component, Fallback = () => { }) => {
    return function withCoreSuspender(props) {
        const { core } = useServices();
        const statesRef = React.useRef({});
        const streamsRef = React.useRef({});
        const getState = React.useCallback((model) => {
            if (!statesRef.current[model]) {
                statesRef.current[model] = wrapPromise(core.transport.getState(model));
            }

            return statesRef.current[model].read();
        }, []);
        const decodeStream = React.useCallback((stream) => {
            if (!streamsRef.current[stream]) {
                streamsRef.current[stream] = wrapPromise(core.transport.decodeStream(stream));
            }

            return streamsRef.current[stream].read();
        }, []);
        return (
            <React.Suspense fallback={<Fallback {...props} />}>
                <CoreSuspenderContext.Provider value={{ getState, decodeStream }}>
                    <Component {...props} />
                </CoreSuspenderContext.Provider>
            </React.Suspense>
        );
    };
};

const useCoreSuspender = () => {
    return React.useContext(CoreSuspenderContext);
};

module.exports = { withCoreSuspender, useCoreSuspender };
