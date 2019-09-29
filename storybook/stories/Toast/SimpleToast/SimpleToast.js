const React = require('react');
const { storiesOf } = require('@storybook/react');
const { Toast } = require('stremio/common');
const styles = require('./styles');

storiesOf('Toast', module).add('SimpleToast', () => {
    const toastRef = React.useRef(null);
    const showToast = React.useCallback(() => {
        toastRef.current.show({ text: 'Simple toast message' });
    }, []);
    return (
        <div className={styles['root-container']} onClick={showToast}>
            <Toast ref={toastRef} />
        </div>
    );
});
