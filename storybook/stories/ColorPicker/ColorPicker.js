// Copyright (C) 2017-2020 Smart code 203358507

const React = require('react');
const { storiesOf } = require('@storybook/react');
const ColorPicker = require('stremio/common/ColorInput/ColorPicker');
const styles = require('./styles');

storiesOf('ColorPicker', module).add('ColorPicker', () => {
    const [color, setColor] = React.useState('#f00000ff');
    const colorPickerOnInput = React.useCallback((event) => {
        setColor(event.value);
    }, []);
    return (
        <div className={styles['color-picker-container']}>
            <ColorPicker value={color} onInput={colorPickerOnInput} />
            <div className={styles['color-output-label']}>Current color is {color}</div>
        </div>
    );
});
