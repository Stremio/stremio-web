const React = require('react');
const { Modal } = require('stremio-router');
const styles = require('./styles');

const DEFAULT_TIMEOUT = 2000;

const Toast = React.forwardRef(({ className }, ref) => {
    const [state, setState] = React.useState({});
    const show = React.useCallback(({ text, timeout }) => {
        setState({
            text,
            timeout: timeout !== null && !isNaN(timeout) ? timeout : DEFAULT_TIMEOUT
        });
    }, []);
    const hide = React.useCallback(() => {
        setState({});
    }, []);
    React.useEffect(() => {
        if (state.timeout !== null && !isNaN(state.timeout)) {
            const timeoutId = setTimeout(() => {
                hide();
            }, state.timeout);
            return () => {
                clearTimeout(timeoutId);
            };
        }
    }, [state]);
    React.useImperativeHandle(ref, () => ({ show, hide }));
    if (typeof state.text !== 'string') {
        return null;
    }

    return (
        <Modal className={className}>
            <div className={styles['label']}>{state.text}</div>
        </Modal>
    );
});

module.exports = Toast;
