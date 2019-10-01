const React = require('react');
const { storiesOf } = require('@storybook/react');
const { Toast } = require('stremio/common');
const styles = require('./styles');

storiesOf('Toast', module).add('SimpleToast', () => {
    const toastRef = React.useRef(null);
    const showToast = (message) => React.useCallback(() => {
        toastRef.current.show({ title: 'Something to take your attention', timeout: 0, type: 'info', icon: 'ic_sub', closeButton: true, ...message });
    }, []);

    const clickSuccess = showToast({ title: 'You clicked it', text: 'Congratulations! Click event handled successfully.', type: 'success', icon: 'ic_check', timeout: 2e3 });

    return (
        <div className={styles['root-container']}>
            <button onClick={showToast({ text: 'Longer message that contains a lot of words but it does not state anything. The idea is to test the handling of long messages.' })}>Long message</button>
            <button onClick={showToast({ text: 'This will close after 3 seconds', timeout: 3e3 })}>Timeout 3s</button>
            <button onClick={showToast({ text: 'Click me and see what happens later', title: 'Click here!', onClick: clickSuccess })}>Clickable</button>
            <button onClick={showToast({ text: 'Type success', type: 'success', icon: 'ic_check' })}>Success</button>
            <button onClick={showToast({ text: 'Type alert', type: 'alert', icon: 'ic_warning' })}>Alert</button>
            <button onClick={showToast({ text: 'Type error', type: 'error', icon: 'ic_x' })}>Error</button>
            <button onClick={showToast({ text: 'No title', type: 'info', title: null, icon: null })}>No title</button>
            <button onClick={() => toastRef.current.show({})}>Empty</button>
            <button onClick={() => toastRef.current.hideAll()}>Close all</button>
            <Toast ref={toastRef} className={styles['toasts-container']} />
        </div>
    );
});
