const React = require('react');
const { storiesOf } = require('@storybook/react');
const { action } = require('@storybook/addon-actions');
const ColorInput = require('stremio/common/ColorInput');
const styles = require('./styles');

storiesOf('ColorInput', module).add('ColorInput', () => {
    const [value, setValue] = React.useState('red');
    const onChange = React.useCallback((event) => {
        setValue(event.value);
        action('onChange')(event);
    }, []);
    const domEventHandler = React.useCallback((event) => {
        action('domEventHandler')(event.currentTarget.dataset);
    }, []);
    return (
        <ColorInput
            className={styles['color-input']}
            value={value}
            dataset={{ 'dataset-prop': 'dataset-value' }}
            data-prop={'data-value'}
            onClick={domEventHandler}
            onChange={onChange}
        />
    );
});
