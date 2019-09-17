const React = require('react');
const { storiesOf } = require('@storybook/react');
const { ColorPicker } = require('stremio/common');
const styles = require('./styles');

const ColorPickerExampleusage = () => {
    const [color, setColor] = React.useState('rgba(166, 196, 213, 0.97)');
    return (
        <div style={{ color: 'var(--color-surfacelighter)', padding: '1em' }}>
            <ColorPicker
                className={styles['color-picker-container']}
                value={color}
                onChange={(color) => { setColor(color) }}
            />
            <div style={{ marginTop: '1em' }}>Current color is {color}</div>
        </div>
    );
}
storiesOf('ColorPicker', module).add('ColorPicker', () => <ColorPickerExampleusage />);
