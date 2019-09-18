const React = require('react');
const { storiesOf } = require('@storybook/react');
const { ColorPicker } = require('stremio/common');
const styles = require('./styles');

const ColorPickerExampleusage = () => {
    const [color, setColor] = React.useState('rgba(166, 196, 213, 0.97)');
    return (
        <div className={styles['demo-container']}>
            <ColorPicker
                value={color}
                onChange={setColor}
            />
            <div className={styles['test-output']}>Current color is {color}</div>
        </div>
    );
}
storiesOf('ColorPicker', module).add('ColorPicker', () => <ColorPickerExampleusage />);
