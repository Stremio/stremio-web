const React = require('react');
const { storiesOf } = require('@storybook/react');
const { action } = require('@storybook/addon-actions');
const { Multiselect } = require('stremio/common');
const styles = require('./styles');

storiesOf('Multiselect', module).add('MultiselectNotAutoClosing', () => {
    const [selected, setSelected] = React.useState(['a']);
    const onSelect = React.useCallback((event) => {
        action('onSelect')(event);
        if (selected.includes(event.value)) {
            setSelected(selected.filter((value) => value !== event.value));
        } else {
            setSelected([...selected, event.value]);
        }

        event.nativeEvent.closeMenuPrevented = true;
    }, [selected]);
    return (
        <Multiselect
            className={styles['label-container']}
            direction={'bottom-right'}
            title={'MultiselectNotAutoClosing'}
            options={[
                { value: 'a', label: 'A' },
                { value: 'b' },
                { value: 'c', label: 'C' },
            ]}
            selected={selected}
            disabled={false}
            dataset={{ prop: 'value' }}
            renderLabelContent={null}
            renderLabelText={null}
            onOpen={action('onOpen')}
            onClose={action('onClose')}
            onSelect={onSelect}
        />
    );
});