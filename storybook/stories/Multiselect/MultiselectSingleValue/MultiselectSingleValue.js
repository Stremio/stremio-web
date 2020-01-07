const React = require('react');
const { storiesOf } = require('@storybook/react');
const { action } = require('@storybook/addon-actions');
const { Multiselect } = require('stremio/common');
const styles = require('./styles');

storiesOf('Multiselect', module).add('MultiselectSingleValue', () => {
    const [selected, setSelected] = React.useState(['a']);
    const onSelect = React.useCallback((event) => {
        action('onSelect')(event);
        setSelected([event.value]);
    }, []);
    const domEventHandler = React.useCallback((event) => {
        action('domEventHandler')(event.currentTarget.dataset);
    }, []);
    return (
        <Multiselect
            className={styles['label-container']}
            direction={'bottom'}
            title={'MultiselectSingleValue'}
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
            data-prop={'data-value'}
            onClick={domEventHandler}
        />
    );
});