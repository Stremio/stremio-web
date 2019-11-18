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
    return (
        <ColorInput
            className={styles['color-input']}
            value={value}
            onChange={onChange}
        />
    );
});
