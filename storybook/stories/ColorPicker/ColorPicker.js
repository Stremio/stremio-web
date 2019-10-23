const React = require('react');
const { storiesOf } = require('@storybook/react');
const ColorPicker = require('stremio/common/ColorInput/ColorPicker');
const styles = require('./styles');

storiesOf('ColorPicker', module).add('ColorPicker', () => {
    const [color, setColor] = React.useState('rgba(166, 196, 213, 0.97)');
    return (
        <div className={styles['color-picker-container']}>
            <ColorPicker value={color} onChange={setColor} />
            <div className={styles['color-output-label']}>Current color is {color}</div>
        </div>
    );
});
